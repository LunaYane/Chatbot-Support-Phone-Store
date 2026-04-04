/* eslint-disable no-console */
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

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
  const results = [];

  results.push(
    await check('GET /api/phones returns 200', async () => {
      await expectStatus(`${BASE_URL}/api/phones?page=1&limit=5`, 200);
    })
  );

  results.push(
    await check('GET /api/phones/:id returns 200 for id=1', async () => {
      await expectStatus(`${BASE_URL}/api/phones/1`, 200);
    })
  );

  results.push(
    await check('POST /api/chat returns 200', async () => {
      await expectStatus(`${BASE_URL}/api/chat`, 200, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'iphone tầm 20 triệu' })
      });
    })
  );

  results.push(
    await check('POST /api/admin/products without auth returns 401', async () => {
      await expectStatus(`${BASE_URL}/api/admin/products`, 401, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 999,
          name: 'Unauthorized Product',
          brand: 'Test',
          price: 1000,
          image: 'https://example.com/x.jpg',
          shortDescription: 'x',
          fullDescription: 'x',
          specs: {
            display: 'x',
            processor: 'x',
            ram: 'x',
            storage: 'x',
            battery: 'x',
            camera: 'x'
          }
        })
      });
    })
  );

  const pass = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\nSmoke test result: ${pass}/${total} passed`);

  if (pass !== total) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error('Smoke test failed unexpectedly:', error.message);
  process.exitCode = 1;
});
