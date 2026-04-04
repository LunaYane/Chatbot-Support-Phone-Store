const asyncHandler = require('../middlewares/asyncHandler');
const {
  listAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} = require('../services/phoneService');

const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await listAdminProducts();
  return res.json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const created = await createAdminProduct(req.body || {});
  return res.status(201).json(created);
});

const updateProduct = asyncHandler(async (req, res) => {
  const updated = await updateAdminProduct(req.params.id, req.body || {});
  return res.json(updated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  await deleteAdminProduct(req.params.id);
  return res.json({ message: 'Product deleted successfully.' });
});

module.exports = {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
