const ChatLog = require('../models/ChatLog');
const Product = require('../models/Product');
const Faq = require('../models/Faq');

/**
 * POST /api/chat
 * Controller cơ bản cho chatbot:
 * - Nhận message từ user
 * - Trả lời mẫu
 * - Gợi ý sản phẩm cơ bản
 * - Lưu chat log
 */
async function chatWithBot(request, response) {
  try {
    const { sessionId, message } = request.body;

    if (!sessionId || !message) {
      return response.status(400).json({
        success: false,
        message: 'sessionId và message là bắt buộc'
      });
    }

    // Lấy 3 sản phẩm đầu để gợi ý cơ bản
    const suggestedProducts = await Product.find({ inStock: true })
      .sort({ price: 1 })
      .limit(3)
      .lean();

    // Lấy 1 FAQ bất kỳ để làm câu trả lời tham khảo cơ bản
    const faq = await Faq.findOne({ isActive: true }).lean();

    const basicReply = faq
      ? `Mình đã nhận câu hỏi: "${message}". Bạn có thể tham khảo thêm: ${faq.answer}`
      : `Mình đã nhận câu hỏi: "${message}". Mình sẽ tư vấn điện thoại phù hợp cho bạn nhé!`;

    await ChatLog.create({
      sessionId,
      userMessage: message,
      botReply: basicReply,
      detectedIntent: 'general',
      suggestedProducts: suggestedProducts.map(function (product) {
        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        };
      })
    });

    return response.status(200).json({
      success: true,
      data: {
        reply: basicReply,
        intent: 'general',
        suggestedProducts
      }
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Lỗi khi xử lý chatbot',
      error: error.message
    });
  }
}

module.exports = {
  chatWithBot
};
