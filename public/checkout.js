const AUTH_STORAGE_KEY = 'phoneStoreAuth';
let checkoutUser = null;

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 220);
  }, 2200);
}

function getAuthState() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function authHeaders() {
  const state = getAuthState();
  if (!state?.token) return {};
  return { Authorization: `Bearer ${state.token}` };
}

async function ensureCheckoutAuth() {
  const statusEl = document.getElementById('checkout-auth-status');
  const formEl = document.getElementById('checkout-form');
  const state = getAuthState();

  if (!state?.token) {
    checkoutUser = null;
    if (statusEl) {
      statusEl.innerHTML = 'Bạn cần đăng nhập để thanh toán. <a class="back-link" href="/">Về trang chủ để đăng nhập</a>';
    }
    if (formEl) {
      formEl.querySelectorAll('input, textarea, button').forEach((el) => {
        el.disabled = true;
      });
    }
    return false;
  }

  try {
    const response = await fetch('/api/auth/me', { headers: authHeaders() });
    if (!response.ok) throw new Error('unauth');

    const data = await response.json();
    checkoutUser = data.user;

    if (statusEl) {
      statusEl.textContent = `Đang thanh toán với tài khoản: ${checkoutUser.fullName} (${checkoutUser.email})`;
    }

    if (formEl) {
      formEl.querySelectorAll('input, textarea, button').forEach((el) => {
        el.disabled = false;
      });
    }

    const nameInput = document.getElementById('customer-name');
    if (nameInput && !nameInput.value.trim()) {
      nameInput.value = checkoutUser.fullName || '';
    }

    return true;
  } catch (error) {
    checkoutUser = null;
    if (statusEl) {
      statusEl.innerHTML = 'Phiên đăng nhập đã hết hạn. <a class="back-link" href="/">Về trang chủ đăng nhập lại</a>';
    }
    if (formEl) {
      formEl.querySelectorAll('input, textarea, button').forEach((el) => {
        el.disabled = true;
      });
    }
    return false;
  }
}

function renderSummary() {
  const totals = window.CartStore.cartTotals();
  document.getElementById('sum-subtotal').textContent = formatPrice(totals.subtotal);
  document.getElementById('sum-shipping').textContent = formatPrice(totals.shipping);
  document.getElementById('sum-total').textContent = formatPrice(totals.total);
}

function renderCheckoutItems() {
  const cart = window.CartStore.readCart();
  const tableBody = document.getElementById('checkout-items');
  const emptyState = document.getElementById('checkout-empty');

  if (!cart.length) {
    tableBody.innerHTML = '';
    emptyState.classList.remove('hidden');
    renderSummary();
    return;
  }

  emptyState.classList.add('hidden');
  tableBody.innerHTML = cart
    .map((item) => {
      const subtotal = Number(item.price) * Number(item.quantity);
      return `
        <tr>
          <td>
            <div class="checkout-product">
              <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='/images/phone-placeholder.svg';" />
              <div>
                <strong>${item.name}</strong>
                <p>${item.brand}</p>
              </div>
            </div>
          </td>
          <td>${formatPrice(item.price)}</td>
          <td>
            <div class="qty-box">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
          </td>
          <td>${formatPrice(subtotal)}</td>
          <td><button class="btn-small btn-delete" data-action="remove" data-id="${item.id}">Xóa</button></td>
        </tr>
      `;
    })
    .join('');

  renderSummary();
}

document.getElementById('checkout-items').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  const cart = window.CartStore.readCart();
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  if (action === 'plus') window.CartStore.updateQuantity(id, Number(item.quantity) + 1);
  if (action === 'minus') window.CartStore.updateQuantity(id, Number(item.quantity) - 1);
  if (action === 'remove') window.CartStore.removeFromCart(id);

  renderCheckoutItems();
});

document.getElementById('checkout-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const isAuthed = await ensureCheckoutAuth();
  if (!isAuthed) {
    showToast('Bạn cần đăng nhập trước khi thanh toán.');
    return;
  }

  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const address = document.getElementById('customer-address').value.trim();
  const cart = window.CartStore.readCart();

  if (!name || !phone || !address) {
    showToast('Vui lòng nhập đầy đủ thông tin nhận hàng.');
    return;
  }

  if (!/^0\d{9,10}$/.test(phone)) {
    showToast('Số điện thoại chưa đúng định dạng.');
    return;
  }

  if (!cart.length) {
    showToast('Giỏ hàng đang trống, chưa thể đặt hàng.');
    return;
  }

  window.CartStore.clearCart();
  renderCheckoutItems();
  event.target.reset();
  showToast('Đặt hàng demo thành công! Cảm ơn bạn đã mua sắm.');
});

renderCheckoutItems();
ensureCheckoutAuth();
if (window.CartStore) window.CartStore.refreshCartBadge();
