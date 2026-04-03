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

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'iPhone 15', brand: 'Apple', price: 21990000 },
  { id: 2, name: 'iPhone 14 Plus', brand: 'Apple', price: 19990000 },
  { id: 3, name: 'Galaxy S24', brand: 'Samsung', price: 21990000 },
  { id: 4, name: 'Galaxy A55 5G', brand: 'Samsung', price: 9990000 },
  { id: 5, name: 'Xiaomi 14', brand: 'Xiaomi', price: 17990000 },
  { id: 6, name: 'Redmi Note 13 Pro+', brand: 'Xiaomi', price: 10990000 },
  { id: 7, name: 'OPPO A79 5G', brand: 'OPPO', price: 7290000 },
  { id: 8, name: 'Nokia G42 5G', brand: 'Nokia', price: 5990000 }
];

const FAQ_RESPONSES = {
  openingHours:
    'Our store is open from 08:30 to 21:30 every day (Monday - Sunday).',
  warranty:
    'Most phones include official 12-month warranty. You can bring invoice + phone to our store/service center for support.',
  promotions:
    'Current promotions: up to 10% discount on selected models and free shipping in city area. Please check homepage for the latest deals.'
};

const BRAND_KEYWORDS = {
  Apple: ['apple', 'iphone', 'ios'],
  Samsung: ['samsung', 'galaxy'],
  Xiaomi: ['xiaomi', 'redmi', 'mi']
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function formatPriceVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function getMatchedBrand(message) {
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    if (keywords.some((keyword) => message.includes(keyword))) {
      return brand;
    }
  }

  return null;
}

function extractBudget(message) {
  const millionPattern = /(\d+[\.,]?\d*)\s*(tr|trieu|m|million)/;
  const thousandPattern = /(\d+[\.,]?\d*)\s*(k|nghin|thousand)/;
  const plainNumberPattern = /\b\d{6,9}\b/;

  const millionMatch = message.match(millionPattern);
  if (millionMatch) {
    return Math.round(parseFloat(millionMatch[1].replace(',', '.')) * 1000000);
  }

  const thousandMatch = message.match(thousandPattern);
  if (thousandMatch) {
    return Math.round(parseFloat(thousandMatch[1].replace(',', '.')) * 1000);
  }

  const plainMatch = message.match(plainNumberPattern);
  if (plainMatch) {
    return Number(plainMatch[0]);
  }

  return null;
}

function detectFaqIntent(message) {
  if (
    message.includes('gio mo cua') ||
    message.includes('mo cua') ||
    message.includes('opening hour') ||
    message.includes('open')
  ) {
    return 'openingHours';
  }

  if (
    message.includes('bao hanh') ||
    message.includes('warranty') ||
    message.includes('doi tra') ||
    message.includes('return')
  ) {
    return 'warranty';
  }

  if (
    message.includes('khuyen mai') ||
    message.includes('uu dai') ||
    message.includes('giam gia') ||
    message.includes('promotion') ||
    message.includes('sale')
  ) {
    return 'promotions';
  }

  return null;
}

function detectIntent(message) {
  if (!message) {
    return { intent: 'empty' };
  }

  const faqIntent = detectFaqIntent(message);
  if (faqIntent) {
    return { intent: 'faq', faqIntent };
  }

  const budgetKeywords = [
    'duoi',
    'under',
    'budget',
    'toi da',
    'khong qua',
    'max',
    'tam',
    'khoang',
    'gia'
  ];
  const budget = extractBudget(message);
  const hasBudgetKeyword = budgetKeywords.some((keyword) => message.includes(keyword));

  if (budget && hasBudgetKeyword) {
    return { intent: 'budget', budget };
  }

  const matchedBrand = getMatchedBrand(message);
  if (matchedBrand) {
    return { intent: 'brand', brand: matchedBrand };
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('xin chao')) {
    return { intent: 'greeting' };
  }

  return { intent: 'fallback' };
}

async function getChatbotProducts() {
  try {
    const products = await Phone.find({}, { _id: 0, id: 1, name: 1, brand: 1, price: 1 })
      .sort({ price: 1 })
      .lean();

    if (products.length > 0) {
      return products;
    }

    return SAMPLE_PRODUCTS;
  } catch (error) {
    return SAMPLE_PRODUCTS;
  }
}

function buildBudgetReply(products, budget) {
  const matched = products
    .filter((product) => product.price <= budget)
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);

  if (matched.length === 0) {
    return `Sorry, I cannot find phones under ${formatPriceVND(
      budget
    )} right now. Please try a higher budget.`;
  }

  const lines = matched.map(
    (product) => `- ${product.name} (${product.brand}) - ${formatPriceVND(product.price)}`
  );

  return `Here are phones under ${formatPriceVND(budget)}:\n${lines.join(
    '\n'
  )}\nYou can also use the price filter on homepage for more options.`;
}

function buildBrandReply(products, brand) {
  const matched = products
    .filter((product) => product.brand.toLowerCase() === brand.toLowerCase())
    .sort((a, b) => a.price - b.price)
    .slice(0, 5);

  if (matched.length === 0) {
    return `Sorry, we do not have ${brand} products in current sample data.`;
  }

  const lines = matched.map(
    (product) => `- ${product.name} - ${formatPriceVND(product.price)}`
  );

  return `Top ${brand} suggestions:\n${lines.join(
    '\n'
  )}\nTell me your budget if you want more specific recommendations.`;
}

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

app.post('/api/chat', async (req, res) => {
  const rawMessage = (req.body.message || '').toString().trim();
  const normalizedMessage = normalizeText(rawMessage);

  const { intent, faqIntent, brand, budget } = detectIntent(normalizedMessage);
  const products = await getChatbotProducts();

  let reply =
    'Sorry, I did not fully understand. Please ask about budget, brand (iPhone/Samsung/Xiaomi), opening hours, warranty, or promotions.';

  switch (intent) {
    case 'empty':
      reply = 'Please type your question so I can help you.';
      break;

    case 'greeting':
      reply = 'Hello! Welcome to Phone Store. How can I help you today?';
      break;

    case 'faq':
      reply = FAQ_RESPONSES[faqIntent];
      break;

    case 'budget':
      reply = buildBudgetReply(products, budget);
      break;

    case 'brand':
      reply = buildBrandReply(products, brand);
      break;

    default:
      break;
  }

  return res.json({ reply, intent });
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
