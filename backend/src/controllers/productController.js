const Product = require('../models/Product');

/**
 * GET /api/products
 * Lấy danh sách sản phẩm.
 */
async function getProducts(request, response) {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    response.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách sản phẩm',
      error: error.message
    });
  }
}

/**
 * POST /api/products
 * Tạo sản phẩm mới (controller cơ bản).
 */
async function createProduct(request, response) {
  try {
    const newProduct = await Product.create(request.body);

    response.status(201).json({
      success: true,
      data: newProduct
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: 'Không thể tạo sản phẩm',
      error: error.message
    });
  }
}

module.exports = {
  getProducts,
  createProduct
};
