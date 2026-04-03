function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
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
    </article>
  `;
}

let selectedCategory = '';

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.category) params.set('category', filters.category);

  const query = params.toString();
  return query ? `?${query}` : '';
}

function getFilters() {
  return {
    search: document.getElementById('search-input').value.trim(),
    brand: document.getElementById('brand-filter').value,
    minPrice: document.getElementById('min-price').value,
    maxPrice: document.getElementById('max-price').value,
    category: selectedCategory
  };
}

function renderResultCount(total) {
  const resultCountEl = document.getElementById('result-count');
  resultCountEl.textContent = `Tìm thấy ${total} sản phẩm`;
}

function renderPhones(phones) {
  const phoneListEl = document.getElementById('phone-list');

  if (!phones.length) {
    phoneListEl.innerHTML = '<p class="empty-state">Không có sản phẩm phù hợp bộ lọc hiện tại.</p>';
    renderResultCount(0);
    return;
  }

  phoneListEl.innerHTML = phones.map(createPhoneCard).join('');
  renderResultCount(phones.length);
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
  const phoneListEl = document.getElementById('phone-list');
  const filters = getFilters();
  const queryString = buildQueryString(filters);

  try {
    const response = await fetch(`/api/phones${queryString}`);
    const phones = await response.json();
    renderPhones(phones);
  } catch (error) {
    phoneListEl.innerHTML = '<p>Không thể tải sản phẩm lúc này. Vui lòng thử lại sau.</p>';
  }
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('brand-filter').value = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  selectedCategory = '';
  loadPhones();
}

function syncSearchFromTopBar() {
  const topSearchInput = document.getElementById('top-search-input');
  const mainSearchInput = document.getElementById('search-input');

  if (!topSearchInput || !mainSearchInput) return;

  mainSearchInput.value = topSearchInput.value.trim();
  const targetSection = document.getElementById('products');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  loadPhones();
}

function applyQuickCategoryQuery(query, category) {
  const mainSearchInput = document.getElementById('search-input');
  if (!mainSearchInput) return;

  mainSearchInput.value = (query || '').trim();
  document.getElementById('brand-filter').value = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  selectedCategory = category || '';

  const targetSection = document.getElementById('products');
  if (targetSection) {
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  loadPhones();
}

document.getElementById('apply-filters').addEventListener('click', loadPhones);
document.getElementById('clear-filters').addEventListener('click', clearFilters);
document.getElementById('search-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loadPhones();
  }
});

const topSearchButton = document.getElementById('top-search-btn');
const topSearchInput = document.getElementById('top-search-input');
if (topSearchButton && topSearchInput) {
  topSearchButton.addEventListener('click', syncSearchFromTopBar);
  topSearchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      syncSearchFromTopBar();
    }
  });
}

const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach((card) => {
  const query = card.dataset.query || '';
  const category = card.dataset.category || '';

  card.addEventListener('click', () => applyQuickCategoryQuery(query, category));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      applyQuickCategoryQuery(query, category);
    }
  });

  const actionBtn = card.querySelector('.category-action');
  if (actionBtn) {
    actionBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      applyQuickCategoryQuery(query, category);
    });
  }
});

const promoViewButton = document.getElementById('promo-view-btn');
if (promoViewButton) {
  promoViewButton.addEventListener('click', () => {
    const targetSection = document.getElementById('products');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function openChatSupport() {
  if (typeof window.openSupportChat === 'function') {
    window.openSupportChat();
    return;
  }

  const chatbox = document.getElementById('chatbox');
  const supportWidget = document.getElementById('floating-support');
  if (chatbox) chatbox.classList.remove('hidden');
  if (supportWidget) supportWidget.classList.add('hidden');
}

const promoChatButton = document.getElementById('promo-chat-btn');
if (promoChatButton) {
  promoChatButton.addEventListener('click', openChatSupport);
}

const supportChatLink = document.getElementById('support-chat-link');
if (supportChatLink) {
  supportChatLink.addEventListener('click', (event) => {
    event.preventDefault();
    openChatSupport();
  });
}

const siteHeader = document.getElementById('site-header');
if (siteHeader) {
  const updateHeaderOnScroll = () => {
    if (window.scrollY > 8) {
      siteHeader.classList.add('is-scrolled');
    } else {
      siteHeader.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', updateHeaderOnScroll);
  updateHeaderOnScroll();
}

loadBrands();
loadPhones();
