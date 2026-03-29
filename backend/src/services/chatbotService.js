const Product = require('../models/Product');
const Faq = require('../models/Faq');
const { normalizeText } = require('../utils/normalizeText');
const { generateNaturalReply } = require('./openaiService');

/**
 * 1) Phân tích tin nhắn user để lấy intent + bộ lọc.
 */
function analyzeUserMessage(userMessage) {
  const normalizedMessage = normalizeText(userMessage);

  let detectedIntent = 'general';
  const filters = { inStock: true };
  const requiredTags = [];

  // Detect keyword theo nhu cầu
  if (
    normalizedMessage.includes('choi game') ||
    normalizedMessage.includes('gaming') ||
    normalizedMessage.includes('game')
  ) {
    detectedIntent = 'gaming';
    requiredTags.push('gaming');
    filters.ram = { $gte: 8 };
  }

  if (
    normalizedMessage.includes('camera') ||
    normalizedMessage.includes('chup anh') ||
    normalizedMessage.includes('song ao')
  ) {
    detectedIntent = 'camera';
    requiredTags.push('camera');
    filters.camera = { $gte: 50 };
  }

  if (
    normalizedMessage.includes('pin trau') ||
    normalizedMessage.includes('pin') ||
    normalizedMessage.includes('thoi luong pin')
  ) {
    detectedIntent = 'battery';
    requiredTags.push('pin-trau');
    filters.battery = { $gte: 5000 };
  }

  if (
    normalizedMessage.includes('hoc tap') ||
    normalizedMessage.includes('hoc online') ||
    normalizedMessage.includes('sinh vien')
  ) {
    detectedIntent = 'study';
    requiredTags.push('hoc-tap');
  }

  // Detect mức giá: "duoi 10 trieu"
  const underPriceMatch = normalizedMessage.match(/duoi\s*(\d+)\s*(trieu)?/);
  if (underPriceMatch) {
    const maxMillion = Number(underPriceMatch[1]);
    filters.price = { $lte: maxMillion * 1000000 };
    detectedIntent = 'price';
  }

  // Detect khoảng giá: "tu 10 den 15 trieu"
  const rangePriceMatch = normalizedMessage.match(/tu\s*(\d+)\s*den\s*(\d+)\s*(trieu)?/);
  if (rangePriceMatch) {
    const minMillion = Number(rangePriceMatch[1]);
    const maxMillion = Number(rangePriceMatch[2]);
    filters.price = {
      $gte: minMillion * 1000000,
      $lte: maxMillion * 1000000
    };
    detectedIntent = 'price';
  }

  // Detect nhóm FAQ cơ bản
  const faqKeywords = [
    'bao hanh',
    'van chuyen',
    'giao hang',
    'tra gop',
    'doi tra',
    'thanh toan',
    'cod'
  ];

  const isFaqQuestion = faqKeywords.some(function (keyword) {
    return normalizedMessage.includes(keyword);
  });

  if (isFaqQuestion) {
    detectedIntent = 'faq';
  }

  return {
    normalizedMessage,
    detectedIntent,
    filters,
    requiredTags,
    isFaqQuestion
  };
}

/**
 * 2) Tìm FAQ phù hợp nhất trong database.
 */
async function findFaqAnswer(normalizedMessage) {
  const faqs = await Faq.find({ isActive: true }).lean();

  const matchedFaq = faqs.find(function (faqItem) {
    const keywords = faqItem.keywords || [];

    return keywords.some(function (keyword) {
      return normalizedMessage.includes(normalizeText(keyword));
    });
  });

  return matchedFaq ? matchedFaq.answer : null;
}

/**
 * 3) Query sản phẩm phù hợp theo filter + tags.
 */
async function findMatchingProducts({ filters, requiredTags }) {
  let query = Product.find(filters);

  if (requiredTags.length > 0) {
    query = query.where('tags').in(requiredTags);
  }

  const products = await query
    .sort({ price: 1, ram: -1, battery: -1 })
    .limit(5)
    .lean();

  return products;
}

/**
 * 4) Hàm chính xử lý chatbot.
 */
async function processChat(userMessage) {
  const analyzed = analyzeUserMessage(userMessage);

  // Nếu là câu FAQ thì ưu tiên trả lời FAQ
  const faqAnswer = analyzed.isFaqQuestion
    ? await findFaqAnswer(analyzed.normalizedMessage)
    : null;

  // Vẫn lấy sản phẩm để có thể gợi ý thêm
  const products = await findMatchingProducts({
    filters: analyzed.filters,
    requiredTags: analyzed.requiredTags
  });

  const reply = await generateNaturalReply({
    userMessage,
    products,
    faqAnswer
  });

  return {
    reply,
    products,
    detectedIntent: analyzed.detectedIntent
  };
}

module.exports = {
  processChat,
  analyzeUserMessage
};
