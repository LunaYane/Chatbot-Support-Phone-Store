const express = require('express');
const { registerUser, loginUser, getMyProfile } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', requireAuth, getMyProfile);

module.exports = router;
