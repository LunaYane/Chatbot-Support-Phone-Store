const express = require('express');
const { getProducts, createProduct } = require('../controllers/productController');

const router = express.Router();

// Lấy danh sách sản phẩm
router.get('/', getProducts);

// Tạo sản phẩm mới
router.post('/', createProduct);

module.exports = router;
