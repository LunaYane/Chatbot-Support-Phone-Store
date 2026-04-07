const { normalizeText } = require('../utils/recommendation');

const FAQ_RESPONSES = {
  openingHours: 'Shop mở cửa từ 08:30 đến 21:30 hằng ngày nha bạn.',
  warranty:
    'Bên mình bảo hành chính hãng 12 tháng (tùy mẫu có thể dài hơn). Khi cần hỗ trợ bạn chỉ cần mang máy + hóa đơn là được.',
  promotions:
    'Hiện shop có nhiều mẫu đang giảm giá nhẹ + hỗ trợ freeship nội thành. Bạn muốn mình lọc nhanh mẫu đang giá tốt không?',
  contact:
    'Bạn liên hệ hotline 0909 123 456 hoặc ghé 123 Lê Lợi, Quận 1, TP.HCM nhé.'
};

const BRAND_KEYWORDS = {
  Apple: ['apple', 'iphone', 'ios'],
  Samsung: ['samsung', 'galaxy'],
  Xiaomi: ['xiaomi', 'redmi', 'poco', 'mi'],
  OPPO: ['oppo', 'find x'],
  vivo: ['vivo'],
  Google: ['google', 'pixel'],
  OnePlus: ['oneplus'],
  ASUS: ['asus', 'rog']
};

const NEED_KEYWORDS = {
  gaming: ['choi game', 'gaming', 'pubg', 'lien quan', 'fps', 'hieu nang', 'chip manh'],
  camera: ['chup anh', 'camera dep', 'camera', 'selfie', 'quay phim', 'chan dung'],
  battery: ['pin trau', 'pin lau', 'dung lau', 'battery', 'it sac', 'on dinh ca ngay'],
  student: ['hoc tap', 'sinh vien', 'co ban', 'van phong', 'gia re', 'de dung'],
  premium: ['cao cap', 'flagship', 'xin', 'dep sang', 'xuat sac']
};

const UNDER_BUDGET_KEYWORDS = ['duoi', 'toi da', 'khong qua', 'it hon', 'under', 'max'];
const AROUND_BUDGET_KEYWORDS = ['tam', 'khoang', 'gan', 'around', 'cung tam'];

function formatPriceVND(amount) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
}

function humanizeNeed(need) {
  const map = {
    gaming: 'chơi game mượt',
    camera: 'chụp ảnh đẹp',
    battery: 'pin bền',
    student: 'học tập / dùng cơ bản',
    premium: 'trải nghiệm cao cấp'
  };
  return map[need] || need;
}

function detectFaqIntent(message) {
  if (['gio mo cua', 'mo cua', 'opening hour', 'may gio'].some((k) => message.includes(k))) return 'openingHours';
  if (['bao hanh', 'warranty', 'doi tra', 'bao tri'].some((k) => message.includes(k))) return 'warranty';
  if (['khuyen mai', 'uu dai', 'giam gia', 'promotion', 'sale'].some((k) => message.includes(k))) return 'promotions';
  if (['lien he', 'hotline', 'so dien thoai', 'dia chi', 'contact'].some((k) => message.includes(k))) return 'contact';
  return null;
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
  const millionMatch = message.match(/(\d+[\.,]?\d*)\s*(tr|trieu|cu|củ|m|million)/);
  if (millionMatch) return Math.round(parseFloat(millionMatch[1].replace(',', '.')) * 1000000);

  const thousandMatch = message.match(/(\d+[\.,]?\d*)\s*(k|nghin|thousand)/);
  if (thousandMatch) return Math.round(parseFloat(thousandMatch[1].replace(',', '.')) * 1000);

  const plainMatch = message.match(/\b\d{6,9}\b/);
  if (plainMatch) return Number(plainMatch[0]);
  return null;
}

function detectBudget(message) {
  const value = extractBudgetNumber(message);
  if (!value) return null;

  const isUnder = UNDER_BUDGET_KEYWORDS.some((k) => message.includes(k));
  const isAround = AROUND_BUDGET_KEYWORDS.some((k) => message.includes(k));

  if (isUnder) {
    return { type: 'under', min: 0, max: value, text: `dưới ${formatPriceVND(value)}` };
  }

  const spread = Math.max(1200000, Math.round(value * 0.22));
  return {
    type: isAround ? 'around' : 'around',
    min: Math.max(0, value - spread),
    max: value + spread,
    text: `khoảng ${formatPriceVND(value)}`
  };
}

function detectComparisonModels(message, products) {
  const lowered = normalizeText(message);
  const hits = products.filter((p) => lowered.includes(normalizeText(p.name))).slice(0, 3);
  return hits;
}

function detectIntent(message, products = []) {
  if (!message) return { intent: 'empty' };

  const faqIntent = detectFaqIntent(message);
  if (faqIntent) return { intent: 'faq', faqIntent };

  if (['xin chao', 'hello', 'hi', 'chao', 'alo'].includes(message) || message.includes('xin chao')) {
    return { intent: 'greeting' };
  }

  if (message.includes('so sanh') || message.includes('nen mua') || message.includes('chon giua')) {
    return { intent: 'comparison', models: detectComparisonModels(message, products) };
  }

  const budget = detectBudget(message);
  const brand = getMatchedBrand(message);
  const needs = detectNeeds(message);

  if (budget || brand || needs.length > 0) return { intent: 'consultation', budget, brand, needs };
  return { intent: 'clarify' };
}

function matchNeed(phone, need) {
  if (need === 'gaming') return phone.recommendation?.suitable_for_gaming;
  if (need === 'camera') return phone.recommendation?.suitable_for_camera;
  if (need === 'battery') return phone.recommendation?.suitable_for_battery;
  if (need === 'student') return phone.recommendation?.suitable_for_basic_use;
  if (need === 'premium') return Number(phone.price || 0) >= 20000000;
  return false;
}

function scoreProduct(phone, filters) {
  const { budget, brand, needs } = filters;
  let score = 0;

  if (brand && normalizeText(phone.brand) === normalizeText(brand)) score += 38;

  if (budget) {
    if (budget.type === 'under') {
      if (phone.price <= budget.max) {
        score += 28;
        score += Math.max(0, Math.round((budget.max - phone.price) / 1500000));
      } else {
        score -= 45;
      }
    } else {
      const center = Math.round((budget.min + budget.max) / 2);
      const distance = Math.abs(phone.price - center);
      if (phone.price >= budget.min && phone.price <= budget.max) score += 26;
      score += Math.max(0, 15 - Math.round(distance / 1400000));
    }
  }

  if (needs.length > 0) {
    needs.forEach((need) => {
      score += matchNeed(phone, need) ? 18 : -7;
    });
  }

  return score;
}

function buildNaturalLine(product, idx) {
  return `${idx + 1}) ${product.name} (${product.brand}) – ${formatPriceVND(product.price)}`;
}

function buildNoMatchReply(filters) {
  const parts = [];
  if (filters.brand) parts.push(`hãng ${filters.brand}`);
  if (filters.budget) parts.push(filters.budget.text);
  if (filters.needs?.length) parts.push(`nhu cầu ${filters.needs.map(humanizeNeed).join(', ')}`);

  const condition = parts.length ? parts.join(' + ') : 'nhu cầu hiện tại';

  return `Mình tìm theo ${condition} nhưng chưa ra mẫu thật sự ổn. Bạn muốn mình nới thêm ~1-2 triệu hoặc đổi hãng để có lựa chọn ngon hơn không?`;
}

function buildConsultationResult(products, filters) {
  const { budget, brand, needs } = filters;

  let candidates = brand
    ? products.filter((product) => normalizeText(product.brand) === normalizeText(brand))
    : products;

  if (budget?.type === 'under') {
    const underBudgetList = candidates.filter((product) => Number(product.price) <= Number(budget.max));
    if (underBudgetList.length > 0) candidates = underBudgetList;
  }

  const scored = candidates
    .map((product) => ({ ...product, score: scoreProduct(product, filters) }))
    .filter((product) => product.score > -20)
    .sort((a, b) => b.score - a.score || a.price - b.price)
    .slice(0, 3);

  if (!scored.length || scored[0].score < 5) {
    return buildNoMatchReply(filters);
  }

  const conditions = [];
  if (budget) conditions.push(budget.text);
  if (brand) conditions.push(`hãng ${brand}`);
  if (needs.length) conditions.push(needs.map(humanizeNeed).join(', '));

  const intro = conditions.length
    ? `Ok, mình lọc nhanh theo ${conditions.join(' + ')} và thấy mấy máy này khá hợp:`
    : 'Mình lọc nhanh và thấy mấy mẫu này đang rất đáng mua:';

  const lines = scored.map(buildNaturalLine).join('\n');
  return `${intro}\n${lines}\nBạn thích mình chốt theo hướng nào trước: camera, pin hay hiệu năng game?`;
}

function buildComparisonReply(models, lastContext = {}) {
  if (!models || models.length < 2) {
    return 'Mình so sánh được nhé 👌 Bạn gửi giúp mình 2 mẫu cụ thể (ví dụ: iPhone 16 vs S24 FE) + nhu cầu chính, mình chốt nhanh ưu/nhược điểm cho bạn.';
  }

  const [a, b] = models;
  const focus = (lastContext.needs || []).map(humanizeNeed).join(', ');
  const note = focus ? ` Theo nhu cầu ${focus},` : '';

  return `${note} ${a.name} mạnh ở ${a.specifications?.processor || 'hiệu năng'}, còn ${b.name} nổi bật ở ${b.specifications?.camera || 'camera'}.\nNếu bạn ưu tiên pin/giá thì mình chốt 1 con phù hợp nhất luôn cho bạn.`;
}

function buildClarifyReply(lastContext = {}) {
  const hints = [];
  if (!lastContext.brand) hints.push('hãng (vd: iPhone/Samsung)');
  if (!lastContext.budget) hints.push('ngân sách (vd: 12 triệu)');
  if (!lastContext.needs || lastContext.needs.length === 0) hints.push('nhu cầu (game/camera/pin)');

  return `Mình tư vấn tự nhiên theo kiểu mua thật luôn nha 😄 Bạn bổ sung giúp mình ${hints.join(', ')} là mình chốt mẫu chuẩn hơn.`;
}

function mergeContext(lastContext = {}, current = {}) {
  return {
    brand: current.brand || lastContext.brand || null,
    budget: current.budget || lastContext.budget || null,
    needs: current.needs?.length ? current.needs : lastContext.needs || []
  };
}

function buildChatReply(rawMessage, products, lastContext = {}) {
  const message = normalizeText(String(rawMessage || '').trim());
  const { intent, faqIntent, budget, brand, needs, models } = detectIntent(message, products);

  let reply =
    'Mình chưa bắt đúng ý lắm. Bạn thử nói kiểu: “dưới 12 triệu”, “iphone chụp đẹp”, hoặc “máy game tầm 15 củ” nhé.';

  const context = mergeContext(lastContext, { budget, brand, needs });

  if (intent === 'empty') {
    reply = 'Bạn cứ nói nhu cầu tự nhiên nha, ví dụ: “mình cần máy pin trâu tầm 10 triệu”.';
  } else if (intent === 'greeting') {
    reply = 'Hello bạn 👋 Mình tư vấn nhanh theo ngân sách + hãng + nhu cầu. Bạn đang muốn mua tầm bao nhiêu tiền?';
  } else if (intent === 'faq') {
    reply = FAQ_RESPONSES[faqIntent];
  } else if (intent === 'comparison') {
    reply = buildComparisonReply(models, context);
  } else if (intent === 'consultation') {
    reply = buildConsultationResult(products, {
      budget: context.budget,
      brand: context.brand,
      needs: context.needs || []
    });
  } else if (intent === 'clarify') {
    reply = buildClarifyReply(context);
  }

  return { reply, intent, source: 'db-rule-v3', context };
}

module.exports = { buildChatReply };
