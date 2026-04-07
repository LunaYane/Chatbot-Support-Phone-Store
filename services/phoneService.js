const Phone = require('../models/Phone');
const rawPhones = require('../data/phones');
const { withRecommendation, normalizeText, buildRecommendationAttributes } = require('../utils/recommendation');
const HttpError = require('../utils/httpError');

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(tags || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSpecifications(specs = {}) {
  return {
    display: String(specs.display || '').trim(),
    processor: String(specs.processor || '').trim(),
    ram: String(specs.ram || '').trim(),
    storage: String(specs.storage || '').trim(),
    battery: String(specs.battery || '').trim(),
    camera: String(specs.camera || '').trim()
  };
}

function normalizePhoneData(phone) {
  const shortDescription = String(phone.shortDescription || '').trim();
  const fullDescription = String(phone.fullDescription || '').trim();
  const fallbackDescription = String(phone.description || shortDescription || fullDescription || '').trim();

  return {
    ...phone,
    shortDescription: shortDescription || fallbackDescription,
    fullDescription: fullDescription || fallbackDescription,
    description: fallbackDescription,
    tags: normalizeTags(phone.tags),
    specifications: normalizeSpecifications(phone.specifications)
  };
}

const SAMPLE_PRODUCTS = rawPhones.map((phone) => normalizePhoneData(withRecommendation(phone)));

function getSampleProducts() {
  return SAMPLE_PRODUCTS.map((item) => ({ ...item }));
}

function parseSort(sort = 'price_asc') {
  const sortMap = {
    price_asc: { price: 1, id: 1 },
    price_desc: { price: -1, id: 1 },
    name_asc: { name: 1, id: 1 },
    name_desc: { name: -1, id: 1 }
  };

  return sortMap[sort] || sortMap.price_asc;
}

function parsePagination(page = 1, limit = 12) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(30, Math.max(1, Number(limit) || 12));
  return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
}

function applyCategoryFilter(items, category = '') {
  const selectedCategory = String(category || '').trim().toLowerCase();
  if (selectedCategory === 'gaming') {
    return items.filter((phone) => phone.recommendation?.suitable_for_gaming);
  }
  if (selectedCategory === 'camera') {
    return items.filter((phone) => phone.recommendation?.suitable_for_camera);
  }
  if (selectedCategory === 'battery') {
    return items.filter((phone) => phone.recommendation?.suitable_for_battery);
  }
  if (selectedCategory === 'brand') {
    return items.filter((phone) => String(phone.brand || '').trim().length > 0);
  }
  return items;
}

async function listPhones(params) {
  const { search = '', brand = '', minPrice = '', maxPrice = '', category = '', sort = 'price_asc', page = 1, limit = 12 } = params;

  const { page: safePage, limit: safeLimit, skip } = parsePagination(page, limit);
  const dbCount = await Phone.countDocuments({});

  let dataset = [];

  if (dbCount > 0) {
    const query = {};
    if (search.trim()) query.name = { $regex: search.trim(), $options: 'i' };
    if (brand.trim()) query.brand = brand.trim();
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const dbSort = parseSort(sort);
    const phones = await Phone.find(query).sort(dbSort).lean();
    dataset = phones.map((phone) => normalizePhoneData(withRecommendation(phone)));
  } else {
    let sample = getSampleProducts();
    if (search.trim()) {
      const text = normalizeText(search.trim());
      sample = sample.filter((phone) => normalizeText(phone.name).includes(text));
    }
    if (brand.trim()) {
      sample = sample.filter((phone) => normalizeText(phone.brand) === normalizeText(brand));
    }
    if (minPrice) sample = sample.filter((phone) => Number(phone.price) >= Number(minPrice));
    if (maxPrice) sample = sample.filter((phone) => Number(phone.price) <= Number(maxPrice));

    dataset = sample.sort((a, b) => {
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'name_asc') return a.name.localeCompare(b.name, 'vi');
      if (sort === 'name_desc') return b.name.localeCompare(a.name, 'vi');
      return a.price - b.price;
    });
  }

  const filtered = applyCategoryFilter(dataset, category);
  const total = filtered.length;
  const items = filtered.slice(skip, skip + safeLimit);

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.max(1, Math.ceil(total / safeLimit))
  };
}

async function listBrands() {
  const dbCount = await Phone.countDocuments({});
  if (dbCount > 0) {
    const brands = await Phone.distinct('brand');
    return brands.sort();
  }

  return [...new Set(getSampleProducts().map((item) => item.brand))].sort();
}

async function getPhoneById(id) {
  const phoneId = Number(id);
  if (!phoneId) throw new HttpError(400, 'Invalid product ID.');

  const phone = await Phone.findOne({ id: phoneId }).lean();
  if (phone) return normalizePhoneData(withRecommendation(phone));

  const fallback = getSampleProducts().find((item) => item.id === phoneId);
  if (!fallback) throw new HttpError(404, 'Product not found.');
  return fallback;
}

function validatePhoneInput(input) {
  if (!input.name || !input.brand) throw new HttpError(400, 'Please provide name and brand.');
  if (!Number(input.price) || Number(input.price) <= 0) throw new HttpError(400, 'Price must be greater than 0.');
  if (!String(input.image || '').trim()) throw new HttpError(400, 'Please provide product image URL.');
}

function buildPhonePayload(body, current = null) {
  const specsFromObject = typeof body.specs === 'object' && body.specs !== null ? body.specs : {};
  const resolvedDescription = String(
    body.fullDescription || body.shortDescription || body.description || current?.fullDescription || current?.description || ''
  ).trim();

  const payload = {
    id: Number(body.id || current?.id || 0),
    name: String(body.name || current?.name || '').trim(),
    brand: String(body.brand || current?.brand || '').trim(),
    price: Number(body.price || current?.price || 0),
    image: String(body.image || current?.image || '').trim(),
    shortDescription: String(body.shortDescription || current?.shortDescription || '').trim(),
    fullDescription: String(body.fullDescription || current?.fullDescription || '').trim(),
    description: resolvedDescription,
    tags: normalizeTags(body.tags || current?.tags),
    specifications: normalizeSpecifications({
      display: specsFromObject.display || body.display || current?.specifications?.display,
      processor: specsFromObject.processor || body.processor || current?.specifications?.processor,
      ram: specsFromObject.ram || body.ram || current?.specifications?.ram,
      storage: specsFromObject.storage || body.storage || current?.specifications?.storage,
      battery: specsFromObject.battery || body.battery || current?.specifications?.battery,
      camera: specsFromObject.camera || body.camera || current?.specifications?.camera
    })
  };

  if (!payload.description) {
    payload.description = payload.shortDescription || payload.fullDescription;
  }

  validatePhoneInput(payload);
  payload.recommendation = buildRecommendationAttributes(payload);
  return payload;
}

async function listAdminProducts() {
  const products = await Phone.find({}).sort({ id: 1 }).lean();
  return products.map((item) => normalizePhoneData(item));
}

async function createAdminProduct(body) {
  const maxPhone = await Phone.findOne().sort({ id: -1 }).lean();
  const generatedId = maxPhone ? maxPhone.id + 1 : 1;
  const rawId = Number(body.id) > 0 ? Number(body.id) : generatedId;

  const exists = await Phone.findOne({ id: rawId });
  if (exists) throw new HttpError(400, 'ID already exists. Please choose another ID.');

  const payload = buildPhonePayload({ ...body, id: rawId });
  const created = await Phone.create(payload);
  return created;
}

async function updateAdminProduct(id, body) {
  const phoneId = Number(id);
  const current = await Phone.findOne({ id: phoneId });
  if (!current) throw new HttpError(404, 'Product not found.');

  const nextId = Number(body.id || phoneId);
  if (nextId !== phoneId) {
    const exists = await Phone.findOne({ id: nextId });
    if (exists) throw new HttpError(400, 'ID already exists. Please choose another ID.');
  }

  const payload = buildPhonePayload({ ...body, id: nextId }, current);
  const updated = await Phone.findOneAndUpdate({ id: phoneId }, payload, { new: true, runValidators: true });
  return updated;
}

async function deleteAdminProduct(id) {
  const deleted = await Phone.findOneAndDelete({ id: Number(id) });
  if (!deleted) throw new HttpError(404, 'Product not found.');
  return deleted;
}

module.exports = {
  listPhones,
  listBrands,
  getPhoneById,
  listAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  normalizePhoneData,
  getSampleProducts
};
