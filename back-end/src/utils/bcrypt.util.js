const bcrypt = require('bcryptjs');

class BcryptUtil {
    // Hash mật khẩu
    static async hash(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // So sánh mật khẩu
    static async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = BcryptUtil;