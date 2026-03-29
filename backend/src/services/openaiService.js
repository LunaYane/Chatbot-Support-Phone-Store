const { openaiClient, openaiModel } = require('../config/openai');

/**
 * Tạo system prompt để AI trả lời đúng vai trò chatbot bán điện thoại.
 */
function buildSystemPrompt() {
  return `Bạn là chatbot tư vấn bán điện thoại cho website.
Yêu cầu trả lời:
- Ngắn gọn, thân thiện, dễ hiểu.
- Ưu tiên tư vấn sản phẩm từ dữ liệu được cung cấp.
- Không bịa thông tin ngoài dữ liệu.
- Nếu không có sản phẩm phù hợp, hãy nói rõ và gợi ý khách nới điều kiện.`;
}

/**
 * Tạo user prompt từ dữ liệu thực tế của backend.
 */
function buildUserPrompt({ userMessage, products, faqAnswer }) {
  const productContext = (products || [])
    .map(function (product, index) {
      return `${index + 1}. ${product.name} | hãng: ${product.brand} | giá: ${product.price} | RAM: ${product.ram}GB | ROM: ${product.rom}GB | pin: ${product.battery}mAh | camera: ${product.camera}MP | tags: ${(product.tags || []).join(', ')}`;
    })
    .join('\n');

  return `Câu hỏi của khách: ${userMessage}

FAQ liên quan:
${faqAnswer || 'Không có FAQ phù hợp'}

Sản phẩm tìm được trong database:
${productContext || 'Không có sản phẩm phù hợp'}

Hãy trả lời khách bằng tiếng Việt.`;
}

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

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt({ userMessage, products, faqAnswer });

  const completion = await openaiClient.chat.completions.create({
    model: openaiModel,
    temperature: 0.4,
    max_tokens: 220,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  return completion.choices[0].message.content;
}

module.exports = {
  generateNaturalReply,
  buildSystemPrompt,
  buildUserPrompt
};
