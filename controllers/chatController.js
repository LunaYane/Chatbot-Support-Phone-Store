const asyncHandler = require('../middlewares/asyncHandler');
const { buildChatReply } = require('../services/chatService');
const { listPhones } = require('../services/phoneService');

const conversationState = new Map();

function resolveConversationKey(req) {
  const userId = req.user?.id || String(req.body?.userId || '').trim();
  if (userId) return `user:${userId}`;

  const sessionId = String(req.body?.sessionId || '').trim();
  if (sessionId) return `session:${sessionId}`;

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'anon');
  return `ip:${ip}`;
}

const chat = asyncHandler(async (req, res) => {
  const message = String(req.body?.message || '').trim();
  const data = await listPhones({ page: 1, limit: 200, sort: 'price_asc' });

  const key = resolveConversationKey(req);
  const lastContext = conversationState.get(key) || {};

  const replyPayload = buildChatReply(message, data.items || [], lastContext);

  if (replyPayload.context) {
    conversationState.set(key, replyPayload.context);
  }

  return res.json(replyPayload);
});

module.exports = {
  chat
};
