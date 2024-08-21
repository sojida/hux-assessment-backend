const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

const router = express.Router()

router.post('/signup', authMiddleware.ValidateCreateUser, authController.Signup)
router.post('/login',authMiddleware.ValidateLoginUser, authController.Login)

module.exports = router;
