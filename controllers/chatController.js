const asyncHandler = require('../middlewares/asyncHandler');
const { buildChatReply } = require('../services/chatService');
const { listPhones } = require('../services/phoneService');

const chat = asyncHandler(async (req, res) => {
  const message = String(req.body?.message || '').trim();
  const data = await listPhones({ page: 1, limit: 100, sort: 'price_asc' });
  const replyPayload = buildChatReply(message, data.items || []);
  return res.json(replyPayload);
});

module.exports = {
  chat
};
