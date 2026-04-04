const PAGE_SIZE = 12;
const AUTH_STORAGE_KEY = 'phoneStoreAuth';

let selectedCategory = '';
let currentPage = 1;
let authMode = 'login';
let allLoadedItems = [];
let currentItems = [];

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

function createPhoneCard(phone) {
  return `
    <article class="product-card">
      <img src="${phone.image}" alt="${phone.name}" class="product-image" onerror="this.onerror=null;this.src='/images/phone-placeholder.svg';" />
      <div class="product-content">
        <h4>${phone.name}</h4>
        <p class="brand">${phone.brand}</p>
        <div class="price">${formatPrice(phone.price)}</div>
      </div>
      <div class="product-actions">
        <a class="btn-secondary" href="/product/${phone.id}">View</a>
        <button type="button" class="btn-primary add-cart-btn" data-id="${phone.id}">Add</button>
      </div>
    </article>
  `;
}

function renderResultCount(total, page, totalPages) {
  const resultCountEl = document.getElementById('result-count');
  if (!resultCountEl) return;
  resultCountEl.textContent = `Found ${total} products • Page ${page}/${Math.max(1, totalPages)}`;
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

function renderTopArrival(items = []) {
  const wrap = document.getElementById('top-arrival-grid');
  if (!wrap) return;

  const top = [...items]
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 4)
    .map(createPhoneCard)
    .join('');

  wrap.innerHTML = top || '<p class="empty-state">No products</p>';
}

function renderRecommended(items = []) {
  const wrap = document.getElementById('recommended-grid');
  if (!wrap) return;

  const rec = [...items]
    .sort((a, b) => Number(a.price) - Number(b.price))
    .slice(0, 8)
    .map(createPhoneCard)
    .join('');

  wrap.innerHTML = rec || '<p class="empty-state">No products</p>';
}

function renderPhones(data) {
  const phoneListEl = document.getElementById('phone-list');
  const { items = [], total = 0, page = 1, totalPages = 1 } = data || {};
  currentItems = items;

  if (!items.length) {
    phoneListEl.innerHTML = '<p class="empty-state">No products found.</p>';
    renderResultCount(0, 1, 1);
    renderPagination(1, 1);
    return;
  }

  phoneListEl.innerHTML = items.map(createPhoneCard).join('');
  renderResultCount(total, page, totalPages);
  renderPagination(page, totalPages);
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
    search: document.getElementById('search-input')?.value.trim() || '',
    brand: document.getElementById('brand-filter')?.value || '',
    minPrice: document.getElementById('min-price')?.value || '',
    maxPrice: document.getElementById('max-price')?.value || '',
    category: selectedCategory,
    sort: document.getElementById('sort-filter')?.value || 'price_asc',
    page: currentPage
  };
}

async function loadBrands() {
  const brandFilterEl = document.getElementById('brand-filter');
  if (!brandFilterEl) return;

  try {
    const response = await fetch('/api/brands');
    const brands = await response.json();

    brandFilterEl.innerHTML = '<option value="">All brand</option>';
    brands.forEach((brand) => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandFilterEl.appendChild(option);
    });
  } catch (error) {
    brandFilterEl.innerHTML = '<option value="">All brand</option>';
  }
}

async function preloadAllItems() {
  try {
    const response = await fetch('/api/phones?page=1&limit=60&sort=price_asc');
    const data = await response.json();
    allLoadedItems = data.items || [];
    renderTopArrival(allLoadedItems);
    renderRecommended(allLoadedItems);
  } catch (error) {
    allLoadedItems = [];
  }
}

async function loadPhones() {
  const loadingStateEl = document.getElementById('loading-state');
  const phoneListEl = document.getElementById('phone-list');
  const filters = getFilters();
  const queryString = buildQueryString(filters);

  loadingStateEl?.classList.remove('hidden');
  if (phoneListEl) phoneListEl.innerHTML = '';

  try {
    const response = await fetch(`/api/phones${queryString}`);
    const data = await response.json();
    renderPhones(data);
  } catch (error) {
    if (phoneListEl) phoneListEl.innerHTML = '<p class="empty-state">Cannot load products right now.</p>';
  } finally {
    loadingStateEl?.classList.add('hidden');
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

function applySearchFromTop() {
  const topSearch = document.getElementById('top-search-input')?.value.trim() || '';
  document.getElementById('search-input').value = topSearch;
  currentPage = 1;
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  loadPhones();
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

function renderAuthActions(user) {
  const loginBtn = document.getElementById('open-login-btn');
  const logoutBtn = document.getElementById('logout-auth-btn');

  if (!loginBtn || !logoutBtn) return;
  if (user) {
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
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

  const payload =
    authMode === 'register'
      ? {
          fullName: document.getElementById('auth-fullname').value.trim(),
          email: document.getElementById('auth-email').value.trim(),
          phone: document.getElementById('auth-phone').value.trim(),
          password: document.getElementById('auth-password').value.trim()
        }
      : {
          email: document.getElementById('auth-email').value.trim(),
          password: document.getElementById('auth-password').value.trim()
        };

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

function logoutAuth() {
  clearAuthState();
  renderAuthActions(null);
  showToast('Đã đăng xuất.');
}

document.getElementById('top-search-btn')?.addEventListener('click', applySearchFromTop);
document.getElementById('top-search-input')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') applySearchFromTop();
});

document.getElementById('apply-filters')?.addEventListener('click', () => {
  currentPage = 1;
  loadPhones();
});

document.getElementById('clear-filters')?.addEventListener('click', clearFilters);

document.getElementById('sort-filter')?.addEventListener('change', () => {
  currentPage = 1;
  loadPhones();
});

document.getElementById('search-input')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    currentPage = 1;
    loadPhones();
  }
});

document.getElementById('pagination')?.addEventListener('click', (event) => {
  const button = event.target.closest('.page-btn');
  if (!button || button.disabled) return;
  currentPage = Number(button.dataset.page) || 1;
  loadPhones();
});

document.getElementById('phone-list')?.addEventListener('click', (event) => {
  const button = event.target.closest('.add-cart-btn');
  if (!button) return;
  const id = Number(button.dataset.id);
  const phone = currentItems.find((item) => item.id === id);
  if (!phone || !window.CartStore) return;

  window.CartStore.addToCart(phone, 1);
  showToast(`Đã thêm ${phone.name} vào giỏ hàng`);
});

document.getElementById('top-arrival-grid')?.addEventListener('click', (event) => {
  const button = event.target.closest('.add-cart-btn');
  if (!button) return;
  const id = Number(button.dataset.id);
  const phone = allLoadedItems.find((item) => item.id === id);
  if (!phone || !window.CartStore) return;

  window.CartStore.addToCart(phone, 1);
  showToast(`Đã thêm ${phone.name} vào giỏ hàng`);
});

document.getElementById('recommended-grid')?.addEventListener('click', (event) => {
  const button = event.target.closest('.add-cart-btn');
  if (!button) return;
  const id = Number(button.dataset.id);
  const phone = allLoadedItems.find((item) => item.id === id);
  if (!phone || !window.CartStore) return;

  window.CartStore.addToCart(phone, 1);
  showToast(`Đã thêm ${phone.name} vào giỏ hàng`);
});

document.querySelectorAll('.cat-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    event.preventDefault();
    selectedCategory = card.dataset.category || '';
    currentPage = 1;
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    loadPhones();
  });
});

document.getElementById('promo-view-btn')?.addEventListener('click', () => {
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('open-login-btn')?.addEventListener('click', () => openAuthModal('login'));
document.getElementById('open-register-btn')?.addEventListener('click', () => openAuthModal('register'));
document.getElementById('close-auth-modal')?.addEventListener('click', closeAuthModal);
document.getElementById('auth-form')?.addEventListener('submit', submitAuthForm);
document.getElementById('logout-auth-btn')?.addEventListener('click', logoutAuth);
document.getElementById('auth-modal')?.addEventListener('click', (event) => {
  if (event.target.id === 'auth-modal') closeAuthModal();
});

document.getElementById('promo-chat-btn')?.addEventListener('click', () => {
  if (typeof window.openSupportChat === 'function') window.openSupportChat();
});

verifyAuthSession();
loadBrands();
preloadAllItems();
loadPhones();
if (window.CartStore) window.CartStore.refreshCartBadge();
