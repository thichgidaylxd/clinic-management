const RevenueService = require('../services/revenue.service');
const ResponseUtil = require('../utils/response.util');

class RevenueController {

    static async dashboard(req, res, next) {
        try {
            const data = await RevenueService.getDashboardRevenue(req.query);
            return ResponseUtil.success(res, data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = RevenueController;
