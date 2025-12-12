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
        PENDING: 0,        // Chờ xác nhận (Guest booking)
        CONFIRMED: 1,      // Đã xác nhận (Receptionist confirmed)
        CHECKED_IN: 2,     // Đã check-in (Patient arrived)
        IN_PROGRESS: 3,    // Đang khám (Doctor examining)
        COMPLETED: 4,      // Hoàn thành
        CANCELLED: 5,      // Đã hủy
        NO_SHOW: 6        // Không đến
    },
    JWT: {
        ACCESS_TOKEN_EXPIRES: '1h',
        REFRESH_TOKEN_EXPIRES: '7d'
    }
};

module.exports = CONSTANTS;