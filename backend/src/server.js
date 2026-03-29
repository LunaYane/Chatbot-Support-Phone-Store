require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Hàm khởi động server.
 */
async function startServer() {
  await connectDatabase();

  app.listen(PORT, function () {
    console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
  });
}

startServer();
