const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function để handle response
const handleResponse = async (response) => {
    const data = await response.json();

    console.log('API Response:', response.status, data);

    if (!response.ok) {
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
    // ========== SPECIALTIES ==========
    getSpecialties: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/specialties?${queryString}`);
        return handleResponse(response);
    },

    // ========== SERVICES ==========
    getServices: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/services?${queryString}`);
        return handleResponse(response);
    },

    // Lấy dịch vụ theo chuyên khoa
    getServicesBySpecialty: async (specialtyId) => {
        const response = await fetch(`${API_BASE_URL}/services/specialty/${specialtyId}`);
        return handleResponse(response);
    },

    // ========== DOCTORS ==========
    getDoctors: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/doctors?${queryString}`);
        return handleResponse(response);
    },

    getDoctorById: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}`);
        return handleResponse(response);
    },

    // Lấy bác sĩ khả dụng
    getAvailableDoctors: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/doctors/available?${queryString}`);
        return handleResponse(response);
    },

    // ========== APPOINTMENTS ==========

    // Lấy available slots theo bác sĩ
    getAvailableSlots: async (doctorId, date, slotDuration = 30) => {
        const params = new URLSearchParams({ doctorId, date, slotDuration });
        const response = await fetch(`${API_BASE_URL}/appointments/available-slots?${params}`);
        return handleResponse(response);
    },
    getAvailableSlotsV2: async ({ date, specialtyId }) => {
        const params = new URLSearchParams({ date });

        if (specialtyId) {
            params.append('specialtyId', specialtyId);
        }

        const response = await fetch(
            `${API_BASE_URL}/appointments/available-slots/v2?${params}`
        );

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
        console.log('createGuestAppointment - Request data:', data);

        const response = await fetch(`${API_BASE_URL}/appointments/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Đặt lịch (đã đăng nhập)
    createAuthAppointment: async (data, token) => {
        console.log('createAuthAppointment - Request data:', data);

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
    },

    // ========== REVIEWS ========== ✅ NEW
    // Tạo đánh giá bác sĩ
    createReview: async (data, token) => {
        console.log('createReview - Request data:', data);

        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    // Lấy đánh giá của bác sĩ
    getDoctorReviews: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/reviews/doctor/${doctorId}`);
        return handleResponse(response);
    },

    // Lấy thống kê đánh giá bác sĩ
    getDoctorReviewStats: async (doctorId) => {
        const response = await fetch(`${API_BASE_URL}/reviews/doctor/${doctorId}/stats`);
        return handleResponse(response);
    },



};