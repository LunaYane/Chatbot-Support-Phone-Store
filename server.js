const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Phone = require('./models/Phone');
const { normalizeText, withRecommendation } = require('./utils/recommendation');

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
  {
    id: 1,
    name: 'iPhone 15',
    brand: 'Apple',
    price: 21990000,
    specifications: { processor: 'Apple A16 Bionic', ram: '6 GB', battery: '3349 mAh', camera: '48MP + 12MP' },
    description: 'Balanced iPhone model with great cameras and smooth iOS experience.'
  },
  {
    id: 2,
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 27990000,
    specifications: {
      processor: 'Snapdragon 8 Gen 3 for Galaxy',
      ram: '12 GB',
      battery: '5000 mAh',
      camera: '200MP + 12MP + 50MP + 10MP'
    },
    description: 'Large AMOLED display, S Pen support, and powerful performance for work and entertainment.'
  },
  {
    id: 3,
    name: 'Galaxy A55 5G',
    brand: 'Samsung',
    price: 9990000,
    specifications: { processor: 'Exynos 1480', ram: '8 GB', battery: '5000 mAh', camera: '50MP + 12MP + 5MP' },
    description: 'Popular mid-range phone with premium metal frame and great battery life.'
  },
  {
    id: 4,
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    price: 17990000,
    specifications: { processor: 'Snapdragon 8 Gen 3', ram: '12 GB', battery: '4610 mAh', camera: '50MP + 50MP + 50MP' },
    description: 'High-value flagship with smooth performance, great display, and fast charging.'
  },
  {
    id: 5,
    name: 'Redmi Note 13 Pro+',
    brand: 'Xiaomi',
    price: 10990000,
    specifications: {
      processor: 'MediaTek Dimensity 7200 Ultra',
      ram: '12 GB',
      battery: '5000 mAh',
      camera: '200MP + 8MP + 2MP'
    },
    description: 'Curved display phone with 200MP camera and fast charging.'
  },
  {
    id: 6,
    name: 'Nokia G42 5G',
    brand: 'Nokia',
    price: 5990000,
    specifications: { processor: 'Snapdragon 480+', ram: '6 GB', battery: '5000 mAh', camera: '50MP + 2MP + 2MP' },
    description: 'Durable and affordable 5G phone with clean Android experience.'
  }
].map(withRecommendation);

const FAQ_RESPONSES = {
  openingHours: 'Our store is open from 08:30 to 21:30 every day (Monday - Sunday).',
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

const NEED_KEYWORDS = {
  gaming: ['gaming', 'choi game', 'game', 'pubg', 'lien quan', 'fps'],
  camera: ['camera', 'chup anh', 'photography', 'selfie', 'quay phim', 'photo'],
  battery: ['battery', 'pin', 'dung lau', 'pin trau', 'battery life', 'lau het pin'],
  basic: ['hoc tap', 'study', 'studying', 'basic', 'co ban', 'sinh vien', 'van phong']
};

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

function detectNeeds(message) {
  return Object.entries(NEED_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => message.includes(keyword)))
    .map(([need]) => need);
}

function detectIntent(message) {
  if (!message) {
    return { intent: 'empty' };
  }

  const faqIntent = detectFaqIntent(message);
  if (faqIntent) {
    return { intent: 'faq', faqIntent };
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('xin chao')) {
    return { intent: 'greeting' };
  }

  const budget = extractBudget(message);
  const brand = getMatchedBrand(message);
  const needs = detectNeeds(message);

  if (budget || brand || needs.length > 0) {
    return {
      intent: 'recommendation',
      budget,
      brand,
      needs
    };
  }

  return { intent: 'fallback' };
}

async function getChatbotProducts() {
  try {
    const products = await Phone.find(
      {},
      {
        _id: 0,
        id: 1,
        name: 1,
        brand: 1,
        price: 1,
        description: 1,
        specifications: 1,
        recommendation: 1
      }
    )
      .sort({ price: 1 })
      .lean();

    if (products.length > 0) {
      return products.map(withRecommendation);
    }

    return SAMPLE_PRODUCTS;
  } catch (error) {
    return SAMPLE_PRODUCTS;
  }
}

function matchNeed(phone, need) {
  if (need === 'gaming') return phone.recommendation?.suitable_for_gaming;
  if (need === 'camera') return phone.recommendation?.suitable_for_camera;
  if (need === 'battery') return phone.recommendation?.suitable_for_battery;
  if (need === 'basic') return phone.recommendation?.suitable_for_basic_use;
  return false;
}

function needLabel(need) {
  if (need === 'gaming') return 'gaming';
  if (need === 'camera') return 'camera';
  if (need === 'battery') return 'battery';
  if (need === 'basic') return 'basic use';
  return '';
}

function getPhoneStrengthTags(phone) {
  const tags = [];
  if (phone.recommendation?.suitable_for_gaming) tags.push('gaming');
  if (phone.recommendation?.suitable_for_camera) tags.push('camera');
  if (phone.recommendation?.suitable_for_battery) tags.push('battery');
  if (phone.recommendation?.suitable_for_basic_use) tags.push('basic use');
  return tags;
}

function buildRecommendationReply(products, filters) {
  const { budget, brand, needs } = filters;

  let filtered = [...products];

  if (budget) {
    filtered = filtered.filter((product) => product.price <= budget);
  }

  if (brand) {
    filtered = filtered.filter((product) => product.brand.toLowerCase() === brand.toLowerCase());
  }

  if (needs.length > 0) {
    filtered = filtered.filter((product) => needs.every((need) => matchNeed(product, need)));
  }

  let exactMatch = true;

  if (filtered.length === 0 && needs.length > 0) {
    exactMatch = false;
    let fallback = [...products];

    if (budget) fallback = fallback.filter((product) => product.price <= budget);
    if (brand) fallback = fallback.filter((product) => product.brand.toLowerCase() === brand.toLowerCase());

    filtered = fallback
      .map((product) => ({
        ...product,
        score: needs.reduce((sum, need) => sum + (matchNeed(product, need) ? 1 : 0), 0)
      }))
      .filter((product) => product.score > 0)
      .sort((a, b) => b.score - a.score || a.price - b.price);
  }

  filtered = filtered.sort((a, b) => a.price - b.price).slice(0, 5);

  if (filtered.length === 0) {
    return 'Sorry, I cannot find phones matching your conditions right now. Please increase budget or try another brand/need.';
  }

  const conditionParts = [];
  if (budget) conditionParts.push(`budget <= ${formatPriceVND(budget)}`);
  if (brand) conditionParts.push(`brand ${brand}`);
  if (needs.length > 0) conditionParts.push(`need: ${needs.map(needLabel).join(', ')}`);

  const header = exactMatch
    ? `Here are the best matches for ${conditionParts.join(' | ')}:`
    : `I could not find exact matches, but these are close options for ${conditionParts.join(' | ')}:`;

  const lines = filtered.map((product) => {
    const tags = getPhoneStrengthTags(product).join(', ');
    return `- ${product.name} (${product.brand}) - ${formatPriceVND(product.price)} [${tags}]`;
  });

  return `${header}\n${lines.join('\n')}\nIf you want, I can narrow this down to only 2-3 best picks.`;
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

  const { intent, faqIntent, budget, brand, needs } = detectIntent(normalizedMessage);
  const products = await getChatbotProducts();

  let reply =
    'Sorry, I did not fully understand. Please ask with budget, brand, or need (gaming/camera/battery/basic use).';

  switch (intent) {
    case 'empty':
      reply = 'Please type your question so I can help you.';
      break;

    case 'greeting':
      reply = 'Hello! Tell me your budget, preferred brand, or usage needs (gaming/camera/battery/basic).';
      break;

    case 'faq':
      reply = FAQ_RESPONSES[faqIntent];
      break;

    case 'recommendation':
      reply = buildRecommendationReply(products, {
        budget,
        brand,
        needs
      });
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
