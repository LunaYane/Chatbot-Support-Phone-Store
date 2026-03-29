const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Gọi API /api/chat từ frontend.
 * Dữ liệu gửi lên:
 * - sessionId: mã phiên chat
 * - message: nội dung người dùng nhập
 */
export async function sendChatMessage({ sessionId, message }) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sessionId, message })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Không thể gửi tin nhắn đến chatbot');
  }

  return data;
}
