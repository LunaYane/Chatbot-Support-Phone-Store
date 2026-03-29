import { useMemo, useState } from 'react';
import MessageBubble from './components/MessageBubble';
import SuggestionButtons from './components/SuggestionButtons';
import ChatInput from './components/ChatInput';
import { sendChatMessage } from './services/chatApi';

function App() {
  // Session id đơn giản cho mỗi tab
  const sessionId = useMemo(() => `session-${Date.now()}`, []);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: 'Xin chào 👋 Mình là chatbot tư vấn điện thoại. Bạn muốn tìm máy theo giá, gaming, camera hay pin trâu?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (messageText) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: messageText
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setIsLoading(true);

    try {
      const result = await sendChatMessage({
        sessionId,
        message: messageText
      });

      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        text: result.reply || 'Mình chưa có phản hồi phù hợp.',
        products: result.products || []
      };

      setMessages((previousMessages) => [...previousMessages, botMessage]);
    } catch (error) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 2,
          role: 'bot',
          text: 'Xin lỗi, hiện tại hệ thống đang lỗi kết nối API. Bạn thử lại sau nhé.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Chatbot hỗ trợ bán điện thoại</h1>
          <p className="mt-1 text-sm text-slate-500">React + Tailwind • Demo tư vấn sản phẩm theo nhu cầu</p>
        </div>

        <div className="mb-4 rounded-2xl bg-white p-4 shadow">
          <SuggestionButtons onClickSuggestion={handleSendMessage} />
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 shadow-inner">
          <div className="mb-4 h-[460px] overflow-y-auto rounded-xl border border-slate-200 bg-slate-100 p-4">
            {messages.map((messageItem) => (
              <MessageBubble key={messageItem.id} message={messageItem} />
            ))}

            {isLoading && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  Chatbot đang tư vấn...
                </div>
              </div>
            )}
          </div>

          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
