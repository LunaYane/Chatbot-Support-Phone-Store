const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Phone = require('./models/Phone');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phone-store-demo';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

app.get('/api/phones', async (req, res) => {
  try {
    const { search = '', brand = '', minPrice = '', maxPrice = '' } = req.query;

    const query = {};

    if (search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (brand.trim()) {
      query.brand = brand.trim();
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const phones = await Phone.find(query).sort({ price: 1 });
    return res.json(phones);
  } catch (error) {
    return res.status(500).json({ message: 'Cannot load phones right now.' });
  }
});

app.get('/api/brands', async (req, res) => {
  try {
    const brands = await Phone.distinct('brand');
    brands.sort();
    return res.json(brands);
  } catch (error) {
    return res.status(500).json({ message: 'Cannot load brands right now.' });
  }
});

app.get('/api/phones/:id', async (req, res) => {
  try {
    const phoneId = Number(req.params.id);
    const phone = await Phone.findOne({ id: phoneId });

    if (!phone) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(phone);
  } catch (error) {
    return res.status(500).json({ message: 'Cannot load product detail right now.' });
  }
});

app.post('/api/chat', (req, res) => {
  const userMessage = (req.body.message || '').toString().trim().toLowerCase();

  let reply = 'Thanks for your message! Our support team will contact you soon.';

  if (!userMessage) {
    reply = 'Please type your question so I can help you.';
  } else if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('xin chao')) {
    reply = 'Hello! Welcome to Phone Store. How can I help you today?';
  } else if (userMessage.includes('price') || userMessage.includes('gia')) {
    reply = 'You can use the price filter on homepage to find phones in your budget.';
  } else if (userMessage.includes('apple') || userMessage.includes('iphone')) {
    reply = 'For Apple products, choose brand = Apple in the filter section.';
  } else if (userMessage.includes('samsung')) {
    reply = 'For Samsung phones, choose brand = Samsung in the filter section.';
  } else if (userMessage.includes('thank')) {
    reply = 'You are welcome! If you need more help, just send another message.';
  }

  return res.json({ reply });
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Phone Store Demo is running at http://localhost:${PORT}`);
});
