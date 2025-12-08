const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function để handle response
const handleResponse = async (response) => {
    const data = await response.json();

    console.log('API Response:', response.status, data); // ⭐ Debug

    if (!response.ok) {
        // Nếu có errors array (validation errors)
        if (data.errors && Array.isArray(data.errors)) {
            const errorMessages = data.errors.map(err => err.message).join(', ');
            throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Có lỗi xảy ra');
    }
    return data;
};
// API calls
export const bookingAPI = {
    // Lấy danh sách chuyên khoa
    getSpecialties: async () => {
        const response = await fetch(`${API_BASE_URL}/specialties`);
        return handleResponse(response);
    },

    // Lấy danh sách bác sĩ
    getDoctors: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/doctors?${queryString}`);
        return handleResponse(response);
    },

    // Lấy chi tiết bác sĩ
    getDoctorById: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`);
        return handleResponse(response);
    },

    // Lấy danh sách dịch vụ
    getServices: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/services?${queryString}`);
        return handleResponse(response);
    },

    // ⭐ Lấy available slots
    getAvailableSlots: async (doctorId, date, slotDuration = 30) => {
        const params = new URLSearchParams({ doctorId, date, slotDuration });
        const response = await fetch(`${API_BASE_URL}/appointments/available-slots?${params}`);
        return handleResponse(response);
    },

    // Check availability
    checkAvailability: async (data) => {
        const response = await fetch(`${API_BASE_URL}/appointments/check-availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Đặt lịch (khách vãng lai)
    createGuestAppointment: async (data) => {
        console.log('createGuestAppointment - Request data:', data); // ⭐ Debug

        const response = await fetch(`${API_BASE_URL}/appointments/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Đặt lịch (đã đăng nhập)
    createAuthAppointment: async (data, token) => {
        console.log('createAuthAppointment - Request data:', data); // ⭐ Debug

        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },
    // Lấy lịch hẹn của tôi
    getMyAppointments: async (token, status = null) => {
        const params = new URLSearchParams();
        if (status !== null) params.append('status', status);

        const response = await fetch(`${API_BASE_URL}/appointments/my?${params}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    },

    // Hủy lịch hẹn
    cancelAppointment: async (appointmentId, reason, token) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ly_do_huy_lich_hen: reason })
        });
        return handleResponse(response);
    },

    // Lấy chi tiết lịch hẹn
    getAppointmentById: async (appointmentId, token) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return handleResponse(response);
    }
};