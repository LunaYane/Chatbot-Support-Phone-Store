const CART_STORAGE_KEY = 'phoneStoreCart';

function readCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.id);
  } catch (error) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  refreshCartBadge();
}

function refreshCartBadge() {
  const cart = readCart();
  const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = String(count);
}

function addToCart(phone, quantity = 1) {
  const cart = readCart();
  const found = cart.find((item) => item.id === phone.id);

  if (found) {
    found.quantity += quantity;
  } else {
    cart.push({
      id: phone.id,
      name: phone.name,
      brand: phone.brand,
      price: phone.price,
      image: phone.image,
      quantity
    });
  }

  writeCart(cart);
}

function updateQuantity(id, quantity) {
  const cart = readCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  if (quantity <= 0) {
    const next = cart.filter((entry) => entry.id !== id);
    writeCart(next);
    return;
  }

  item.quantity = quantity;
  writeCart(cart);
}

function removeFromCart(id) {
  const cart = readCart().filter((item) => item.id !== id);
  writeCart(cart);
}

function clearCart() {
  writeCart([]);
}

function cartTotals() {
  const cart = readCart();
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const shipping = subtotal > 0 ? 30000 : 0;
  const total = subtotal + shipping;
  return { subtotal, shipping, total };
}

window.CartStore = {
  readCart,
  writeCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  cartTotals,
  refreshCartBadge
};

document.addEventListener('DOMContentLoaded', refreshCartBadge);
