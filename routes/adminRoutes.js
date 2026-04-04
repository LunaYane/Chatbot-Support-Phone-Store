const express = require('express');
const { getAdminProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/products', getAdminProducts);
router.post('/products', requireAuth, requireRole('admin'), createProduct);
router.put('/products/:id', requireAuth, requireRole('admin'), updateProduct);
router.delete('/products/:id', requireAuth, requireRole('admin'), deleteProduct);

module.exports = router;
