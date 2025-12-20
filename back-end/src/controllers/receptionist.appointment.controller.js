const ReceptionistAppointmentService = require('../services/receptionist.appointment.service');
const ResponseUtil = require('../utils/response.util');

class ReceptionistAppointmentController {
    static async create(req, res, next) {
        try {
            const receptionistId = req.user.ma_nguoi_dung;
            const appointment = await ReceptionistAppointmentService.create(
                req.body,
                receptionistId
            );

            return ResponseUtil.success(
                res,
                appointment,
                'Đặt lịch tại quầy thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ReceptionistAppointmentController;
