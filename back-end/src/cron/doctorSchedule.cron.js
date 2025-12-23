const cron = require('node-cron');
const DoctorScheduleCronService = require('../services/doctorScheduleCron.service');

function startDoctorScheduleCron() {

    // // ⏰ 00:05 mỗi ngày
    // cron.schedule('5 0 * * *', async () => {
    //     console.log('[CRON] Generating doctor schedules...');

    //     try {
    //         await DoctorScheduleCronService.generateForAllDoctors(14);
    //         console.log('[CRON] Doctor schedules generated successfully');
    //     } catch (err) {
    //         console.error('[CRON] Error generating schedules:', err);
    //     }
    // });

    // ⏰ 18:50 mỗi ngày
    cron.schedule('15 16 * * *', async () => {
        console.log('[CRON] Generating doctor schedules...');

        try {
            await DoctorScheduleCronService.generateForAllDoctors(14);
            console.log('[CRON] Doctor schedules generated successfully');
        } catch (err) {
            console.error('[CRON] Error generating schedules:', err);
        }
    });


}

module.exports = startDoctorScheduleCron;
