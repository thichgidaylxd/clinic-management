const CONSTANTS = {
    // Trạng thái
    STATUS: {
        ACTIVE: 1,
        INACTIVE: 0
    },

    // Giới tính
    GENDER: {
        MALE: 1,
        FEMALE: 0,
        OTHER: 2
    },

    // Vai trò
    ROLES: {
        ADMIN: 'Admin',
        DOCTOR: 'Bác sĩ',
        RECEPTIONIST: 'Lễ tân',
        PATIENT: 'Bệnh nhân'
    },

    // Phương thức thanh toán
    PAYMENT_METHOD: {
        CASH: 1,
        BANK_TRANSFER: 2,
        CREDIT_CARD: 3
    },

    APPOINTMENT_STATUS: {
        PENDING: 0,      // Chờ xác nhận
        CONFIRMED: 1,    // Đã xác nhận
        CHECKED_IN: 2,   // Đã check-in
        COMPLETED: 3,    // Hoàn thành
        CANCELLED: 4     // Đã hủy
    },
    JWT: {
        ACCESS_TOKEN_EXPIRES: '1h',
        REFRESH_TOKEN_EXPIRES: '7d'
    }
};

module.exports = CONSTANTS;