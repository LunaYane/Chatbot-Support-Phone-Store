const crypto = require('crypto');
const User = require('../models/User');
const HttpError = require('../utils/httpError');
const { signToken, verifyToken } = require('../utils/token');

const AUTH_SECRET = process.env.AUTH_SECRET || 'phone-store-auth-secret-change-me';

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function sanitizeUser(userDoc) {
  return {
    id: userDoc._id,
    fullName: userDoc.fullName,
    email: userDoc.email,
    phone: userDoc.phone,
    role: userDoc.role,
    isActive: userDoc.isActive,
    createdAt: userDoc.createdAt
  };
}

function validateRegisterPayload(payload) {
  const fullName = String(payload.fullName || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = String(payload.phone || '').trim();
  const password = String(payload.password || '');

  if (fullName.length < 2) throw new HttpError(400, 'Họ tên phải có ít nhất 2 ký tự.');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new HttpError(400, 'Email không hợp lệ.');
  if (password.length < 6) throw new HttpError(400, 'Mật khẩu phải có ít nhất 6 ký tự.');
  if (phone && !/^0\d{9,10}$/.test(phone)) throw new HttpError(400, 'Số điện thoại không hợp lệ.');

  return { fullName, email, phone, password };
}

async function register(payload) {
  const { fullName, email, phone, password } = validateRegisterPayload(payload);

  const exists = await User.findOne({ email }).lean();
  if (exists) throw new HttpError(409, 'Email đã được sử dụng.');

  const { hash, salt } = hashPassword(password);

  const created = await User.create({
    fullName,
    email,
    phone,
    passwordHash: hash,
    passwordSalt: salt,
    role: 'user'
  });

  const token = signToken({ sub: String(created._id), role: created.role }, AUTH_SECRET);

  return {
    token,
    user: sanitizeUser(created)
  };
}

async function login(payload) {
  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');

  if (!email || !password) throw new HttpError(400, 'Email và mật khẩu là bắt buộc.');

  const user = await User.findOne({ email });
  if (!user || !user.isActive) throw new HttpError(401, 'Email hoặc mật khẩu không đúng.');

  const { hash } = hashPassword(password, user.passwordSalt);
  if (hash !== user.passwordHash) throw new HttpError(401, 'Email hoặc mật khẩu không đúng.');

  const token = signToken({ sub: String(user._id), role: user.role }, AUTH_SECRET);

  return {
    token,
    user: sanitizeUser(user)
  };
}

async function getProfileFromToken(token) {
  const payload = verifyToken(token, AUTH_SECRET);
  if (!payload?.sub) throw new HttpError(401, 'Token không hợp lệ hoặc đã hết hạn.');

  const user = await User.findById(payload.sub);
  if (!user || !user.isActive) throw new HttpError(401, 'Phiên đăng nhập không hợp lệ.');

  return sanitizeUser(user);
}

module.exports = {
  register,
  login,
  getProfileFromToken
};
