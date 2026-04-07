function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function getProductIdFromUrl() {
  const parts = window.location.pathname.split('/');
  return Number(parts[parts.length - 1]);
}

function renderSpecifications(specs) {
  return `
    <ul class="spec-list">
      <li><strong>Display:</strong> ${specs.display}</li>
      <li><strong>Processor:</strong> ${specs.processor}</li>
      <li><strong>RAM:</strong> ${specs.ram}</li>
      <li><strong>Storage:</strong> ${specs.storage}</li>
      <li><strong>Battery:</strong> ${specs.battery}</li>
      <li><strong>Camera:</strong> ${specs.camera}</li>
    </ul>
  `;
}

function renderProductDetail(phone) {
  return `
    <article class="detail-card">
      <img class="detail-image" src="${phone.image}" alt="${phone.name}" />
      <div class="detail-content">
        <div class="brand">${phone.brand}</div>
        <h2 class="detail-name">${phone.name}</h2>
        <div class="detail-price">${formatPrice(phone.price)}</div>

        <h3>Specifications</h3>
        ${renderSpecifications(phone.specifications)}

        <h3>Description</h3>
        <p class="detail-description">${phone.description}</p>
      </div>
    </article>
  `;
}

async function loadProductDetail() {
  const container = document.getElementById('product-detail');
  const productId = getProductIdFromUrl();

  if (!productId) {
    container.innerHTML = '<p>Invalid product ID.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/phones/${productId}`);

    if (!response.ok) {
      container.innerHTML = '<p>Product not found.</p>';
      return;
    }

    const phone = await response.json();
    container.innerHTML = renderProductDetail(phone);
  } catch (error) {
    container.innerHTML = '<p>Cannot load product detail right now. Please try again later.</p>';
  }
}

loadProductDetail();
