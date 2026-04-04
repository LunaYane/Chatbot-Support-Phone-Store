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

function getProductIdFromUrl() {
  const path = String(window.location.pathname || '').replace(/\/+$/, '');
  const parts = path.split('/').filter(Boolean);
  const last = parts[parts.length - 1];
  return Number(last);
}

function renderSpecifications(specs) {
  const rows = [
    ['Màn hình', specs.display || '-'],
    ['Chip xử lý', specs.processor || '-'],
    ['RAM', specs.ram || '-'],
    ['Bộ nhớ', specs.storage || '-'],
    ['Pin', specs.battery || '-'],
    ['Camera', specs.camera || '-']
  ];

  return `
    <div class="spec-grid">
      ${rows
        .map(
          ([label, value]) => `
        <div class="spec-item">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function renderProductDetail(phone) {
  return `
    <article class="detail-card">
      <div class="detail-media">
        <img class="detail-image" src="${phone.image}" alt="${phone.name}" onerror="this.onerror=null;this.src='/images/phone-placeholder.svg';" />
      </div>
      <div class="detail-content">
        <div class="detail-head">
          <div class="brand">${phone.brand}</div>
          <h2 class="detail-name">${phone.name}</h2>
          <div class="detail-price">${formatPrice(phone.price)}</div>
        </div>

        <div class="detail-actions">
          <button type="button" class="btn-primary" id="add-detail-cart">Thêm vào giỏ hàng</button>
          <a class="btn-secondary" href="/checkout">Mua ngay</a>
        </div>

        <section class="detail-block">
          <h3>Thông số kỹ thuật</h3>
          ${renderSpecifications(phone.specifications || {})}
        </section>

        <section class="detail-block">
          <h3>Mô tả</h3>
          <p class="detail-description">${phone.fullDescription || phone.description || ''}</p>
        </section>
      </div>
    </article>
  `;
}

async function loadProductDetail() {
  const container = document.getElementById('product-detail');
  const productId = getProductIdFromUrl();

  if (!productId) {
    container.innerHTML = '<p class="empty-state">ID sản phẩm không hợp lệ.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/phones/${productId}`);
    if (!response.ok) {
      container.innerHTML = '<p class="empty-state">Không tìm thấy sản phẩm.</p>';
      return;
    }

    const phone = await response.json();
    container.innerHTML = renderProductDetail(phone);

    document.getElementById('add-detail-cart')?.addEventListener('click', () => {
      if (!window.CartStore) return;
      window.CartStore.addToCart(phone, 1);
      showToast(`Đã thêm ${phone.name} vào giỏ hàng`);
    });
  } catch (error) {
    container.innerHTML = '<p class="empty-state">Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.</p>';
  }
}

loadProductDetail();
if (window.CartStore) window.CartStore.refreshCartBadge();
