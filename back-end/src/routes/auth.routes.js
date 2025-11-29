const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const AuthValidator = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const AuthMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.post(
    '/register',
    validate(AuthValidator.register()),
    AuthController.register
);

router.post(
    '/login',
    validate(AuthValidator.login()),
    AuthController.login
);

router.post(
    '/refresh-token',
    validate(AuthValidator.refreshToken()),
    AuthController.refreshToken
);

// Protected routes
router.get(
    '/me',
    AuthMiddleware.authenticate,
    AuthController.getCurrentUser
);

router.post(
    '/logout',
    AuthMiddleware.authenticate,
    AuthController.logout
);

module.exports = router;