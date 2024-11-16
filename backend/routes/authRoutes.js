const express = require('express');
const { login, getUserProfile, recuperarPassword, resetPassword } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticateUser, getUserProfile);
router.post('/recuperar-password', recuperarPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
