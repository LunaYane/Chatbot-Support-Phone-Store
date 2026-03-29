const OpenAI = require('openai');

// Tạo client OpenAI nếu có API key
const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Tạo câu trả lời tự nhiên bằng OpenAI.
 */
async function generateNaturalReply({ userMessage, products, faqAnswer }) {
  // Fallback nếu chưa có API key
  if (!openaiClient) {
    if (faqAnswer) {
      return faqAnswer;
    }

    if (!products || products.length === 0) {
      return 'Mình chưa tìm thấy sản phẩm phù hợp. Bạn có thể nói rõ thêm mức giá hoặc nhu cầu (gaming/camera/pin/học tập) để mình tư vấn tốt hơn.';
    }

    const productLines = products
      .slice(0, 3)
      .map(function (product, index) {
        return `${index + 1}. ${product.name} - ${product.price.toLocaleString('vi-VN')}đ`;
      })
      .join('\n');

    return `Mình gợi ý cho bạn các mẫu sau:\n${productLines}\nBạn muốn mình so sánh chi tiết 2-3 mẫu này không?`;
  }

  const productContext = (products || [])
    .map(function (product, index) {
      return `${index + 1}. ${product.name} | hãng: ${product.brand} | giá: ${product.price} | RAM: ${product.ram}GB | ROM: ${product.rom}GB | pin: ${product.battery}mAh | camera: ${product.camera}MP | tags: ${(product.tags || []).join(', ')}`;
    })
    .join('\n');

  const systemPrompt = `Bạn là trợ lý tư vấn bán điện thoại bằng tiếng Việt.
- Trả lời ngắn gọn, tự nhiên, dễ hiểu.
- Chỉ dùng dữ liệu sản phẩm/FAQ được cung cấp.
- Không bịa thông số kỹ thuật.`;

  const userPrompt = `Câu hỏi khách hàng: ${userMessage}

FAQ liên quan (nếu có): ${faqAnswer || 'Không có FAQ phù hợp'}

Sản phẩm phù hợp:
${productContext || 'Không có sản phẩm phù hợp'}

Hãy trả lời tư vấn cho khách hàng.`;

  const completion = await openaiClient.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.5,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  return completion.choices[0].message.content;
}

module.exports = {
  generateNaturalReply
};
