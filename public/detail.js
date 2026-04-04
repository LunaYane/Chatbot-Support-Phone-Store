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
  const parts = window.location.pathname.split('/');
  return Number(parts[parts.length - 1]);
}

function renderSpecifications(specs) {
  return `
    <ul class="spec-list">
      <li><strong>Display:</strong> ${specs.display || '-'}</li>
      <li><strong>Processor:</strong> ${specs.processor || '-'}</li>
      <li><strong>RAM:</strong> ${specs.ram || '-'}</li>
      <li><strong>Storage:</strong> ${specs.storage || '-'}</li>
      <li><strong>Battery:</strong> ${specs.battery || '-'}</li>
      <li><strong>Camera:</strong> ${specs.camera || '-'}</li>
    </ul>
  `;
}

function renderProductDetail(phone) {
  return `
    <article class="detail-card">
      <img class="detail-image" src="${phone.image}" alt="${phone.name}" onerror="this.onerror=null;this.src='/images/phone-placeholder.svg';" />
      <div class="detail-content">
        <div class="brand">${phone.brand}</div>
        <h2 class="detail-name">${phone.name}</h2>
        <div class="detail-price">${formatPrice(phone.price)}</div>

        <div class="phone-actions detail-actions">
          <button type="button" class="btn-primary" id="add-detail-cart">Thêm vào giỏ hàng</button>
          <a class="btn-secondary" href="/checkout">Mua ngay</a>
        </div>

        <h3>Thông số kỹ thuật</h3>
        ${renderSpecifications(phone.specifications || {})}

        <h3>Mô tả</h3>
        <p class="detail-description">${phone.fullDescription || phone.description || ''}</p>
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
