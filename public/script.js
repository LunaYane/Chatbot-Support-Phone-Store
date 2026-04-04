const PAGE_SIZE = 12;
const AUTH_STORAGE_KEY = 'phoneStoreAuth';
let selectedCategory = '';
let currentPage = 1;
let authMode = 'login';

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

function setAuthState(data) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

function clearAuthState() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function authHeaders() {
  const state = getAuthState();
  if (!state?.token) return {};
  return { Authorization: `Bearer ${state.token}` };
}

async function verifyAuthSession() {
  const state = getAuthState();
  if (!state?.token) {
    renderAuthActions(null);
    return;
  }

  try {
    const response = await fetch('/api/auth/me', { headers: authHeaders() });
    if (!response.ok) throw new Error('unauth');
    const data = await response.json();
    setAuthState({ token: state.token, user: data.user });
    renderAuthActions(data.user);
  } catch (error) {
    clearAuthState();
    renderAuthActions(null);
  }
}

function renderAuthActions(user) {
  const loginBtn = document.getElementById('open-login-btn');
  const registerBtn = document.getElementById('open-register-btn');
  const logoutBtn = document.getElementById('logout-auth-btn');

  if (!loginBtn || !registerBtn || !logoutBtn) return;

  if (user) {
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    logoutBtn.textContent = `Đăng xuất (${user.fullName.split(' ')[0]})`;
  } else {
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
}

function openAuthModal(mode = 'login') {
  authMode = mode;
  const modal = document.getElementById('auth-modal');
  const title = document.getElementById('auth-modal-title');
  const submit = document.getElementById('auth-submit-btn');
  const fullWrap = document.getElementById('auth-fullname-wrap');
  const phoneWrap = document.getElementById('auth-phone-wrap');

  if (!modal || !title || !submit || !fullWrap || !phoneWrap) return;

  const isRegister = mode === 'register';
  title.textContent = isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập';
  submit.textContent = isRegister ? 'Tạo tài khoản' : 'Đăng nhập';
  fullWrap.classList.toggle('hidden', !isRegister);
  phoneWrap.classList.toggle('hidden', !isRegister);
  modal.classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal')?.classList.add('hidden');
  document.getElementById('auth-form')?.reset();
}

async function submitAuthForm(event) {
  event.preventDefault();

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();

  const payload =
    authMode === 'register'
      ? {
          fullName: document.getElementById('auth-fullname').value.trim(),
          email,
          phone: document.getElementById('auth-phone').value.trim(),
          password
        }
      : { email, password };

  try {
    const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Auth failed');

    setAuthState({ token: data.token, user: data.user });
    renderAuthActions(data.user);
    closeAuthModal();
    showToast(authMode === 'register' ? 'Đăng ký thành công!' : 'Đăng nhập thành công!');
  } catch (error) {
    showToast(error.message || 'Không thể xác thực lúc này.');
  }
}

async function logoutAuth() {
  clearAuthState();
  renderAuthActions(null);
  showToast('Đã đăng xuất.');
}

function createPhoneCard(phone) {
  return `
    <article class="phone-card">
      <a class="phone-link" href="/product/${phone.id}">
        <img class="phone-image" src="${phone.image}" alt="${phone.name}" />
        <div class="phone-content">
          <div class="brand">${phone.brand}</div>
          <h3 class="phone-name">${phone.name}</h3>
          <p class="phone-desc">${phone.shortDescription || phone.description || ''}</p>
          <div class="phone-price">${formatPrice(phone.price)}</div>
        </div>
      </a>
      <div class="phone-actions">
        <button type="button" class="btn-primary add-cart-btn" data-id="${phone.id}">Thêm giỏ hàng</button>
      </div>
    </article>
  `;
}

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.category) params.set('category', filters.category);
  if (filters.sort) params.set('sort', filters.sort);
  params.set('page', String(filters.page || 1));
  params.set('limit', String(PAGE_SIZE));

  return `?${params.toString()}`;
}

function getFilters() {
  return {
    search: document.getElementById('search-input').value.trim(),
    brand: document.getElementById('brand-filter').value,
    minPrice: document.getElementById('min-price').value,
    maxPrice: document.getElementById('max-price').value,
    category: selectedCategory,
    sort: document.getElementById('sort-filter').value,
    page: currentPage
  };
}

function renderResultCount(total, page, totalPages) {
  const resultCountEl = document.getElementById('result-count');
  resultCountEl.textContent = `Tìm thấy ${total} sản phẩm • Trang ${page}/${Math.max(1, totalPages)}`;
}

function renderPagination(page, totalPages) {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl) return;

  if (totalPages <= 1) {
    paginationEl.innerHTML = '';
    return;
  }

  const buttons = [];
  buttons.push(`<button class="page-btn" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹</button>`);

  const from = Math.max(1, page - 2);
  const to = Math.min(totalPages, page + 2);
  for (let p = from; p <= to; p += 1) {
    buttons.push(`<button class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`);
  }

  buttons.push(`<button class="page-btn" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''}>›</button>`);
  paginationEl.innerHTML = buttons.join('');
}

let currentItems = [];

function renderPhones(data) {
  const phoneListEl = document.getElementById('phone-list');
  const { items = [], total = 0, page = 1, totalPages = 1 } = data || {};
  currentItems = items;

  if (!items.length) {
    phoneListEl.innerHTML = '<p class="empty-state">Không tìm thấy sản phẩm phù hợp bộ lọc hiện tại.</p>';
    renderResultCount(0, 1, 1);
    renderPagination(1, 1);
    return;
  }

  phoneListEl.innerHTML = items.map(createPhoneCard).join('');
  renderResultCount(total, page, totalPages);
  renderPagination(page, totalPages);
}

async function loadBrands() {
  const brandFilterEl = document.getElementById('brand-filter');

  try {
    const response = await fetch('/api/brands');
    const brands = await response.json();

    brandFilterEl.innerHTML = '<option value="">Tất cả hãng</option>';

    brands.forEach((brand) => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandFilterEl.appendChild(option);
    });
  } catch (error) {
    brandFilterEl.innerHTML = '<option value="">Tất cả hãng</option>';
  }
}

async function loadPhones() {
  const loadingStateEl = document.getElementById('loading-state');
  const phoneListEl = document.getElementById('phone-list');
  const filters = getFilters();
  const queryString = buildQueryString(filters);

  loadingStateEl.classList.remove('hidden');
  phoneListEl.innerHTML = '';

  try {
    const response = await fetch(`/api/phones${queryString}`);
    const data = await response.json();
    renderPhones(data);
  } catch (error) {
    phoneListEl.innerHTML = '<p class="empty-state">Không thể tải sản phẩm lúc này. Vui lòng thử lại sau.</p>';
  } finally {
    loadingStateEl.classList.add('hidden');
  }
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('brand-filter').value = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  document.getElementById('sort-filter').value = 'price_asc';
  selectedCategory = '';
  currentPage = 1;
  loadPhones();
}

function syncSearchFromTopBar() {
  const topSearchInput = document.getElementById('top-search-input');
  const mainSearchInput = document.getElementById('search-input');
  if (!topSearchInput || !mainSearchInput) return;

  mainSearchInput.value = topSearchInput.value.trim();
  currentPage = 1;
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  loadPhones();
}

function applyQuickCategoryQuery(query, category) {
  document.getElementById('search-input').value = (query || '').trim();
  document.getElementById('brand-filter').value = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  selectedCategory = category || '';
  currentPage = 1;

  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  loadPhones();
}

document.getElementById('apply-filters').addEventListener('click', () => {
  currentPage = 1;
  loadPhones();
});

document.getElementById('clear-filters').addEventListener('click', clearFilters);

document.getElementById('search-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    currentPage = 1;
    loadPhones();
  }
});

document.getElementById('sort-filter').addEventListener('change', () => {
  currentPage = 1;
  loadPhones();
});

const topSearchButton = document.getElementById('top-search-btn');
const topSearchInput = document.getElementById('top-search-input');
if (topSearchButton && topSearchInput) {
  topSearchButton.addEventListener('click', syncSearchFromTopBar);
  topSearchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') syncSearchFromTopBar();
  });
}

const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach((card) => {
  const query = card.dataset.query || '';
  const category = card.dataset.category || '';

  const trigger = () => applyQuickCategoryQuery(query, category);
  card.addEventListener('click', trigger);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      trigger();
    }
  });

  const actionBtn = card.querySelector('.category-action');
  if (actionBtn) {
    actionBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      trigger();
    });
  }
});

document.getElementById('pagination').addEventListener('click', (event) => {
  const button = event.target.closest('.page-btn');
  if (!button || button.disabled) return;

  currentPage = Number(button.dataset.page) || 1;
  loadPhones();
});

document.getElementById('phone-list').addEventListener('click', (event) => {
  const button = event.target.closest('.add-cart-btn');
  if (!button) return;

  const id = Number(button.dataset.id);
  const phone = currentItems.find((item) => item.id === id);
  if (!phone || !window.CartStore) return;

  window.CartStore.addToCart(phone, 1);
  showToast(`Đã thêm ${phone.name} vào giỏ hàng`);
});

function openChatSupport() {
  if (typeof window.openSupportChat === 'function') {
    window.openSupportChat();
  }
}

document.getElementById('promo-view-btn')?.addEventListener('click', () => {
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('promo-chat-btn')?.addEventListener('click', openChatSupport);

document.getElementById('site-header')?.classList.remove('is-scrolled');
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (!header) return;
  if (window.scrollY > 8) header.classList.add('is-scrolled');
  else header.classList.remove('is-scrolled');
});

document.getElementById('open-login-btn')?.addEventListener('click', () => openAuthModal('login'));
document.getElementById('open-register-btn')?.addEventListener('click', () => openAuthModal('register'));
document.getElementById('close-auth-modal')?.addEventListener('click', closeAuthModal);
document.getElementById('auth-form')?.addEventListener('submit', submitAuthForm);
document.getElementById('logout-auth-btn')?.addEventListener('click', logoutAuth);
document.getElementById('auth-modal')?.addEventListener('click', (event) => {
  if (event.target.id === 'auth-modal') closeAuthModal();
});

verifyAuthSession();
loadBrands();
loadPhones();
if (window.CartStore) window.CartStore.refreshCartBadge();
