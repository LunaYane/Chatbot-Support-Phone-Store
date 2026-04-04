const express = require('express');
const path = require('path');
const fs = require('fs');

const { connectDB } = require('./config/db');
const { PORT, MONGO_URI, UPLOAD_DIR } = require('./config/env');
const phoneRoutes = require('./routes/phoneRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', phoneRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', chatRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkout.html'));
});

app.use(notFoundHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(errorHandler);

connectDB(MONGO_URI)
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Phone Store Demo is running at http://localhost:${PORT}`);
    });
  });
