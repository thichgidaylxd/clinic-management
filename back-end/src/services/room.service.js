const RoomModel = require('../models/room.model');
const RoomTypeModel = require('../models/roomType.model');
const SpecialtyModel = require('../models/specialty.model');

class RoomService {
    // ===== LOẠI PHÒNG KHÁM =====

    // Tạo loại phòng khám
    static async createRoomType(roomTypeData) {
        const { ten_loai_phong_kham } = roomTypeData;

        const exists = await RoomTypeModel.existsByName(ten_loai_phong_kham);
        if (exists) {
            throw new Error('Tên loại phòng khám đã tồn tại');
        }

        const roomTypeId = await RoomTypeModel.create(roomTypeData);
        return await RoomTypeModel.findById(roomTypeId);
    }

    // Lấy tất cả loại phòng khám
    static async getAllRoomTypes() {
        return await RoomTypeModel.findAll();
    }

    // Lấy loại phòng khám theo ID
    static async getRoomTypeById(roomTypeId) {
        const roomType = await RoomTypeModel.findById(roomTypeId);
        if (!roomType) {
            throw new Error('Không tìm thấy loại phòng khám');
        }
        return roomType;
    }

    // Cập nhật loại phòng khám
    static async updateRoomType(roomTypeId, updateData) {
        const roomType = await RoomTypeModel.findById(roomTypeId);
        if (!roomType) {
            throw new Error('Không tìm thấy loại phòng khám');
        }

        if (updateData.ten_loai_phong_kham) {
            const exists = await RoomTypeModel.existsByName(
                updateData.ten_loai_phong_kham,
                roomTypeId
            );
            if (exists) {
                throw new Error('Tên loại phòng khám đã tồn tại');
            }
        }

        const updated = await RoomTypeModel.update(roomTypeId, updateData);
        if (!updated) {
            throw new Error('Cập nhật loại phòng khám thất bại');
        }

        return await RoomTypeModel.findById(roomTypeId);
    }

    // Xóa loại phòng khám
    static async deleteRoomType(roomTypeId) {
        const roomType = await RoomTypeModel.findById(roomTypeId);
        if (!roomType) {
            throw new Error('Không tìm thấy loại phòng khám');
        }

        const inUse = await RoomTypeModel.isInUse(roomTypeId);
        if (inUse) {
            throw new Error('Không thể xóa loại phòng khám đang được sử dụng');
        }

        const deleted = await RoomTypeModel.delete(roomTypeId);
        if (!deleted) {
            throw new Error('Xóa loại phòng khám thất bại');
        }

        return true;
    }

    // ===== PHÒNG KHÁM =====

    // Tạo phòng khám
    static async createRoom(roomData) {
        const { ten_phong_kham, so_phong_kham, ma_chuyen_khoa_phong_kham, ma_loai_phong_kham } = roomData;

        // Kiểm tra tên đã tồn tại
        const nameExists = await RoomModel.existsByName(ten_phong_kham);
        if (nameExists) {
            throw new Error('Tên phòng khám đã tồn tại');
        }

        // Kiểm tra số phòng đã tồn tại (nếu có)
        if (so_phong_kham) {
            const numberExists = await RoomModel.existsByRoomNumber(so_phong_kham);
            if (numberExists) {
                throw new Error('Số phòng đã tồn tại');
            }
        }

        // Kiểm tra chuyên khoa có tồn tại (nếu có)
        if (ma_chuyen_khoa_phong_kham) {
            const specialty = await SpecialtyModel.findById(ma_chuyen_khoa_phong_kham);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        // Kiểm tra loại phòng có tồn tại (nếu có)
        if (ma_loai_phong_kham) {
            const roomType = await RoomTypeModel.findById(ma_loai_phong_kham);
            if (!roomType) {
                throw new Error('Loại phòng khám không tồn tại');
            }
        }

        const roomId = await RoomModel.create(roomData);
        return await RoomModel.findById(roomId);
    }

    // Lấy danh sách phòng khám
    static async getAllRooms(page, limit, search, specialtyId, roomTypeId, status) {
        // Kiểm tra chuyên khoa nếu có
        if (specialtyId) {
            const specialty = await SpecialtyModel.findById(specialtyId);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        // Kiểm tra loại phòng nếu có
        if (roomTypeId) {
            const roomType = await RoomTypeModel.findById(roomTypeId);
            if (!roomType) {
                throw new Error('Loại phòng khám không tồn tại');
            }
        }

        return await RoomModel.findAll(page, limit, search, specialtyId, roomTypeId, status);
    }

    // Lấy thông tin phòng khám theo ID
    static async getRoomById(roomId) {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            throw new Error('Không tìm thấy phòng khám');
        }
        return room;
    }

    // Cập nhật phòng khám
    static async updateRoom(roomId, updateData) {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            throw new Error('Không tìm thấy phòng khám');
        }

        // Kiểm tra tên mới có trùng không
        if (updateData.ten_phong_kham) {
            const exists = await RoomModel.existsByName(
                updateData.ten_phong_kham,
                roomId
            );
            if (exists) {
                throw new Error('Tên phòng khám đã tồn tại');
            }
        }

        // Kiểm tra số phòng mới có trùng không
        if (updateData.so_phong_kham) {
            const exists = await RoomModel.existsByRoomNumber(
                updateData.so_phong_kham,
                roomId
            );
            if (exists) {
                throw new Error('Số phòng đã tồn tại');
            }
        }

        // Kiểm tra chuyên khoa có tồn tại (nếu có)
        if (updateData.ma_chuyen_khoa_phong_kham) {
            const specialty = await SpecialtyModel.findById(updateData.ma_chuyen_khoa_phong_kham);
            if (!specialty) {
                throw new Error('Chuyên khoa không tồn tại');
            }
        }

        // Kiểm tra loại phòng có tồn tại (nếu có)
        if (updateData.ma_loai_phong_kham) {
            const roomType = await RoomTypeModel.findById(updateData.ma_loai_phong_kham);
            if (!roomType) {
                throw new Error('Loại phòng khám không tồn tại');
            }
        }

        const updated = await RoomModel.update(roomId, updateData);
        if (!updated) {
            throw new Error('Cập nhật phòng khám thất bại');
        }

        return await RoomModel.findById(roomId);
    }

    // Xóa phòng khám
    static async deleteRoom(roomId) {
        const room = await RoomModel.findById(roomId);
        if (!room) {
            throw new Error('Không tìm thấy phòng khám');
        }

        const inUse = await RoomModel.isInUse(roomId);
        if (inUse) {
            throw new Error('Không thể xóa phòng khám đang được sử dụng trong lịch làm việc');
        }

        const deleted = await RoomModel.delete(roomId);
        if (!deleted) {
            throw new Error('Xóa phòng khám thất bại');
        }

        return true;
    }

    // Lấy phòng khám có sẵn
    static async getAvailableRooms(specialtyId, roomTypeId) {
        return await RoomModel.getAvailableRooms(specialtyId, roomTypeId);
    }

    // Thống kê phòng khám theo chuyên khoa
    static async getStatsBySpecialty() {
        return await RoomModel.getStatsBySpecialty();
    }

    // Thống kê phòng khám theo loại
    static async getStatsByRoomType() {
        return await RoomModel.getStatsByRoomType();
    }
}

module.exports = RoomService;