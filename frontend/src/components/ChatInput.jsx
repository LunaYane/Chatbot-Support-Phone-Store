import { useState } from 'react';

function ChatInput({ onSendMessage, isLoading }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedValue = inputValue.trim();
    if (!trimmedValue || isLoading) {
      return;
    }

    onSendMessage(trimmedValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        placeholder="Nhập câu hỏi về điện thoại..."
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Gửi
      </button>
    </form>
  );
}

export default ChatInput;
