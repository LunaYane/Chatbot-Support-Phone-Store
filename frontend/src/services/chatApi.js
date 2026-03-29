const API_BASE_URL = 'http://localhost:5000';

/**
 * Gọi API /api/chat từ frontend.
 */
export async function sendChatMessage({ sessionId, message }) {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sessionId, message })
  });

  if (!response.ok) {
    throw new Error('Không thể gửi tin nhắn đến chatbot');
  }

  return response.json();
}
