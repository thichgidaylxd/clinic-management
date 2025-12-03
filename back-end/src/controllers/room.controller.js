const RoomService = require('../services/room.service');
const ResponseUtil = require('../utils/response.util');

class RoomController {
    // ===== LOẠI PHÒNG KHÁM =====

    // Tạo loại phòng khám
    static async createRoomType(req, res, next) {
        try {
            const roomType = await RoomService.createRoomType(req.body);

            return ResponseUtil.success(
                res,
                roomType,
                'Tạo loại phòng khám thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy tất cả loại phòng khám
    static async getAllRoomTypes(req, res, next) {
        try {
            const roomTypes = await RoomService.getAllRoomTypes();

            return ResponseUtil.success(
                res,
                roomTypes,
                'Lấy danh sách loại phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy loại phòng khám theo ID
    static async getRoomTypeById(req, res, next) {
        try {
            const { id } = req.params;
            const roomType = await RoomService.getRoomTypeById(id);

            return ResponseUtil.success(
                res,
                roomType,
                'Lấy thông tin loại phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật loại phòng khám
    static async updateRoomType(req, res, next) {
        try {
            const { id } = req.params;
            const roomType = await RoomService.updateRoomType(id, req.body);

            return ResponseUtil.success(
                res,
                roomType,
                'Cập nhật loại phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa loại phòng khám
    static async deleteRoomType(req, res, next) {
        try {
            const { id } = req.params;
            await RoomService.deleteRoomType(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa loại phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // ===== PHÒNG KHÁM =====

    // Tạo phòng khám
    static async createRoom(req, res, next) {
        try {
            const room = await RoomService.createRoom(req.body);

            return ResponseUtil.success(
                res,
                room,
                'Tạo phòng khám thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách phòng khám
    static async getAllRooms(req, res, next) {
        try {
            const { page, limit, search, specialtyId, roomTypeId, status } = req.query;
            const result = await RoomService.getAllRooms(
                page,
                limit,
                search,
                specialtyId,
                roomTypeId,
                status
            );

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin phòng khám theo ID
    static async getRoomById(req, res, next) {
        try {
            const { id } = req.params;
            const room = await RoomService.getRoomById(id);

            return ResponseUtil.success(
                res,
                room,
                'Lấy thông tin phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật phòng khám
    static async updateRoom(req, res, next) {
        try {
            const { id } = req.params;
            const room = await RoomService.updateRoom(id, req.body);

            return ResponseUtil.success(
                res,
                room,
                'Cập nhật phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Xóa phòng khám
    static async deleteRoom(req, res, next) {
        try {
            const { id } = req.params;
            await RoomService.deleteRoom(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa phòng khám thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Lấy phòng khám có sẵn
    static async getAvailableRooms(req, res, next) {
        try {
            const { specialtyId, roomTypeId } = req.query;
            const rooms = await RoomService.getAvailableRooms(specialtyId, roomTypeId);

            return ResponseUtil.success(
                res,
                rooms,
                'Lấy danh sách phòng khám có sẵn thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Thống kê phòng khám theo chuyên khoa
    static async getStatsBySpecialty(req, res, next) {
        try {
            const stats = await RoomService.getStatsBySpecialty();

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê phòng khám theo chuyên khoa thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    // Thống kê phòng khám theo loại
    static async getStatsByRoomType(req, res, next) {
        try {
            const stats = await RoomService.getStatsByRoomType();

            return ResponseUtil.success(
                res,
                stats,
                'Lấy thống kê phòng khám theo loại thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = RoomController;