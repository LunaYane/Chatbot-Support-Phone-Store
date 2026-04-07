const chatbox = document.getElementById('chatbox');
const chatCloseBtn = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

const supportWidget = document.getElementById('floating-support');
const supportOpenChatBtn = document.getElementById('support-open-chat');
const chatToggleBtn = document.getElementById('chat-toggle');

if (chatbox && chatCloseBtn && chatForm && chatInput && chatMessages) {
  function addMessage(text, role) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${role}`;
    messageEl.textContent = text;

    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function openSupportChat() {
    chatbox.classList.remove('hidden');
    if (supportWidget) supportWidget.classList.add('hidden');
    chatInput.focus();
  }

  function closeSupportChat() {
    chatbox.classList.add('hidden');
    if (supportWidget) supportWidget.classList.remove('hidden');
  }

  window.openSupportChat = openSupportChat;

  supportOpenChatBtn?.addEventListener('click', openSupportChat);
  chatToggleBtn?.addEventListener('click', openSupportChat);
  chatCloseBtn.addEventListener('click', closeSupportChat);

  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = chatInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput.value = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      addMessage(data.reply || 'Xin lỗi, hiện tại mình chưa thể phản hồi.', 'bot');
    } catch (error) {
      addMessage('Lỗi kết nối, vui lòng thử lại sau.', 'bot');
    }
  });
}
