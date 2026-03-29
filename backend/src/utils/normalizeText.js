/**
 * Chuẩn hóa tiếng Việt:
 * - chuyển về chữ thường
 * - bỏ dấu
 * - bỏ ký tự đặc biệt
 */
function normalizeText(inputText) {
  return String(inputText || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = {
  normalizeText
};
