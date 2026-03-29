const ChatLog = require('../models/ChatLog');
const { processChat } = require('../services/chatbotService');

/**
 * POST /api/chat
 * Controller chatbot chính:
 * - Nhận message từ user
 * - Phân tích intent
 * - Query sản phẩm / FAQ
 * - Tạo reply tự nhiên
 * - Lưu lịch sử chat
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

    const chatResult = await processChat(message);

    await ChatLog.create({
      sessionId,
      userMessage: message,
      botReply: chatResult.reply,
      detectedIntent: chatResult.detectedIntent,
      suggestedProducts: chatResult.products.map(function (product) {
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
      reply: chatResult.reply,
      products: chatResult.products,
      detectedIntent: chatResult.detectedIntent
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
