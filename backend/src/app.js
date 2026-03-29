const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productRoutes = require('./routes/productRoutes');
const chatRoutes = require('./routes/chatRoutes');
const faqRoutes = require('./routes/faqRoutes');

const app = express();

/**
 * Cấu hình middleware cơ bản.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*'
  })
);
app.use(express.json());
app.use(morgan('dev'));

// Route kiểm tra server
app.get('/', function (request, response) {
  response.json({ message: 'Chatbot Support Phone Store API đang chạy' });
});

// Khai báo các route chính
app.use('/api/products', productRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/faqs', faqRoutes);

// Xử lý route không tồn tại
app.use(function (request, response) {
  response.status(404).json({ message: 'Route không tồn tại' });
});

module.exports = app;
