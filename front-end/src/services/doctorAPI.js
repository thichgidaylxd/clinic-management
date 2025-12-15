// services/doctorAPI.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

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

export const doctorAPI = {
    // =================== DASHBOARD ===================

    getDashboard: async () => {
        const response = await fetch(
            `${API_BASE_URL}/appointments/dashboard/doctor`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // =================== APPOINTMENTS ===================

    getTodayAppointments: async () => {
        const response = await fetch(
            `${API_BASE_URL}/appointments/today`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    getAppointmentsByDate: async (date) => {
        const response = await fetch(
            `${API_BASE_URL}/appointments/doctor/by-date?date=${date}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    getCheckedInAppointments: async (page = 1, limit = 10) => {
        const response = await fetch(
            `${API_BASE_URL}/appointments/checked-in?page=${page}&limit=${limit}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    getAppointmentDetail: async (id) => {
        const response = await fetch(
            `${API_BASE_URL}/appointments/${id}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    completeAppointment: async (id) => {
        const response = await fetch(
            `${API_BASE_URL}/appointments/${id}/complete`,
            {
                method: 'PUT',
                headers: getAuthHeaders()
            }
        );
        return handleResponse(response);
    },

    // =================== WORK SCHEDULE ===================

    getMyScheduleByDate: async (date) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const doctorId = user?.ma_bac_si;

        if (!doctorId) throw new Error('Không tìm thấy thông tin bác sĩ');

        const response = await fetch(
            `${API_BASE_URL}/work-schedules/doctor/${doctorId}/by-date?date=${date}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    getMyScheduleByRange: async (fromDate, toDate) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const doctorId = user?.ma_bac_si;

        if (!doctorId) throw new Error('Không tìm thấy thông tin bác sĩ');

        const response = await fetch(
            `${API_BASE_URL}/work-schedules/doctor/${doctorId}/by-range?fromDate=${fromDate}&toDate=${toDate}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // =================== PRESCRIPTIONS ===================

    createPrescription: async (data) => {
        const response = await fetch(
            `${API_BASE_URL}/prescriptions`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            }
        );
        return handleResponse(response);
    },

    getPrescriptionByAppointment: async (appointmentId) => {
        const response = await fetch(
            `${API_BASE_URL}/prescriptions/appointment/${appointmentId}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // =================== MEDICINES ===================

    getMedicines: async (page = 1, limit = 100, search = '') => {
        const params = new URLSearchParams({ page, limit });
        if (search) params.append('search', search);

        const response = await fetch(
            `${API_BASE_URL}/medicines?${params}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    // =================== PATIENTS ===================

    getPatientById: async (patientId) => {
        const response = await fetch(
            `${API_BASE_URL}/patients/${patientId}`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    }
};