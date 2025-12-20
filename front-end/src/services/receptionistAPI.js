// services/receptionistAPI.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Chưa đăng nhập');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const redirectToLogin = () => {
    console.log('⚠️ Session expired - logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // ⭐ Redirect về trang chủ (trang chủ có modal login)
    window.location.href = '/';
};

// Hàm xử lý response
const handleResponse = async (response) => {
    const text = await response.text();

    // Check if HTML instead of JSON
    if (text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
        console.error('❌ Received HTML instead of JSON:', text.substring(0, 200));
        redirectToLogin();
        throw new Error('Phiên đăng nhập đã hết hạn');
    }

    // Parse JSON
    let data;
    try {
        data = text ? JSON.parse(text) : {};
    } catch (e) {
        console.error('❌ JSON parse error:', text);
        throw new Error('Dữ liệu trả về không hợp lệ');
    }

    if (!response.ok) {
        // 401, 403 → Logout
        if (response.status === 401 || response.status === 403) {
            console.error('❌ Unauthorized:', response.status);
            redirectToLogin();
            throw new Error('Phiên đăng nhập đã hết hạn');
        }

        // Validation errors
        if (data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map(err => err.message).join(', ');
            throw new Error(errorMessages);
        }

        throw new Error(data.message || data.error || 'Có lỗi xảy ra');
    }

    return data;
};

const safeFetch = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    });

    return handleResponse(response);
};

export const receptionistAPI = {
    // Dashboard
    getDashboardStats: async () => {
        return safeFetch(`${API_BASE_URL}/receptionist/dashboard/stats`);
    },

    // Lấy lịch hẹn theo ngày (cho lễ tân)
    getAppointmentsByDate: async (date, filters = {}) => {
        const params = new URLSearchParams();

        if (date) params.append('date', date);
        if (filters.doctorId) params.append('doctorId', filters.doctorId);
        if (filters.status !== undefined && filters.status !== '') {
            params.append('status', filters.status);
        }
        if (filters.search) params.append('search', filters.search);

        return safeFetch(`${API_BASE_URL}/appointments/by-date?${params.toString()}`);
    },


    // Appointments
    getTodayAppointments: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.doctorId) params.append('doctorId', filters.doctorId);
        if (filters.status !== undefined && filters.status !== '') params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);

        const url = `${API_BASE_URL}/receptionist/appointments/today`;
        return safeFetch(params.toString() ? `${url}?${params}` : url);
    },

    confirmAppointment: async (id, note = null) => {
        return safeFetch(`${API_BASE_URL}/receptionist/appointments/${id}/confirm`, {
            method: 'PUT',
            body: JSON.stringify({ ghi_chu_lich_hen: note })
        });
    },

    checkInAppointment: async (id) => {
        return safeFetch(`${API_BASE_URL}/receptionist/appointments/${id}/check-in`, {
            method: 'PUT'
        });
    },

    markNoShow: async (id) => {
        return safeFetch(`${API_BASE_URL}/receptionist/appointments/${id}/no-show`, {
            method: 'PUT'
        });
    },

    updateNote: async (id, note) => {
        return safeFetch(`${API_BASE_URL}/receptionist/appointments/${id}/note`, {
            method: 'PUT',
            body: JSON.stringify({ ghi_chu_lich_hen: note })
        });
    },

    // Queue
    getQueue: async (doctorId, date) => {
        const params = date ? `?date=${date}` : '';
        return safeFetch(`${API_BASE_URL}/receptionist/queue/${doctorId}${params}`);
    },

    getNextAppointment: async (doctorId) => {
        return safeFetch(`${API_BASE_URL}/receptionist/queue/${doctorId}/next`);
    },

    // Patients
    searchPatients: async (search) => {
        return safeFetch(`${API_BASE_URL}/receptionist/patients/search?search=${encodeURIComponent(search)}`);
    },

    createWalkInPatient: async (data) => {
        return safeFetch(`${API_BASE_URL}/receptionist/patients/walk-in`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    // Patients
    getPatients: async (params = {}) => {
        const query = new URLSearchParams();

        if (params.search) query.append('search', params.search);
        if (params.page) query.append('page', params.page);
        if (params.limit) query.append('limit', params.limit);

        const url = `${API_BASE_URL}/patients`;
        return safeFetch(query.toString() ? `${url}?${query}` : url);
    },

    getPatientByPhone: async (phone) => {
        return safeFetch(`${API_BASE_URL}/patients/phone/${phone}`);
    },

    createAppointment: async (data) => {
        const res = await fetch(`${API_BASE_URL}/receptionist/appointments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(res);
    },


};