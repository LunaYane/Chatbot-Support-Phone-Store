const express = require('express');
const { getPhones, getBrands, getPhoneDetail } = require('../controllers/phoneController');

const router = express.Router();

router.get('/phones', getPhones);
router.get('/brands', getBrands);
router.get('/phones/:id', getPhoneDetail);

module.exports = router;
