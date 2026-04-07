const express = require('express');
const uploadImage = require('../middlewares/upload');
const { uploadImage: uploadImageController } = require('../controllers/uploadController');
const { requireAuth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.post('/image', requireAuth, requireRole('admin'), uploadImage.single('image'), uploadImageController);

module.exports = router;
