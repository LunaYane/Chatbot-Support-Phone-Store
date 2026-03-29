const Faq = require('../models/Faq');

/**
 * GET /api/faqs
 * Lấy danh sách FAQ.
 */
async function getFaqs(request, response) {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ createdAt: -1 }).lean();

    response.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách FAQ',
      error: error.message
    });
  }
}

/**
 * POST /api/faqs
 * Tạo FAQ mới (controller cơ bản).
 */
async function createFaq(request, response) {
  try {
    const newFaq = await Faq.create(request.body);

    response.status(201).json({
      success: true,
      data: newFaq
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: 'Không thể tạo FAQ',
      error: error.message
    });
  }
}

module.exports = {
  getFaqs,
  createFaq
};
