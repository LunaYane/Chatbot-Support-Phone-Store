const formEl = document.getElementById('admin-form');
const originalIdEl = document.getElementById('editing-original-id');
const submitBtnEl = document.getElementById('submit-btn');
const cancelEditBtnEl = document.getElementById('cancel-edit');
const tableBodyEl = document.getElementById('admin-product-list');
const countEl = document.getElementById('admin-count');
const loginFormEl = document.getElementById('login-form');
const logoutBtnEl = document.getElementById('logout-btn');
const authStatusEl = document.getElementById('auth-status');
const editorCardEl = document.getElementById('editor-card');
const actionsHeaderEl = document.getElementById('actions-header');

let adminToken = localStorage.getItem('adminToken') || '';
let isAdmin = false;
let cachedProducts = [];

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function authHeaders() {
  if (!adminToken) return {};
  return { 'x-admin-token': adminToken };
}

function setAdminMode(enabled, username = 'Admin') {
  isAdmin = enabled;

  if (enabled) {
    authStatusEl.textContent = `Current role: ${username} (full access)`;
    editorCardEl.classList.remove('hidden');
    actionsHeaderEl.classList.remove('hidden');
    logoutBtnEl.classList.remove('hidden');
  } else {
    authStatusEl.textContent = 'Current role: Guest (view only)';
    editorCardEl.classList.add('hidden');
    actionsHeaderEl.classList.add('hidden');
    logoutBtnEl.classList.add('hidden');
    resetForm();
  }
}

function parseSpecsInput() {
  const raw = document.getElementById('specs').value.trim();
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid specs JSON');
    }
    return parsed;
  } catch (error) {
    throw new Error('Specs JSON is invalid. Please check format.');
  }
}

function getFormData() {
  const specs = parseSpecsInput();

  return {
    id: Number(document.getElementById('id').value),
    name: document.getElementById('name').value.trim(),
    brand: document.getElementById('brand').value.trim(),
    price: Number(document.getElementById('price').value),
    image: document.getElementById('image').value.trim(),
    shortDescription: document.getElementById('shortDescription').value.trim(),
    fullDescription: document.getElementById('fullDescription').value.trim(),
    specs,
    tags: document.getElementById('tags').value.trim()
  };
}

function setFormData(phone) {
  document.getElementById('id').value = phone.id || '';
  document.getElementById('name').value = phone.name || '';
  document.getElementById('brand').value = phone.brand || '';
  document.getElementById('price').value = phone.price || '';
  document.getElementById('image').value = phone.image || '';
  document.getElementById('shortDescription').value = phone.shortDescription || '';
  document.getElementById('fullDescription').value = phone.fullDescription || phone.description || '';
  document.getElementById('tags').value = Array.isArray(phone.tags) ? phone.tags.join(', ') : '';

  const specs = {
    display: phone.specifications?.display || '',
    processor: phone.specifications?.processor || '',
    ram: phone.specifications?.ram || '',
    storage: phone.specifications?.storage || '',
    battery: phone.specifications?.battery || '',
    camera: phone.specifications?.camera || ''
  };

  document.getElementById('specs').value = JSON.stringify(specs, null, 2);
}

function resetForm() {
  formEl.reset();
  originalIdEl.value = '';
  submitBtnEl.textContent = 'Add Product';
}

function renderProducts(products) {
  countEl.textContent = `Total: ${products.length} product(s)`;

  if (!products.length) {
    tableBodyEl.innerHTML = `<tr><td colspan="${isAdmin ? 6 : 5}" class="admin-empty">No product found.</td></tr>`;
    return;
  }

  tableBodyEl.innerHTML = products
    .map((phone) => {
      const tags = Array.isArray(phone.tags) && phone.tags.length > 0 ? phone.tags.join(', ') : '-';
      const actionCell = isAdmin
        ? `
          <td>
            <div class="table-actions">
              <button type="button" class="btn-small btn-edit" data-id="${phone.id}">Edit</button>
              <button type="button" class="btn-small btn-delete" data-id="${phone.id}">Delete</button>
            </div>
          </td>
        `
        : '';

      return `
      <tr>
        <td>${phone.id}</td>
        <td>${phone.name}</td>
        <td>${phone.brand}</td>
        <td>${formatPrice(phone.price)}</td>
        <td>${tags}</td>
        ${actionCell}
      </tr>
      `;
    })
    .join('');
}

async function loadProducts() {
  try {
    const response = await fetch('/api/admin/products');
    const products = await response.json();
    cachedProducts = Array.isArray(products) ? products : [];
    renderProducts(cachedProducts);
  } catch (error) {
    tableBodyEl.innerHTML = '<tr><td colspan="6" class="admin-empty">Cannot load products right now.</td></tr>';
  }
}

async function createProduct(payload) {
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create product');
}

async function updateProduct(originalId, payload) {
  const response = await fetch(`/api/admin/products/${originalId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update product');
}

async function deleteProduct(id) {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete product');
}

async function loginAdmin(username, password) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Login failed');

  adminToken = data.token;
  localStorage.setItem('adminToken', adminToken);
  setAdminMode(true, data.username || 'Admin');
}

async function checkSession() {
  if (!adminToken) {
    setAdminMode(false);
    return;
  }

  try {
    const response = await fetch('/api/admin/session', {
      headers: authHeaders()
    });

    const data = await response.json();

    if (!data.isAdmin) {
      adminToken = '';
      localStorage.removeItem('adminToken');
      setAdminMode(false);
      return;
    }

    setAdminMode(true, data.username || 'Admin');
  } catch (error) {
    setAdminMode(false);
  }
}

async function logoutAdmin() {
  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      headers: authHeaders()
    });
  } catch (error) {
    // ignore
  }

  adminToken = '';
  localStorage.removeItem('adminToken');
  setAdminMode(false);
  loadProducts();
}

loginFormEl.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value.trim();

  try {
    await loginAdmin(username, password);
    alert('Admin login successful.');
    loginFormEl.reset();
    loadProducts();
  } catch (error) {
    alert(error.message || 'Cannot login right now.');
  }
});

logoutBtnEl.addEventListener('click', async () => {
  await logoutAdmin();
  alert('Logged out. You are now guest mode.');
});

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!isAdmin) {
    alert('Only Admin can add/edit products.');
    return;
  }

  try {
    const payload = getFormData();
    const editingOriginalId = originalIdEl.value;

    if (editingOriginalId) {
      await updateProduct(editingOriginalId, payload);
      alert('Product updated successfully.');
    } else {
      await createProduct(payload);
      alert('Product added successfully.');
    }

    resetForm();
    loadProducts();
  } catch (error) {
    alert(error.message || 'Cannot save product right now.');
  }
});

cancelEditBtnEl.addEventListener('click', () => {
  resetForm();
});

tableBodyEl.addEventListener('click', async (event) => {
  if (!isAdmin) return;

  const target = event.target;
  const productId = target.dataset.id;

  if (!productId) return;

  if (target.classList.contains('btn-edit')) {
    const phone = cachedProducts.find((item) => String(item.id) === String(productId));

    if (!phone) {
      alert('Product not found.');
      return;
    }

    setFormData(phone);
    originalIdEl.value = phone.id;
    submitBtnEl.textContent = 'Update Product';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (target.classList.contains('btn-delete')) {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      await deleteProduct(productId);
      alert('Product deleted successfully.');
      loadProducts();
    } catch (error) {
      alert(error.message || 'Cannot delete product right now.');
    }
  }
});

checkSession();
loadProducts();
