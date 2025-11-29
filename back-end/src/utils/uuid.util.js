const { v4: uuidv4 } = require('uuid');

class UUIDUtil {
    // Tạo UUID mới
    static generate() {
        return uuidv4();
    }

    // Chuyển UUID string sang BINARY(16)
    static toBinary(uuid) {
        if (!uuid) return null;
        return Buffer.from(uuid.replace(/-/g, ''), 'hex');
    }

    // Chuyển BINARY(16) sang UUID string
    static toString(binary) {
        if (!binary) return null;
        const hex = binary.toString('hex');
        return `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${hex.substr(12, 4)}-${hex.substr(16, 4)}-${hex.substr(20)}`;
    }

    // Validate UUID
    static isValid(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}

module.exports = UUIDUtil;