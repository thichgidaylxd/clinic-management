
const MedicalRecordService = require('../services/medicalRecord.service');
const ResponseUtil = require('../utils/response.util');

class MedicalRecordController {
    /**
     * @desc    Tạo hồ sơ bệnh án
     * @route   POST /api/v1/medical-records
     * @access  Doctor only
     */
    static async create(req, res, next) {
        try {
            const record = await MedicalRecordService.create(req.body);

            return ResponseUtil.success(
                res,
                record,
                'Tạo hồ sơ bệnh án thành công',
                201
            );
        } catch (error) {
            next(error);
        }
    }

    /**
         * @desc    Lấy danh sách hồ sơ của bác sĩ hiện tại
         * @route   GET /api/v1/medical-records
         * @access  Doctor only
         */
    static async getAllForDoctor(req, res, next) {
        try {

            const userId = req.user.ma_nguoi_dung; // Lấy từ middleware authDoctor
            const { page = 1, limit = 10, search = '', specialty = 'all' } = req.query;

            const result = await MedicalRecordService.getAllForDoctor(userId, {
                page,
                limit,
                search,
                specialty
            });

            return ResponseUtil.success(res, result, 'Lấy danh sách hồ sơ thành công');
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Lấy hồ sơ bệnh án theo ID
     * @route   GET /api/v1/medical-records/:id
     * @access  Doctor, Patient
     */
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const record = await MedicalRecordService.getById(id);

            return ResponseUtil.success(
                res,
                record,
                'Lấy hồ sơ bệnh án thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Lấy hồ sơ bệnh án theo bệnh nhân
     * @route   GET /api/v1/medical-records/patient/:patientId
     * @access  Doctor, Patient
     */
    static async getByPatient(req, res, next) {
        try {
            const { patientId } = req.params;
            const { page, limit } = req.query;

            const result = await MedicalRecordService.getByPatient(
                patientId,
                page,
                limit
            );

            return ResponseUtil.success(
                res,
                result,
                'Lấy danh sách hồ sơ bệnh án thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Cập nhật hồ sơ bệnh án
     * @route   PUT /api/v1/medical-records/:id
     * @access  Doctor only
     */
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const record = await MedicalRecordService.update(id, req.body);

            return ResponseUtil.success(
                res,
                record,
                'Cập nhật hồ sơ bệnh án thành công'
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * @desc    Xóa hồ sơ bệnh án
     * @route   DELETE /api/v1/medical-records/:id
     * @access  Admin only
     */
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await MedicalRecordService.delete(id);

            return ResponseUtil.success(
                res,
                null,
                'Xóa hồ sơ bệnh án thành công'
            );
        } catch (error) {
            next(error);
        }
    }
}

module.exports = MedicalRecordController;