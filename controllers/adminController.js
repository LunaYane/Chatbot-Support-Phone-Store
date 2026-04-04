const asyncHandler = require('../middlewares/asyncHandler');
const {
  listAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct
} = require('../services/phoneService');
const { loginAdmin, logoutAdmin, checkAdminSession } = require('../services/adminAuthService');
const { ADMIN_USERNAME, ADMIN_PASSWORD } = require('../config/env');

const adminLogin = (req, res, next) => {
  try {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '').trim();

    const data = loginAdmin(username, password, ADMIN_USERNAME, ADMIN_PASSWORD);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

const adminSession = (req, res) => {
  const token = req.header('x-admin-token') || '';
  return res.json(checkAdminSession(token, ADMIN_USERNAME));
};

const adminLogout = (req, res) => {
  const token = req.header('x-admin-token') || '';
  logoutAdmin(token);
  return res.json({ message: 'Logged out successfully.' });
};

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
  adminLogin,
  adminSession,
  adminLogout,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
