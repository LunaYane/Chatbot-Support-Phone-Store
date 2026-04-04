const path = require('path');

module.exports = {
  PORT: Number(process.env.PORT || 3001),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/phone-store-demo',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  UPLOAD_DIR: path.join(__dirname, '..', 'public', 'uploads')
};
