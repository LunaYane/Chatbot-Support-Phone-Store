const mongoose = require('mongoose');

/**
 * Model ChatLog dùng để lưu lịch sử hội thoại.
 */
const chatLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: [true, 'sessionId là bắt buộc']
    },
    userMessage: {
      type: String,
      required: [true, 'Tin nhắn của người dùng là bắt buộc']
    },
    botReply: {
      type: String,
      required: [true, 'Phản hồi của chatbot là bắt buộc']
    },
    detectedIntent: {
      type: String,
      default: 'general'
    },
    suggestedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        name: String,
        price: Number,
        imageUrl: String
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('ChatLog', chatLogSchema);
