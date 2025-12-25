const router = require('express').Router();
const CONSTANTS = require('../config/constants');
const RevenueController = require('../controllers/revenue.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/dashboard', auth.authenticate, auth.authorize(CONSTANTS.ROLES.ADMIN), RevenueController.dashboard);

module.exports = router;
