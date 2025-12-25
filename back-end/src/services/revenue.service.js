const RevenueModel = require('../models/revenue.model');

class RevenueService {

    static async getDashboardRevenue(query) {
        const { fromDate, toDate } = query;

        if (!fromDate || !toDate) {
            throw new Error('Thiếu fromDate hoặc toDate');
        }

        const summary = await RevenueModel.getRevenueSummary(fromDate, toDate);
        const chart = await RevenueModel.getRevenueByDate(fromDate, toDate);

        return {
            summary: {
                serviceRevenue: Number(summary.serviceRevenue || 0),
                extraRevenue: Number(summary.extraRevenue || 0),
                totalRevenue: Number(summary.totalRevenue || 0)
            },
            chart
        };
    }
}

module.exports = RevenueService;
