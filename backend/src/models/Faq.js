const mongoose = require('mongoose');

/**
 * Model FAQ dùng để lưu câu hỏi thường gặp.
 */
const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Câu hỏi là bắt buộc'],
      trim: true
    },
    answer: {
      type: String,
      required: [true, 'Câu trả lời là bắt buộc'],
      trim: true
    },
    keywords: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      default: 'general',
      trim: true,
      lowercase: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Faq', faqSchema);
