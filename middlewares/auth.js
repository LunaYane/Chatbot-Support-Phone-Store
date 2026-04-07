const User = require('../models/User');
const { verifyToken } = require('../utils/token');

const AUTH_SECRET = process.env.AUTH_SECRET || 'phone-store-auth-secret-change-me';

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.header('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập để tiếp tục.' });
    }

    const payload = verifyToken(token, AUTH_SECRET);
    if (!payload?.sub) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }

    const user = await User.findById(payload.sub).lean();
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Phiên đăng nhập không còn hiệu lực.' });
    }

    req.user = {
      id: String(user._id),
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Không thể xác thực người dùng.' });
  }
}

function requireRole(role = 'admin') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn cần đăng nhập để tiếp tục.' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này.' });
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole
};
