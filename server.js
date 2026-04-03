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

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(tags || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSpecifications(specs = {}) {
  return {
    display: String(specs.display || '').trim(),
    processor: String(specs.processor || '').trim(),
    ram: String(specs.ram || '').trim(),
    storage: String(specs.storage || '').trim(),
    battery: String(specs.battery || '').trim(),
    camera: String(specs.camera || '').trim()
  };
}

function normalizePhoneData(phone) {
  const shortDescription = String(phone.shortDescription || '').trim();
  const fullDescription = String(phone.fullDescription || '').trim();
  const fallbackDescription = String(phone.description || shortDescription || fullDescription || '').trim();

  return {
    ...phone,
    shortDescription: shortDescription || fallbackDescription,
    fullDescription: fullDescription || fallbackDescription,
    description: fallbackDescription,
    tags: normalizeTags(phone.tags),
    specifications: normalizeSpecifications(phone.specifications)
  };
}

const SAMPLE_PRODUCTS = rawPhones.map((phone) => normalizePhoneData(withRecommendation(phone)));

const FAQ_RESPONSES = {
  openingHours: 'Cửa hàng mở cửa từ 08:30 đến 21:30 mỗi ngày (Thứ 2 - Chủ nhật).',
  warranty:
    'Hầu hết sản phẩm được bảo hành chính hãng 12 tháng. Bạn mang máy + hóa đơn đến cửa hàng để được hỗ trợ nhanh.',
  promotions:
    'Hiện có ưu đãi giảm đến 10% cho một số model và hỗ trợ freeship nội thành. Bạn muốn mình gợi ý mẫu đang có giá tốt không?',
  contact:
    'Bạn có thể liên hệ hotline 0909 123 456, email support@phonestoredemo.vn hoặc đến 123 Lê Lợi, Quận 1, TP.HCM.'
};

const BRAND_KEYWORDS = {
  Apple: ['apple', 'iphone', 'ios'],
  Samsung: ['samsung', 'galaxy'],
  Xiaomi: ['xiaomi', 'redmi', 'mi'],
  OPPO: ['oppo'],
  vivo: ['vivo']
};

const NEED_KEYWORDS = {
  gaming: [
    'choi game',
    'gaming',
    'game',
    'pubg',
    'lien quan',
    'fps',
    'hieu nang manh',
    'chien game',
    'game on dinh'
  ],
  camera: [
    'chup anh',
    'camera dep',
    'camera',
    'selfie',
    'quay phim',
    'photography',
    'anh dep',
    'chup dep',
    'song ao'
  ],
  battery: [
    'pin trau',
    'pin lau',
    'dung lau',
    'battery',
    'thoi luong pin',
    'pin khoe',
    'it sac',
    'xai lau'
  ],
  student: [
    'hoc tap',
    'sinh vien',
    'co ban',
    'van phong',
    'study',
    'basic',
    'gia re',
    'de dung'
  ]
};

const UNDER_BUDGET_KEYWORDS = ['duoi', 'toi da', 'khong qua', 'it hon', 'under', 'max'];
const AROUND_BUDGET_KEYWORDS = ['tam', 'khoang', 'gan', 'around'];

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

  if (isAroundBudget || !isUnderBudget) {
    const spread = Math.max(1000000, Math.round(value * 0.2));
    const min = Math.max(0, value - spread);
    const max = value + spread;

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
    message.includes('opening hour') ||
    message.includes('may gio')
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

  if (message.includes('xin chao') || message === 'chao' || message.includes('hello') || message === 'hi') {
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
        shortDescription: 1,
        fullDescription: 1,
        description: 1,
        tags: 1,
        specifications: 1,
        recommendation: 1
      }
    )
      .sort({ price: 1 })
      .lean();

    if (products.length > 0) {
      return products.map((phone) => normalizePhoneData(withRecommendation(phone)));
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
  if (need === 'battery') return 'pin khỏe';
  if (need === 'student') return 'học tập / sinh viên';
  return need;
}

function scoreProduct(phone, filters) {
  const { budget, brand, needs } = filters;
  let score = 0;

  if (brand && normalizeText(phone.brand) === normalizeText(brand)) {
    score += 35;
  }

  if (budget) {
    if (budget.type === 'under') {
      if (phone.price <= budget.max) {
        score += 30;
        score += Math.max(0, Math.round((budget.max - phone.price) / 1000000));
      } else {
        score -= 40;
      }
    } else {
      const center = Math.round((budget.min + budget.max) / 2);
      const distance = Math.abs(phone.price - center);
      if (phone.price >= budget.min && phone.price <= budget.max) {
        score += 25;
      }
      score += Math.max(0, 15 - Math.round(distance / 1000000));
    }
  }

  if (needs.length > 0) {
    needs.forEach((need) => {
      score += matchNeed(phone, need) ? 20 : -8;
    });
  }

  return score;
}

function buildReasonForPhone(phone, needs, budget) {
  const reasons = [];

  if (budget?.type === 'under' && phone.price <= budget.max) {
    reasons.push(`đúng ngân sách dưới ${formatPriceVND(budget.max)}`);
  }

  if (budget?.type === 'around') {
    reasons.push(`nằm trong tầm giá ${budget.text}`);
  }

  if (needs.includes('gaming') && phone.recommendation?.suitable_for_gaming) reasons.push('hiệu năng chơi game ổn');
  if (needs.includes('camera') && phone.recommendation?.suitable_for_camera) reasons.push('camera chụp ảnh đẹp');
  if (needs.includes('battery') && phone.recommendation?.suitable_for_battery) reasons.push('pin khỏe, dùng lâu');
  if (needs.includes('student') && phone.recommendation?.suitable_for_basic_use) reasons.push('phù hợp cho sinh viên');

  return reasons.slice(0, 2).join(', ') || 'cấu hình và giá khá cân bằng';
}

function buildNoMatchResponse({ budget, brand, needs }) {
  const conditions = [];
  if (budget) conditions.push(budget.text);
  if (brand) conditions.push(`hãng ${brand}`);
  if (needs.length > 0) conditions.push(`nhu cầu ${needs.map(needDisplayText).join(', ')}`);

  return `Xin lỗi bạn, hiện chưa có mẫu thật sự phù hợp với ${conditions.join(' + ')}. Bạn muốn nới ngân sách nhẹ hoặc đổi hãng để mình gợi ý tốt hơn không?`;
}

function buildConsultationResult(products, filters) {
  const { budget, brand, needs } = filters;

  const scored = products
    .map((product) => ({
      ...product,
      score: scoreProduct(product, filters)
    }))
    .filter((product) => product.score > -20)
    .sort((a, b) => b.score - a.score || a.price - b.price);

  const topMatches = scored.slice(0, 3);

  if (topMatches.length === 0 || topMatches[0].score < 5) {
    return {
      hasMatch: false,
      matches: [],
      text: buildNoMatchResponse({ budget, brand, needs })
    };
  }

  const conditions = [];
  if (budget) conditions.push(budget.text);
  if (brand) conditions.push(`hãng ${brand}`);
  if (needs.length > 0) conditions.push(`nhu cầu ${needs.map(needDisplayText).join(', ')}`);

  const intro = conditions.length
    ? `Mình gợi ý top 3 mẫu hợp với ${conditions.join(' + ')}:`
    : 'Mình gợi ý 3 mẫu nổi bật cho bạn:';

  const lines = topMatches.map((product, index) => {
    const reason = buildReasonForPhone(product, needs, budget);
    return `${index + 1}. ${product.name} (${product.brand}) - ${formatPriceVND(product.price)}\n   → ${reason}`;
  });

  return {
    hasMatch: true,
    matches: topMatches,
    text: `${intro}\n${lines.join('\n')}\nBạn muốn mình lọc tiếp theo hãng hay theo pin/camera để chốt nhanh hơn không?`
  };
}

function buildClarifyReply() {
  return 'Mình có thể tư vấn theo 3 tiêu chí: ngân sách, hãng và nhu cầu. Ví dụ bạn có thể nói: "dưới 7 triệu pin khỏe" hoặc "Samsung chụp ảnh đẹp". Bạn muốn ưu tiên tiêu chí nào trước?';
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

    const phones = await Phone.find(query).sort({ price: 1 }).lean();
    const normalized = phones.map(normalizePhoneData);

    return res.json(normalized);
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
    const products = await Phone.find({}).sort({ id: 1 }).lean();
    return res.json(products.map(normalizePhoneData));
  } catch (error) {
    return res.status(500).json({ message: 'Cannot load admin products right now.' });
  }
});

app.post('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const {
      id,
      name,
      brand,
      price,
      image,
      shortDescription,
      fullDescription,
      specs,
      tags,
      description,
      display,
      processor,
      ram,
      storage,
      battery,
      camera
    } = req.body;

    if (!name || !brand || !price || !image) {
      return res.status(400).json({ message: 'Please provide required fields.' });
    }

    const resolvedDescription = String(fullDescription || shortDescription || description || '').trim();
    if (!resolvedDescription) {
      return res.status(400).json({ message: 'Please provide shortDescription or fullDescription.' });
    }

    const maxPhone = await Phone.findOne().sort({ id: -1 }).lean();
    const generatedId = maxPhone ? maxPhone.id + 1 : 1;
    const newId = Number(id) > 0 ? Number(id) : generatedId;

    const idExists = await Phone.findOne({ id: newId });
    if (idExists) {
      return res.status(400).json({ message: 'ID already exists. Please choose another ID.' });
    }

    const specsFromObject = typeof specs === 'object' && specs !== null ? specs : {};

    const newPhoneData = {
      id: newId,
      name: String(name).trim(),
      brand: String(brand).trim(),
      price: Number(price),
      image: String(image).trim(),
      shortDescription: String(shortDescription || '').trim(),
      fullDescription: String(fullDescription || '').trim(),
      tags: normalizeTags(tags),
      description: resolvedDescription,
      specifications: normalizeSpecifications({
        display: specsFromObject.display || display,
        processor: specsFromObject.processor || processor,
        ram: specsFromObject.ram || ram,
        storage: specsFromObject.storage || storage,
        battery: specsFromObject.battery || battery,
        camera: specsFromObject.camera || camera
      })
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
      id,
      name,
      brand,
      price,
      image,
      shortDescription,
      fullDescription,
      specs,
      tags,
      description,
      display,
      processor,
      ram,
      storage,
      battery,
      camera
    } = req.body;

    const nextId = Number(id || phoneId);
    if (nextId !== phoneId) {
      const idExists = await Phone.findOne({ id: nextId });
      if (idExists) {
        return res.status(400).json({ message: 'ID already exists. Please choose another ID.' });
      }
    }

    const specsFromObject = typeof specs === 'object' && specs !== null ? specs : {};

    const resolvedDescription = String(
      fullDescription ||
        shortDescription ||
        description ||
        existingPhone.fullDescription ||
        existingPhone.shortDescription ||
        existingPhone.description
    ).trim();

    const updatedData = {
      id: nextId,
      name: String(name || existingPhone.name).trim(),
      brand: String(brand || existingPhone.brand).trim(),
      price: Number(price || existingPhone.price),
      image: String(image || existingPhone.image).trim(),
      shortDescription: String(shortDescription || existingPhone.shortDescription || '').trim(),
      fullDescription: String(fullDescription || existingPhone.fullDescription || '').trim(),
      tags: normalizeTags(tags || existingPhone.tags),
      description: resolvedDescription,
      specifications: normalizeSpecifications({
        display: specsFromObject.display || display || existingPhone.specifications?.display,
        processor: specsFromObject.processor || processor || existingPhone.specifications?.processor,
        ram: specsFromObject.ram || ram || existingPhone.specifications?.ram,
        storage: specsFromObject.storage || storage || existingPhone.specifications?.storage,
        battery: specsFromObject.battery || battery || existingPhone.specifications?.battery,
        camera: specsFromObject.camera || camera || existingPhone.specifications?.camera
      })
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
    const phone = await Phone.findOne({ id: phoneId }).lean();

    if (!phone) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(normalizePhoneData(phone));
  } catch (error) {
    return res.status(500).json({ message: 'Cannot load product detail right now.' });
  }
});

app.post('/api/chat', async (req, res) => {
  const rawMessage = String(req.body?.message || '').trim();
  const message = normalizeText(rawMessage);

  const { intent, faqIntent, budget, brand, needs } = detectIntent(message);
  const products = await getChatbotProducts();
  const consultationResult = buildConsultationResult(products, { budget, brand, needs: needs || [] });

  let reply =
    'Mình chưa hiểu rõ lắm. Bạn thử nói theo dạng: dưới 7 triệu, hãng Samsung, hoặc nhu cầu chụp ảnh/pin khỏe để mình tư vấn chính xác hơn nhé.';

  switch (intent) {
    case 'empty':
      reply = 'Bạn mô tả nhu cầu giúp mình nhé. Ví dụ: dưới 10 triệu, pin khỏe, hoặc muốn iPhone.';
      break;

    case 'greeting':
      reply = 'Chào bạn 👋 Mình có thể tư vấn theo ngân sách, hãng và nhu cầu sử dụng. Bạn đang muốn tìm máy khoảng bao nhiêu tiền?';
      break;

    case 'faq':
      reply = FAQ_RESPONSES[faqIntent];
      break;

    case 'consultation':
      reply = consultationResult.text;
      break;

    case 'clarify':
      reply = buildClarifyReply();
      break;

    default:
      break;
  }

  return res.json({ reply, intent, source: 'rule' });
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
