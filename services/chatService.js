const { normalizeText } = require('../utils/recommendation');

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
  vivo: ['vivo'],
  Google: ['google', 'pixel']
};

const NEED_KEYWORDS = {
  gaming: ['choi game', 'gaming', 'pubg', 'lien quan', 'fps'],
  camera: ['chup anh', 'camera dep', 'camera', 'selfie', 'quay phim'],
  battery: ['pin trau', 'pin lau', 'dung lau', 'battery', 'it sac'],
  student: ['hoc tap', 'sinh vien', 'co ban', 'van phong', 'gia re']
};

const UNDER_BUDGET_KEYWORDS = ['duoi', 'toi da', 'khong qua', 'it hon', 'under', 'max'];
const AROUND_BUDGET_KEYWORDS = ['tam', 'khoang', 'gan', 'around'];

function formatPriceVND(amount) {
  return `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;
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
  const millionMatch = message.match(/(\d+[\.,]?\d*)\s*(tr|trieu|m|million)/);
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

  const spread = Math.max(1000000, Math.round(value * 0.2));
  return {
    type: isAround ? 'around' : 'around',
    min: Math.max(0, value - spread),
    max: value + spread,
    text: `khoảng ${formatPriceVND(value)}`
  };
}

function detectIntent(message) {
  if (!message) return { intent: 'empty' };

  const faqIntent = detectFaqIntent(message);
  if (faqIntent) return { intent: 'faq', faqIntent };

  if (['xin chao', 'hello', 'hi', 'chao'].includes(message) || message.includes('xin chao')) {
    return { intent: 'greeting' };
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
  return false;
}

function needDisplayText(need) {
  const map = { gaming: 'chơi game', camera: 'chụp ảnh đẹp', battery: 'pin khỏe', student: 'học tập / sinh viên' };
  return map[need] || need;
}

function scoreProduct(phone, filters) {
  const { budget, brand, needs } = filters;
  let score = 0;

  if (brand && normalizeText(phone.brand) === normalizeText(brand)) score += 35;

  if (budget) {
    if (budget.type === 'under') {
      if (phone.price <= budget.max) score += 30;
      else score -= 40;
    } else {
      const center = Math.round((budget.min + budget.max) / 2);
      const distance = Math.abs(phone.price - center);
      if (phone.price >= budget.min && phone.price <= budget.max) score += 25;
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

function buildConsultationResult(products, filters) {
  const { budget, brand, needs } = filters;

  let candidates = brand
    ? products.filter((product) => normalizeText(product.brand) === normalizeText(brand))
    : products;

  if (budget?.type === 'under') {
    const underBudgetList = candidates.filter((product) => Number(product.price) <= Number(budget.max));
    if (underBudgetList.length > 0) {
      candidates = underBudgetList;
    }
  }

  const scored = candidates
    .map((product) => ({ ...product, score: scoreProduct(product, filters) }))
    .filter((product) => product.score > -20)
    .sort((a, b) => b.score - a.score || a.price - b.price)
    .slice(0, 3);

  if (!scored.length || scored[0].score < 5) {
    return 'Xin lỗi bạn, hiện chưa có mẫu thật sự phù hợp. Bạn thử tăng nhẹ ngân sách hoặc đổi hãng để mình gợi ý tốt hơn nhé.';
  }

  const conditions = [];
  if (budget) conditions.push(budget.text);
  if (brand) conditions.push(`hãng ${brand}`);
  if (needs.length) conditions.push(`nhu cầu ${needs.map(needDisplayText).join(', ')}`);

  const intro = conditions.length
    ? `Mình gợi ý top 3 mẫu hợp với ${conditions.join(' + ')}:`
    : 'Mình gợi ý 3 mẫu nổi bật cho bạn:';

  const lines = scored.map((p, i) => `${i + 1}. ${p.name} (${p.brand}) - ${formatPriceVND(p.price)}`);
  return `${intro}\n${lines.join('\n')}\nBạn muốn mình lọc sâu hơn theo pin/camera hay hãng cụ thể không?`;
}

function buildClarifyReply() {
  return 'Mình có thể tư vấn theo ngân sách, hãng và nhu cầu. Ví dụ: "iphone dưới 20 triệu" hoặc "Samsung pin khỏe".';
}

function buildChatReply(rawMessage, products) {
  const message = normalizeText(String(rawMessage || '').trim());
  const { intent, faqIntent, budget, brand, needs } = detectIntent(message);

  let reply =
    'Mình chưa hiểu rõ lắm. Bạn thử nói theo dạng: dưới 7 triệu, hãng Samsung, hoặc nhu cầu chụp ảnh/pin khỏe nhé.';

  if (intent === 'empty') {
    reply = 'Bạn mô tả nhu cầu giúp mình nhé. Ví dụ: dưới 10 triệu, pin khỏe, hoặc muốn iPhone.';
  } else if (intent === 'greeting') {
    reply = 'Chào bạn 👋 Mình có thể tư vấn theo ngân sách, hãng và nhu cầu sử dụng. Bạn đang muốn tìm máy khoảng bao nhiêu tiền?';
  } else if (intent === 'faq') {
    reply = FAQ_RESPONSES[faqIntent];
  } else if (intent === 'consultation') {
    reply = buildConsultationResult(products, { budget, brand, needs: needs || [] });
  } else if (intent === 'clarify') {
    reply = buildClarifyReply();
  }

  return { reply, intent, source: 'db-rule' };
}

module.exports = { buildChatReply };
