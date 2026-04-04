const express = require('express');
const uploadImage = require('../middlewares/upload');
const { uploadImage: uploadImageController } = require('../controllers/uploadController');
const { requireAdmin } = require('../services/adminAuthService');

const router = express.Router();

router.post('/image', requireAdmin, uploadImage.single('image'), uploadImageController);

module.exports = router;
