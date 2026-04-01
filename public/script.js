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

async function loadPhones() {
  const phoneListEl = document.getElementById('phone-list');

  try {
    const response = await fetch('/api/phones');
    const phones = await response.json();

    phoneListEl.innerHTML = phones.map(createPhoneCard).join('');
  } catch (error) {
    phoneListEl.innerHTML = '<p>Cannot load products right now. Please try again later.</p>';
  }
}

loadPhones();
