const chatToggleBtn = document.getElementById('chat-toggle');
const chatbox = document.getElementById('chatbox');
const chatCloseBtn = document.getElementById('chat-close');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

if (chatToggleBtn && chatbox && chatCloseBtn && chatForm && chatInput && chatMessages) {
  function addMessage(text, role) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${role}`;
    messageEl.textContent = text;

    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatToggleBtn.addEventListener('click', () => {
    chatbox.classList.remove('hidden');
    chatToggleBtn.classList.add('hidden');
    chatInput.focus();
  });

  chatCloseBtn.addEventListener('click', () => {
    chatbox.classList.add('hidden');
    chatToggleBtn.classList.remove('hidden');
  });

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
      addMessage(data.reply || 'Sorry, I cannot reply right now.', 'bot');
    } catch (error) {
      addMessage('Connection error. Please try again later.', 'bot');
    }
  });
}
