const crypto = require('crypto');
const HttpError = require('../utils/httpError');

const adminTokens = new Set();

function safeCompare(valueA, valueB) {
  const bufferA = Buffer.from(String(valueA));
  const bufferB = Buffer.from(String(valueB));
  if (bufferA.length !== bufferB.length) return false;
  return crypto.timingSafeEqual(bufferA, bufferB);
}

function validateCredentials(username, password, expectedUsername, expectedPassword) {
  return safeCompare(username, expectedUsername) && safeCompare(password, expectedPassword);
}

function loginAdmin(username, password, expectedUsername, expectedPassword) {
  if (!validateCredentials(username, password, expectedUsername, expectedPassword)) {
    throw new HttpError(401, 'Invalid admin username or password.');
  }

  const token = crypto.randomBytes(24).toString('hex');
  adminTokens.add(token);
  return { token, username: expectedUsername };
}

function logoutAdmin(token) {
  adminTokens.delete(token);
}

function checkAdminSession(token, username) {
  const isAdmin = Boolean(token && adminTokens.has(token));
  return { isAdmin, username: isAdmin ? username : null };
}

function requireAdmin(req, res, next) {
  const token = req.header('x-admin-token') || '';
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ message: 'Admin login required.' });
  }
  return next();
}

module.exports = {
  loginAdmin,
  logoutAdmin,
  checkAdminSession,
  requireAdmin
};
