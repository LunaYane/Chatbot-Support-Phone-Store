const formEl = document.getElementById('admin-form');
const originalIdEl = document.getElementById('editing-original-id');
const submitBtnEl = document.getElementById('submit-btn');
const cancelEditBtnEl = document.getElementById('cancel-edit');
const tableBodyEl = document.getElementById('admin-product-list');
const countEl = document.getElementById('admin-count');
const authStatusEl = document.getElementById('auth-status');
const editorCardEl = document.getElementById('editor-card');
const actionsHeaderEl = document.getElementById('actions-header');
const uploadImageBtnEl = document.getElementById('upload-image-btn');

const AUTH_STORAGE_KEY = 'phoneStoreAuth';
let isAdmin = false;
let cachedProducts = [];

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

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}

function getAuthState() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function authHeaders() {
  const state = getAuthState();
  if (!state?.token) return {};
  return { Authorization: `Bearer ${state.token}` };
}

function setAdminMode(enabled, displayName = '') {
  isAdmin = enabled;

  if (enabled) {
    authStatusEl.textContent = `Đăng nhập với quyền Admin: ${displayName}`;
    editorCardEl.classList.remove('hidden');
    actionsHeaderEl.classList.remove('hidden');
  } else {
    authStatusEl.textContent = 'Bạn không có quyền admin. Chỉ admin mới được thêm/sửa/xóa sản phẩm.';
    editorCardEl.classList.add('hidden');
    actionsHeaderEl.classList.add('hidden');
    resetForm();
  }
}

function parseSpecsInput() {
  const raw = document.getElementById('specs').value.trim();
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid specs JSON');
    return parsed;
  } catch (error) {
    throw new Error('Specs JSON không hợp lệ, vui lòng kiểm tra lại.');
  }
}

function getFormData() {
  return {
    id: Number(document.getElementById('id').value),
    name: document.getElementById('name').value.trim(),
    brand: document.getElementById('brand').value.trim(),
    price: Number(document.getElementById('price').value),
    image: document.getElementById('image').value.trim(),
    shortDescription: document.getElementById('shortDescription').value.trim(),
    fullDescription: document.getElementById('fullDescription').value.trim(),
    specs: parseSpecsInput(),
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
            <div class="head-actions">
              <button type="button" class="btn-secondary btn-edit" data-id="${phone.id}">Edit</button>
              <button type="button" class="btn-secondary btn-delete" data-id="${phone.id}">Delete</button>
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
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create product');
}

async function updateProduct(originalId, payload) {
  const response = await fetch(`/api/admin/products/${originalId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
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

async function verifyRole() {
  const state = getAuthState();
  if (!state?.token) {
    setAdminMode(false);
    return;
  }

  try {
    const response = await fetch('/api/auth/me', { headers: authHeaders() });
    const data = await response.json();

    if (!response.ok || !data?.user) {
      setAdminMode(false);
      return;
    }

    setAdminMode(data.user.role === 'admin', data.user.fullName || data.user.email || 'Admin');
  } catch (error) {
    setAdminMode(false);
  }
}

async function uploadImageFile() {
  if (!isAdmin) {
    showToast('Chỉ admin mới được upload ảnh.');
    return;
  }

  const input = document.getElementById('image-file');
  const file = input.files?.[0];
  if (!file) {
    showToast('Vui lòng chọn file ảnh trước khi upload.');
    return;
  }

  const fd = new FormData();
  fd.append('image', file);

  try {
    uploadImageBtnEl.disabled = true;
    uploadImageBtnEl.textContent = 'Uploading...';

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: authHeaders(),
      body: fd
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Upload failed');

    document.getElementById('image').value = data.imageUrl;
    showToast('Upload ảnh thành công. Đã điền URL vào form.');
    input.value = '';
  } catch (error) {
    showToast(error.message || 'Không thể upload ảnh lúc này.');
  } finally {
    uploadImageBtnEl.disabled = false;
    uploadImageBtnEl.textContent = 'Upload';
  }
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!isAdmin) {
    showToast('Chỉ admin được thêm/sửa sản phẩm.');
    return;
  }

  try {
    const payload = getFormData();
    const editingOriginalId = originalIdEl.value;

    if (editingOriginalId) {
      await updateProduct(editingOriginalId, payload);
      showToast('Product updated successfully.');
    } else {
      await createProduct(payload);
      showToast('Product added successfully.');
    }

    resetForm();
    loadProducts();
  } catch (error) {
    showToast(error.message || 'Cannot save product right now.');
  }
});

cancelEditBtnEl.addEventListener('click', () => {
  resetForm();
});

uploadImageBtnEl?.addEventListener('click', uploadImageFile);

tableBodyEl.addEventListener('click', async (event) => {
  if (!isAdmin) return;

  const target = event.target;
  const productId = target.dataset.id;
  if (!productId) return;

  if (target.classList.contains('btn-edit')) {
    const phone = cachedProducts.find((item) => String(item.id) === String(productId));
    if (!phone) {
      showToast('Product not found.');
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
      showToast('Product deleted successfully.');
      loadProducts();
    } catch (error) {
      showToast(error.message || 'Cannot delete product right now.');
    }
  }
});

verifyRole();
loadProducts();
