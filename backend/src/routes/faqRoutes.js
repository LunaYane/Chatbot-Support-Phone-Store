const express = require('express');
const { getFaqs, createFaq } = require('../controllers/faqController');

const router = express.Router();

// Lấy danh sách FAQ
router.get('/', getFaqs);

// Tạo FAQ mới
router.post('/', createFaq);

module.exports = router;
