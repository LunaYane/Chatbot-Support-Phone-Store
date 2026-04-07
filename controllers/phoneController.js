const asyncHandler = require('../middlewares/asyncHandler');
const { listPhones, listBrands, getPhoneById } = require('../services/phoneService');

const getPhones = asyncHandler(async (req, res) => {
  const data = await listPhones(req.query);
  return res.json(data);
});

const getBrands = asyncHandler(async (req, res) => {
  const brands = await listBrands();
  return res.json(brands);
});

const getPhoneDetail = asyncHandler(async (req, res) => {
  const phone = await getPhoneById(req.params.id);
  return res.json(phone);
});

module.exports = {
  getPhones,
  getBrands,
  getPhoneDetail
};
