/* eslint-disable no-console */
const { spawn } = require('child_process');

const TEST_PORT = Number(process.env.TEST_PORT || 3130);
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${TEST_PORT}`;

let serverProcess = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 20000) {
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
    const ok = await waitForServer(BASE_URL, 4000);
    if (!ok) {
      throw new Error(`Cannot reach BASE_URL=${BASE_URL}. Please check your running server.`);
    }
    return;
  }

  serverProcess = spawn('node', ['server.js'], {
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', () => {});
  serverProcess.stderr.on('data', () => {});

  const ok = await waitForServer(BASE_URL, 25000);
  if (!ok) {
    throw new Error('Smoke test could not start local server automatically.');
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
  await startServerIfNeeded();

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

run()
  .catch((error) => {
    console.error(`Smoke test failed unexpectedly: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => {
    stopServer();
  });
