import ProductCard from './ProductCard';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser ? 'bg-blue-600 text-white' : 'bg-white text-slate-800'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>

        {!isUser && Array.isArray(message.products) && message.products.length > 0 && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {message.products.map((product) => (
              <ProductCard key={product._id || product.name} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
