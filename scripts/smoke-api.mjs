#!/usr/bin/env node

const args = process.argv.slice(2);

function readArg(name, fallback = '') {
  const withEquals = args.find((value) => value.startsWith(`--${name}=`));
  if (withEquals) {
    return withEquals.slice(name.length + 3);
  }

  const index = args.indexOf(`--${name}`);
  if (index >= 0 && args[index + 1]) {
    return args[index + 1];
  }

  return fallback;
}

const baseUrl = readArg('baseUrl', process.env.API_BASE_URL || '').replace(/\/+$/, '');
const email = readArg('email', process.env.SMOKE_EMAIL || '');
const password = readArg('password', process.env.SMOKE_PASSWORD || '');

if (!baseUrl) {
  console.error('Missing base URL. Use --baseUrl=https://my-backend.onrender.com or API_BASE_URL env var.');
  process.exit(1);
}

async function request(path, options = {}) {
  const startedAt = Date.now();
  const response = await fetch(`${baseUrl}${path}`, options);
  const elapsedMs = Date.now() - startedAt;

  let bodyText = '';
  try {
    bodyText = await response.text();
  } catch {
    bodyText = '';
  }

  let json = null;
  if (bodyText) {
    try {
      json = JSON.parse(bodyText);
    } catch {
      json = null;
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    path,
    elapsedMs,
    json,
    text: bodyText,
  };
}

function printResult(result) {
  const statusText = result.ok ? 'PASS' : 'FAIL';
  const info = `${statusText} ${result.status} ${result.path} (${result.elapsedMs}ms)`;
  console.log(info);

  if (!result.ok) {
    const detail = result.json?.message || result.text || 'No error payload';
    console.log(`  -> ${detail}`);
  }
}

async function run() {
  const failures = [];

  const publicEndpoints = ['/api/health', '/health'];

  console.log(`\nSmoke testing base URL: ${baseUrl}`);
  console.log('Public endpoint checks:\n');

  for (const endpoint of publicEndpoints) {
    try {
      const result = await request(endpoint, {
        headers: { Accept: 'application/json' },
      });
      printResult(result);
      if (!result.ok) {
        failures.push(result);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`FAIL NETWORK ${endpoint}`);
      console.log(`  -> ${message}`);
      failures.push({ path: endpoint, ok: false, status: 0 });
    }
  }

  if (email && password) {
    console.log('\nAuthenticated checks:\n');
    const loginResult = await request('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    printResult(loginResult);
    if (!loginResult.ok) {
      failures.push(loginResult);
    }

    const token = loginResult.json?.token;
    if (token) {
      const meResult = await request('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      printResult(meResult);
      if (!meResult.ok) {
        failures.push(meResult);
      }
    } else if (loginResult.ok) {
      console.log('FAIL Missing token in /api/auth/login response');
      failures.push({ path: '/api/auth/login', ok: false, status: loginResult.status });
    }
  } else {
    console.log('\nSkipping authenticated checks (set --email and --password).');
  }

  console.log('\nSummary:');
  if (failures.length === 0) {
    console.log('All smoke checks passed.');
    process.exit(0);
  }

  console.log(`${failures.length} check(s) failed.`);
  process.exit(1);
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Unexpected smoke-test failure: ${message}`);
  process.exit(1);
});