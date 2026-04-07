const asyncHandler = require('../middlewares/asyncHandler');
const { register, login, getProfileFromToken } = require('../services/authService');

const registerUser = asyncHandler(async (req, res) => {
  const result = await register(req.body || {});
  return res.status(201).json(result);
});

const loginUser = asyncHandler(async (req, res) => {
  const result = await login(req.body || {});
  return res.json(result);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const authHeader = req.header('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const user = await getProfileFromToken(token);
  return res.json({ user });
});

module.exports = {
  registerUser,
  loginUser,
  getMyProfile
};
