const mongoose = require('mongoose');

/**
 * Kết nối MongoDB bằng Mongoose.
 */
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
