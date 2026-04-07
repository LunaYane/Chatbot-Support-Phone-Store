const path = require('path');

module.exports = {
  PORT: Number(process.env.PORT || 3001),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/phone-store-demo',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@phonestore.demo',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Store Admin',
  UPLOAD_DIR: path.join(__dirname, '..', 'public', 'uploads')
};
