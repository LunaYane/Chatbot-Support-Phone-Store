const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Phone = require('./models/Phone');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phone-store-demo';

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

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Phone Store Demo is running at http://localhost:${PORT}`);
});
