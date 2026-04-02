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
          <p class="phone-desc">${phone.description}</p>
          <div class="phone-price">${formatPrice(phone.price)}</div>
        </div>
      </a>
    </article>
  `;
}

function buildQueryString(filters) {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.brand) params.set('brand', filters.brand);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

  const query = params.toString();
  return query ? `?${query}` : '';
}

function getFilters() {
  return {
    search: document.getElementById('search-input').value.trim(),
    brand: document.getElementById('brand-filter').value,
    minPrice: document.getElementById('min-price').value,
    maxPrice: document.getElementById('max-price').value
  };
}

function renderResultCount(total) {
  const resultCountEl = document.getElementById('result-count');
  resultCountEl.textContent = `Found ${total} product(s)`;
}

function renderPhones(phones) {
  const phoneListEl = document.getElementById('phone-list');

  if (!phones.length) {
    phoneListEl.innerHTML = '<p class="empty-state">No products match your filters.</p>';
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

    brandFilterEl.innerHTML = '<option value="">All brands</option>';

    brands.forEach((brand) => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandFilterEl.appendChild(option);
    });
  } catch (error) {
    brandFilterEl.innerHTML = '<option value="">All brands</option>';
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
    phoneListEl.innerHTML = '<p>Cannot load products right now. Please try again later.</p>';
  }
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('brand-filter').value = '';
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
  loadPhones();
}

document.getElementById('apply-filters').addEventListener('click', loadPhones);
document.getElementById('clear-filters').addEventListener('click', clearFilters);
document.getElementById('search-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    loadPhones();
  }
});

loadBrands();
loadPhones();
