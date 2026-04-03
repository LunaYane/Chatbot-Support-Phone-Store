const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const Phone = require('./models/Phone');
const rawPhones = require('./data/phones');
const { normalizeText, withRecommendation, buildRecommendationAttributes } = require('./utils/recommendation');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phone-store-demo';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB.'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

const SAMPLE_PRODUCTS = rawPhones.map(withRecommendation);

const FAQ_RESPONSES = {
  openingHours: 'Cửa hàng mở cửa từ 08:30 đến 21:30 hằng ngày (Thứ 2 đến Chủ nhật).',
  warranty:
    'Bên mình bảo hành chính hãng 12 tháng cho đa số sản phẩm. Khi cần hỗ trợ, bạn mang máy + hóa đơn đến cửa hàng nhé.',
  promotions:
    'Hiện có ưu đãi giảm đến 10% trên một số mẫu và hỗ trợ freeship nội thành. Bạn muốn mình gợi ý mẫu đang giá tốt luôn không?',
  contact:
    'Bạn có thể liên hệ hotline 0909 123 456, email support@phonestoredemo.vn hoặc đến trực tiếp 123 Lê Lợi, Q1, TP.HCM.'
};

const BRAND_KEYWORDS = {
  Apple: ['apple', 'iphone', 'ios'],
  Samsung: ['samsung', 'galaxy'],
  Xiaomi: ['xiaomi', 'redmi', 'mi'],
  OPPO: ['oppo'],
  vivo: ['vivo']
};

const NEED_KEYWORDS = {
  gaming: ['choi game', 'gaming', 'game', 'pubg', 'lien quan', 'fps', 'hieu nang manh'],
  camera: ['chup anh', 'camera dep', 'camera', 'selfie', 'quay phim', 'photography', 'anh dep'],
  battery: ['pin trau', 'pin lau', 'dung lau', 'battery', 'thoi luong pin', 'khong muon sac nhieu'],
  student: ['hoc tap', 'sinh vien', 'co ban', 'van phong', 'study', 'basic use', 'gia mem']
};

const UNDER_BUDGET_KEYWORDS = ['duoi', 'toi da', 'khong qua', 'it hon', 'nho hon', 'under', 'max'];
const AROUND_BUDGET_KEYWORDS = ['tam', 'khoang', 'gan', 'co', 'around'];

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const adminTokens = new Set();

function safeCompare(valueA, valueB) {
  const bufferA = Buffer.from(String(valueA));
  const bufferB = Buffer.from(String(valueB));

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function isValidAdminCredential(username, password) {
  return safeCompare(username, ADMIN_USERNAME) && safeCompare(password, ADMIN_PASSWORD);
}

function requireAdmin(req, res, next) {
  const token = req.header('x-admin-token') || '';

  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ message: 'Admin login required.' });
  }

  return next();
}

function formatPriceVND(amount) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
}

function getMatchedBrand(message) {
  for (const [brand, keywords] of Object.entries(BRAND_KEYWORDS)) {
    if (keywords.some((keyword) => message.includes(keyword))) {
      return brand;
    }
  }

  return null;
}

function detectNeeds(message) {
  return Object.entries(NEED_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => message.includes(keyword)))
    .map(([need]) => need);
}

function extractBudgetNumber(message) {
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

function detectBudget(message) {
  const value = extractBudgetNumber(message);
  if (!value) return null;

  const isUnderBudget = UNDER_BUDGET_KEYWORDS.some((keyword) => message.includes(keyword));
  const isAroundBudget = AROUND_BUDGET_KEYWORDS.some((keyword) => message.includes(keyword));

  if (isUnderBudget) {
    return {
      type: 'under',
      min: 0,
      max: value,
      text: `dưới ${formatPriceVND(value)}`
    };
  }

  const spread = Math.max(1000000, Math.round(value * 0.2));
  const min = Math.max(0, value - spread);
  const max = value + spread;

  if (isAroundBudget || !isUnderBudget) {
    return {
      type: 'around',
      min,
      max,
      text: `khoảng ${formatPriceVND(value)}`
    };
  }

  return null;
}

function detectFaqIntent(message) {
  if (
    message.includes('gio mo cua') ||
    message.includes('mo cua') ||
    message.includes('may gio mo') ||
    message.includes('opening hour')
  ) {
    return 'openingHours';
  }

  if (
    message.includes('bao hanh') ||
    message.includes('warranty') ||
    message.includes('doi tra') ||
    message.includes('bao tri')
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

  if (
    message.includes('lien he') ||
    message.includes('hotline') ||
    message.includes('so dien thoai') ||
    message.includes('dia chi') ||
    message.includes('contact')
  ) {
    return 'contact';
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

  if (message.includes('xin chao') || message.includes('chao') || message.includes('hello') || message === 'hi') {
    return { intent: 'greeting' };
  }

  const budget = detectBudget(message);
  const brand = getMatchedBrand(message);
  const needs = detectNeeds(message);

  if (budget || brand || needs.length > 0) {
    return {
      intent: 'consultation',
      budget,
      brand,
      needs
    };
  }

  return { intent: 'clarify' };
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
  if (need === 'student') return phone.recommendation?.suitable_for_basic_use;
  return false;
}

function needDisplayText(need) {
  if (need === 'gaming') return 'chơi game';
  if (need === 'camera') return 'chụp ảnh đẹp';
  if (need === 'battery') return 'pin trâu';
  if (need === 'student') return 'học tập / sinh viên';
  return need;
}

function buildReasonForPhone(phone, needs) {
  const reasons = [];
  if (needs.includes('gaming') && phone.recommendation?.suitable_for_gaming) reasons.push('hiệu năng ổn cho game');
  if (needs.includes('camera') && phone.recommendation?.suitable_for_camera) reasons.push('camera chụp ảnh tốt');
  if (needs.includes('battery') && phone.recommendation?.suitable_for_battery) reasons.push('pin tốt, dùng lâu');
  if (needs.includes('student') && phone.recommendation?.suitable_for_basic_use) reasons.push('phù hợp học tập/sinh viên');

  return reasons.length > 0 ? reasons.join(', ') : 'giá/nhu cầu khá cân bằng';
}

function applyBudgetFilter(products, budget) {
  if (!budget) return products;

  if (budget.type === 'under') {
    return products.filter((product) => product.price <= budget.max);
  }

  return products.filter((product) => product.price >= budget.min && product.price <= budget.max);
}

function buildNoMatchResponse({ budget, brand, needs }) {
  const conditions = [];
  if (budget) conditions.push(budget.text);
  if (brand) conditions.push(`hãng ${brand}`);
  if (needs.length > 0) conditions.push(`nhu cầu ${needs.map(needDisplayText).join(', ')}`);

  return `Xin lỗi bạn, hiện mình chưa tìm thấy mẫu phù hợp ${conditions.join(' + ')}. Bạn muốn nới ngân sách hoặc đổi hãng để mình gợi ý lại tốt hơn không?`;
}

function buildConsultationReply(products, filters) {
  const { budget, brand, needs } = filters;

  let filtered = [...products];

  if (brand) {
    filtered = filtered.filter((product) => normalizeText(product.brand) === normalizeText(brand));
  }

  filtered = applyBudgetFilter(filtered, budget);

  let usedRelaxedMatch = false;
  let scored = [];

  if (needs.length > 0) {
    const strictMatches = filtered.filter((product) => needs.every((need) => matchNeed(product, need)));

    if (strictMatches.length > 0) {
      filtered = strictMatches;
    } else {
      usedRelaxedMatch = true;
      scored = filtered
        .map((product) => ({
          ...product,
          matchScore: needs.reduce((score, need) => score + (matchNeed(product, need) ? 1 : 0), 0)
        }))
        .filter((product) => product.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore || a.price - b.price);

      filtered = scored;
    }
  }

  filtered = filtered.sort((a, b) => a.price - b.price).slice(0, 3);

  if (filtered.length === 0) {
    return buildNoMatchResponse({ budget, brand, needs });
  }

  const conditions = [];
  if (budget) conditions.push(budget.text);
  if (brand) conditions.push(`hãng ${brand}`);
  if (needs.length > 0) conditions.push(`nhu cầu ${needs.map(needDisplayText).join(', ')}`);

  const intro = usedRelaxedMatch
    ? `Mình chưa thấy mẫu khớp 100% theo ${conditions.join(' + ')}, nhưng đây là 3 lựa chọn gần nhất:`
    : `Mình gợi ý 3 mẫu phù hợp theo ${conditions.join(' + ')}:`;

  const lines = filtered.map((product, index) => {
    const reason = buildReasonForPhone(product, needs);
    return `${index + 1}. ${product.name} (${product.brand}) - ${formatPriceVND(product.price)}\n   → ${reason}`;
  });

  return `${intro}\n${lines.join('\n')}\nBạn muốn mình chốt 1 mẫu tối ưu nhất theo nhu cầu của bạn không?`;
}

function buildClarifyReply() {
  return 'Mình có thể tư vấn theo ngân sách (ví dụ: dưới 7 triệu), hãng (iPhone/Samsung/Xiaomi/Oppo/Vivo), hoặc nhu cầu (chơi game, chụp ảnh, pin trâu, học tập). Bạn muốn theo tiêu chí nào trước?';
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

app.post('/api/admin/login', (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '').trim();

  if (!isValidAdminCredential(username, password)) {
    return res.status(401).json({ message: 'Invalid admin username or password.' });
  }

  const token = crypto.randomBytes(24).toString('hex');
  adminTokens.add(token);

  return res.json({ token, username: ADMIN_USERNAME });
});

app.get('/api/admin/session', (req, res) => {
  const token = req.header('x-admin-token') || '';
  const isAdmin = Boolean(token && adminTokens.has(token));

  return res.json({ isAdmin, username: isAdmin ? ADMIN_USERNAME : null });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = req.header('x-admin-token') || '';
  adminTokens.delete(token);
  return res.json({ message: 'Logged out successfully.' });
});

app.get('/api/admin/products', async (req, res) => {
  try {
    const products = await Phone.find({}).sort({ id: 1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Cannot load admin products right now.' });
  }
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      image,
      description,
      display,
      processor,
      ram,
      storage,
      battery,
      camera
    } = req.body;

    if (!name || !brand || !price || !image || !description) {
      return res.status(400).json({ message: 'Please provide required fields.' });
    }

    const maxPhone = await Phone.findOne().sort({ id: -1 }).lean();
    const newId = maxPhone ? maxPhone.id + 1 : 1;

    const newPhoneData = {
      id: newId,
      name: String(name).trim(),
      brand: String(brand).trim(),
      price: Number(price),
      image: String(image).trim(),
      description: String(description).trim(),
      specifications: {
        display: String(display || '').trim(),
        processor: String(processor || '').trim(),
        ram: String(ram || '').trim(),
        storage: String(storage || '').trim(),
        battery: String(battery || '').trim(),
        camera: String(camera || '').trim()
      }
    };

    newPhoneData.recommendation = buildRecommendationAttributes(newPhoneData);

    const createdPhone = await Phone.create(newPhoneData);
    return res.status(201).json(createdPhone);
  } catch (error) {
    return res.status(500).json({ message: 'Cannot add product right now.' });
  }
});

app.put('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const phoneId = Number(req.params.id);

    const existingPhone = await Phone.findOne({ id: phoneId });
    if (!existingPhone) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const {
      name,
      brand,
      price,
      image,
      description,
      display,
      processor,
      ram,
      storage,
      battery,
      camera
    } = req.body;

    const updatedData = {
      id: phoneId,
      name: String(name || existingPhone.name).trim(),
      brand: String(brand || existingPhone.brand).trim(),
      price: Number(price || existingPhone.price),
      image: String(image || existingPhone.image).trim(),
      description: String(description || existingPhone.description).trim(),
      specifications: {
        display: String(display || existingPhone.specifications?.display || '').trim(),
        processor: String(processor || existingPhone.specifications?.processor || '').trim(),
        ram: String(ram || existingPhone.specifications?.ram || '').trim(),
        storage: String(storage || existingPhone.specifications?.storage || '').trim(),
        battery: String(battery || existingPhone.specifications?.battery || '').trim(),
        camera: String(camera || existingPhone.specifications?.camera || '').trim()
      }
    };

    updatedData.recommendation = buildRecommendationAttributes(updatedData);

    const updatedPhone = await Phone.findOneAndUpdate({ id: phoneId }, updatedData, {
      new: true,
      runValidators: true
    });

    return res.json(updatedPhone);
  } catch (error) {
    return res.status(500).json({ message: 'Cannot update product right now.' });
  }
});

app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
  try {
    const phoneId = Number(req.params.id);
    const deletedPhone = await Phone.findOneAndDelete({ id: phoneId });

    if (!deletedPhone) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Cannot delete product right now.' });
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
  const rawMessage = String(req.body?.message || '').trim();
  const message = normalizeText(rawMessage);

  const { intent, faqIntent, budget, brand, needs } = detectIntent(message);
  const products = await getChatbotProducts();

  let reply =
    'Mình chưa hiểu rõ lắm. Bạn thử nói theo dạng: dưới 7 triệu, hãng Samsung, hoặc nhu cầu chụp ảnh/pin trâu để mình tư vấn chính xác hơn nhé.';

  switch (intent) {
    case 'empty':
      reply = 'Bạn mô tả nhu cầu giúp mình nhé. Ví dụ: dưới 10 triệu, pin trâu, hoặc muốn iPhone.';
      break;

    case 'greeting':
      reply = 'Chào bạn 👋 Mình có thể tư vấn điện thoại theo ngân sách, hãng và nhu cầu sử dụng. Bạn đang muốn tìm máy khoảng bao nhiêu tiền?';
      break;

    case 'faq':
      reply = FAQ_RESPONSES[faqIntent];
      break;

    case 'consultation':
      reply = buildConsultationReply(products, { budget, brand, needs });
      break;

    case 'clarify':
      reply = buildClarifyReply();
      break;

    default:
      break;
  }

  return res.json({ reply, intent });
});

app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detail.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Phone Store Demo is running at http://localhost:${PORT}`);
});
