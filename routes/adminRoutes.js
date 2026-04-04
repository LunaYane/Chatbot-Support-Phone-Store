const express = require('express');
const {
  adminLogin,
  adminSession,
  adminLogout,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/adminController');
const { requireAdmin } = require('../services/adminAuthService');

const router = express.Router();

router.post('/login', adminLogin);
router.get('/session', adminSession);
router.post('/logout', requireAdmin, adminLogout);
router.get('/products', getAdminProducts);
router.post('/products', requireAdmin, createProduct);
router.put('/products/:id', requireAdmin, updateProduct);
router.delete('/products/:id', requireAdmin, deleteProduct);

module.exports = router;
