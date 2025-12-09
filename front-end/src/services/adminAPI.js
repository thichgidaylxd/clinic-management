const API_BASE_URL = 'http://localhost:5000/api/v1';

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
    }
    return data;
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const adminAPI = {
    // =================== SPECIALTIES ===================
    getSpecialties: async (page = 1, limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/specialties?page=${page}&limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    createSpecialty: async (data) => {
        const response = await fetch(`${API_BASE_URL}/specialties`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateSpecialty: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/specialties/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteSpecialty: async (id) => {
        const response = await fetch(`${API_BASE_URL}/specialties/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // =================== SERVICES ===================
    getServices: async (page = 1, limit = 10, specialtyId = null) => {
        const params = new URLSearchParams({ page, limit });
        if (specialtyId) params.append('specialtyId', specialtyId);
        const response = await fetch(
            `${API_BASE_URL}/services?${params}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    createService: async (data) => {
        const response = await fetch(`${API_BASE_URL}/services`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateService: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteService: async (id) => {
        const response = await fetch(`${API_BASE_URL}/services/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // =================== DOCTORS ===================
    getDoctors: async (page = 1, limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/doctors?page=${page}&limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // DOCTORS - Cập nhật createDoctor
    createDoctor: async (data) => {
        const response = await fetch(`${API_BASE_URL}/doctors`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateDoctor: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteDoctor: async (id) => {
        const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Thêm vào file adminAPI.js

    // =================== SCHEDULES (WORK SCHEDULES) ===================
    getSchedules: async (page = 1, limit = 10, doctorId = null, date = null) => {
        const params = new URLSearchParams({ page, limit });
        if (doctorId) params.append('doctorId', doctorId);
        if (date) {
            params.append('fromDate', date);
            params.append('toDate', date);
        }

        const response = await fetch(
            `${API_BASE_URL}/work-schedules?${params}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    getScheduleById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/work-schedules/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    createSchedule: async (data) => {
        const response = await fetch(`${API_BASE_URL}/work-schedules`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateSchedule: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/work-schedules/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteSchedule: async (id) => {
        const response = await fetch(`${API_BASE_URL}/work-schedules/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // Get doctor schedule by date
    getDoctorScheduleByDate: async (doctorId, date) => {
        const response = await fetch(
            `${API_BASE_URL}/work-schedules/doctor/${doctorId}/by-date?date=${date}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // Get doctor schedule by range
    getDoctorScheduleByRange: async (doctorId, fromDate, toDate) => {
        const response = await fetch(
            `${API_BASE_URL}/work-schedules/doctor/${doctorId}/by-range?fromDate=${fromDate}&toDate=${toDate}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // =================== MEDICINES ===================
    getMedicines: async (page = 1, limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/medicines?page=${page}&limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    createMedicine: async (data) => {
        const response = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateMedicine: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteMedicine: async (id) => {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // =================== ROOMS ===================
    getRooms: async (page = 1, limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/rooms?page=${page}&limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    createRoom: async (data) => {
        const response = await fetch(`${API_BASE_URL}/rooms`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateRoom: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteRoom: async (id) => {
        const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // =================== USERS ===================
    getUsers: async (page = 1, limit = 10, role = null) => {
        const params = new URLSearchParams({ page, limit });
        if (role) params.append('role', role);
        const response = await fetch(
            `${API_BASE_URL}/users?${params}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    createUser: async (data) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    updateUser: async (id, data) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // =================== ROLES & POSITIONS ===================
    getRoles: async () => {
        const response = await fetch(`${API_BASE_URL}/roles`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getPositions: async () => {
        const response = await fetch(`${API_BASE_URL}/positions`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};