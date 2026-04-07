/* eslint-disable no-console */
const { spawn } = require('child_process');

const TEST_PORT = Number(process.env.TEST_PORT || 3131);
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${TEST_PORT}`;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@phonestore.demo';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let serverProcess = null;
let createdProductId = 991;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath], {
      env: { ...process.env },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stderr = '';
    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || `${scriptPath} exited with code ${code}`));
    });
  });
}

async function waitForServer(url, timeoutMs = 25000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${url}/api/phones?page=1&limit=1`);
      if (response.ok) return true;
    } catch (error) {
      // keep waiting
    }

    await sleep(500);
  }

  return false;
}

async function startServerIfNeeded() {
  if (process.env.BASE_URL) {
    const ok = await waitForServer(BASE_URL, 5000);
    if (!ok) {
      throw new Error(`Cannot reach BASE_URL=${BASE_URL}. Please check your running server.`);
    }
    return;
  }

  serverProcess = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const ok = await waitForServer(BASE_URL, 25000);
  if (!ok) {
    throw new Error('Full test could not start local server automatically.');
  }
}

function stopServer() {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
  }
}

async function check(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    return false;
  }
}

async function expectStatus(url, expectedStatus, options = {}) {
  const response = await fetch(url, options);
  if (response.status !== expectedStatus) {
    throw new Error(`Expected ${expectedStatus}, got ${response.status} at ${url}`);
  }
  return response;
}

async function run() {
  await runNodeScript('scripts/ensureAdmin.js');
  await startServerIfNeeded();

  const results = [];
  const uniqueEmail = `user_${Date.now()}@example.com`;

  let userToken = '';
  let adminToken = '';

  results.push(
    await check('GET /api/phones returns 200 and has items', async () => {
      const response = await expectStatus(`${BASE_URL}/api/phones?page=1&limit=5`, 200);
      const data = await response.json();
      if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error('No items returned');
      }
    })
  );

  results.push(
    await check('GET /api/phones with search=iphone returns result', async () => {
      const response = await expectStatus(`${BASE_URL}/api/phones?search=iphone&page=1&limit=10`, 200);
      const data = await response.json();
      if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error('Search returned empty list');
      }
    })
  );

  results.push(
    await check('GET /api/phones sort=price_desc is sorted', async () => {
      const response = await expectStatus(`${BASE_URL}/api/phones?sort=price_desc&page=1&limit=8`, 200);
      const data = await response.json();
      const prices = (data.items || []).map((i) => Number(i.price));
      for (let i = 1; i < prices.length; i += 1) {
        if (prices[i] > prices[i - 1]) {
          throw new Error('Price list not sorted desc');
        }
      }
    })
  );

  results.push(
    await check('GET /api/phones/:id returns 200 for id=1', async () => {
      await expectStatus(`${BASE_URL}/api/phones/1`, 200);
    })
  );

  results.push(
    await check('GET /api/phones/:id returns 404 for missing id', async () => {
      await expectStatus(`${BASE_URL}/api/phones/99999`, 404);
    })
  );

  results.push(
    await check('POST /api/chat consultation returns 200 with reply', async () => {
      const response = await expectStatus(`${BASE_URL}/api/chat`, 200, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'máy tầm 15 triệu pin tốt' })
      });
      const data = await response.json();
      if (!data.reply || typeof data.reply !== 'string') throw new Error('Invalid chat reply');
    })
  );

  results.push(
    await check('POST /api/chat comparison intent works', async () => {
      const response = await expectStatus(`${BASE_URL}/api/chat`, 200, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'so sánh iphone 16 và samsung galaxy s24 fe' })
      });
      const data = await response.json();
      if (!data.intent || !['comparison', 'consultation'].includes(data.intent)) {
        throw new Error('Comparison intent not detected');
      }
    })
  );

  results.push(
    await check('POST /api/auth/register returns 201', async () => {
      const response = await expectStatus(`${BASE_URL}/api/auth/register`, 201, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'User Test',
          email: uniqueEmail,
          phone: '0912345678',
          password: '123456'
        })
      });
      const data = await response.json();
      if (!data.token) throw new Error('No token in register response');
    })
  );

  results.push(
    await check('POST /api/auth/login user returns 200', async () => {
      const response = await expectStatus(`${BASE_URL}/api/auth/login`, 200, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: uniqueEmail, password: '123456' })
      });
      const data = await response.json();
      if (!data.token) throw new Error('No user token');
      userToken = data.token;
    })
  );

  results.push(
    await check('GET /api/auth/me user returns role=user', async () => {
      const response = await expectStatus(`${BASE_URL}/api/auth/me`, 200, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      const data = await response.json();
      if (data?.user?.role !== 'user') throw new Error('Expected role=user');
    })
  );

  results.push(
    await check('POST /api/admin/products without auth returns 401', async () => {
      await expectStatus(`${BASE_URL}/api/admin/products`, 401, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 991, name: 'X', brand: 'Y', price: 1000, image: 'https://example.com/a.jpg' })
      });
    })
  );

  results.push(
    await check('POST /api/admin/products with user token returns 403', async () => {
      await expectStatus(`${BASE_URL}/api/admin/products`, 403, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ id: 992, name: 'X', brand: 'Y', price: 1000, image: 'https://example.com/a.jpg' })
      });
    })
  );

  results.push(
    await check('POST /api/auth/login admin returns 200', async () => {
      const response = await expectStatus(`${BASE_URL}/api/auth/login`, 200, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      });
      const data = await response.json();
      if (!data.token) throw new Error('No admin token');
      if (data?.user?.role !== 'admin') throw new Error('Expected role=admin');
      adminToken = data.token;
    })
  );

  results.push(
    await check('POST /api/admin/products with admin returns 201', async () => {
      createdProductId = 990 + Math.floor(Math.random() * 9);
      await expectStatus(`${BASE_URL}/api/admin/products`, 201, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({
          id: createdProductId,
          name: 'Automated Test Product',
          brand: 'Test',
          price: 7777000,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
          shortDescription: 'test',
          fullDescription: 'test',
          specs: {
            display: '6.1',
            processor: 'chip',
            ram: '8 GB',
            storage: '128 GB',
            battery: '5000 mAh',
            camera: '50MP'
          }
        })
      });
    })
  );

  results.push(
    await check('PUT /api/admin/products/:id with admin returns 200', async () => {
      await expectStatus(`${BASE_URL}/api/admin/products/${createdProductId}`, 200, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ name: 'Automated Test Product Updated', price: 7999000 })
      });
    })
  );

  results.push(
    await check('POST /api/upload/image with admin returns 201', async () => {
      const formData = new FormData();
      const blob = new Blob(['fake image bytes'], { type: 'image/png' });
      formData.append('image', blob, 'test.png');

      await expectStatus(`${BASE_URL}/api/upload/image`, 201, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData
      });
    })
  );

  results.push(
    await check('DELETE /api/admin/products/:id with admin returns 200', async () => {
      await expectStatus(`${BASE_URL}/api/admin/products/${createdProductId}`, 200, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
    })
  );

  const pass = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\nFull test result: ${pass}/${total} passed`);

  if (pass !== total) {
    process.exitCode = 1;
  }
}

run()
  .catch((error) => {
    console.error(`Full test failed unexpectedly: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    stopServer();
  });
