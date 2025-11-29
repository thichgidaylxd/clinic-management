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

    // Trạng thái lịch hẹn
    APPOINTMENT_STATUS: {
        PENDING: 0,
        CONFIRMED: 1,
        COMPLETED: 2,
        CANCELLED: 3
    }
};

module.exports = CONSTANTS;