const express = require('express');
const path = require('path');
const phones = require('./data/phones');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/phones', (req, res) => {
  res.json(phones);
});

app.get('/api/phones/:id', (req, res) => {
  const phoneId = Number(req.params.id);
  const phone = phones.find((item) => item.id === phoneId);

  if (!phone) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json(phone);
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
