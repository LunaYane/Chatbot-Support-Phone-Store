const OpenAI = require('openai');

/**
 * Cấu hình OpenAI client dùng chung cho toàn backend.
 * API key được đọc từ biến môi trường OPENAI_API_KEY.
 */
const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

module.exports = {
  openaiClient,
  openaiModel
};
