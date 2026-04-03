const formEl = document.getElementById('admin-form');
const productIdEl = document.getElementById('product-id');
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

function getFormData() {
  return {
    name: document.getElementById('name').value.trim(),
    brand: document.getElementById('brand').value.trim(),
    price: Number(document.getElementById('price').value),
    image: document.getElementById('image').value.trim(),
    description: document.getElementById('description').value.trim(),
    display: document.getElementById('display').value.trim(),
    processor: document.getElementById('processor').value.trim(),
    ram: document.getElementById('ram').value.trim(),
    storage: document.getElementById('storage').value.trim(),
    battery: document.getElementById('battery').value.trim(),
    camera: document.getElementById('camera').value.trim()
  };
}

function setFormData(phone) {
  document.getElementById('name').value = phone.name || '';
  document.getElementById('brand').value = phone.brand || '';
  document.getElementById('price').value = phone.price || '';
  document.getElementById('image').value = phone.image || '';
  document.getElementById('description').value = phone.description || '';
  document.getElementById('display').value = phone.specifications?.display || '';
  document.getElementById('processor').value = phone.specifications?.processor || '';
  document.getElementById('ram').value = phone.specifications?.ram || '';
  document.getElementById('storage').value = phone.specifications?.storage || '';
  document.getElementById('battery').value = phone.specifications?.battery || '';
  document.getElementById('camera').value = phone.specifications?.camera || '';
}

function resetForm() {
  formEl.reset();
  productIdEl.value = '';
  submitBtnEl.textContent = 'Add Product';
}

function renderProducts(products) {
  countEl.textContent = `Total: ${products.length} product(s)`;

  if (!products.length) {
    tableBodyEl.innerHTML = `<tr><td colspan="${isAdmin ? 5 : 4}" class="admin-empty">No product found.</td></tr>`;
    return;
  }

  tableBodyEl.innerHTML = products
    .map((phone) => {
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
    renderProducts(products);
  } catch (error) {
    tableBodyEl.innerHTML = '<tr><td colspan="5" class="admin-empty">Cannot load products right now.</td></tr>';
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

async function updateProduct(id, payload) {
  const response = await fetch(`/api/admin/products/${id}`, {
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

  const payload = getFormData();
  const editingId = productIdEl.value;

  try {
    if (editingId) {
      await updateProduct(editingId, payload);
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
    try {
      const response = await fetch('/api/admin/products');
      const products = await response.json();
      const phone = products.find((item) => String(item.id) === String(productId));

      if (!phone) {
        alert('Product not found.');
        return;
      }

      setFormData(phone);
      productIdEl.value = phone.id;
      submitBtnEl.textContent = 'Update Product';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Cannot load product for edit.');
    }
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
