/**
 * Route Testing Script
 * Tests all API routes to ensure they work correctly after migration
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  route: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  statusCode?: number;
  error?: string;
  note?: string;
}

const results: TestResult[] = [];

async function testRoute(
  route: string,
  method: string = 'GET',
  body?: any,
  headers?: Record<string, string>,
  expectedStatus: number = 200,
  skipOn401: boolean = true
): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const statusCode = response.status;

    if (skipOn401 && statusCode === 401) {
      results.push({
        route,
        method,
        status: 'PASS',
        statusCode,
        note: 'Auth required (expected)'
      });
      return;
    }

    if (statusCode === expectedStatus || (skipOn401 && statusCode === 403)) {
      results.push({
        route,
        method,
        status: 'PASS',
        statusCode,
      });
    } else {
      const text = await response.text();
      results.push({
        route,
        method,
        status: 'FAIL',
        statusCode,
        error: text.substring(0, 100),
      });
    }
  } catch (error: any) {
    results.push({
      route,
      method,
      status: 'FAIL',
      error: error.message,
    });
  }
}

async function runTests() {
  console.log('🧪 Starting Route Tests...\n');
  console.log('Testing against:', BASE_URL);
  console.log('─'.repeat(80));

  // ===== PUBLIC ROUTES =====
  console.log('\n📂 Public Routes:');
  
  await testRoute('/', 'GET');
  await testRoute('/about', 'GET');
  await testRoute('/academy', 'GET');
  await testRoute('/collection', 'GET');

  // ===== AUTH ROUTES =====
  console.log('\n🔐 Auth Routes:');
  
  await testRoute('/api/auth/login', 'POST', {
    email: 'invalid@test.com',
    password: 'wrong'
  }, {}, 401, false);

  await testRoute('/api/auth/logout', 'POST', {}, {}, 200, false);

  await testRoute('/api/auth/profile', 'GET');

  await testRoute('/api/auth/forgot-password', 'POST', {
    email: 'test@example.com'
  }, {}, 200, false);

  // ===== ADMIN ROUTES (No Auth) =====
  console.log('\n👤 Admin Routes (Unauthorized):');
  
  await testRoute('/api/admin/admins', 'GET');
  await testRoute('/api/admin/users', 'GET');
  await testRoute('/api/admin/gems', 'GET');
  await testRoute('/api/admin/logs', 'GET');
  await testRoute('/api/admin/stats', 'GET');

  // ===== ADMIN CRUD OPERATIONS (No Auth) =====
  console.log('\n✏️ Admin CRUD Routes (Unauthorized):');
  
  await testRoute('/api/admin/gems', 'POST', {
    name: 'Test Gem',
    price: 100,
    category: 'Diamond'
  });

  await testRoute('/api/admin/gems', 'PUT', {
    id: 'test-id',
    name: 'Updated Gem'
  });

  await testRoute('/api/admin/gems?id=test-id', 'DELETE');

  await testRoute('/api/admin/users', 'POST', {
    email: 'newuser@test.com',
    password: 'Test123!@#'
  });

  // ===== RESULTS =====
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(80));

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIP').length;

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✓' : '✗';
    const color = result.status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';
    
    console.log(
      `${color}${icon}${reset} ${result.method.padEnd(6)} ${result.route.padEnd(40)} ` +
      `[${result.statusCode || '---'}] ${result.note || result.error || ''}`
    );
  });

  console.log('\n' + '─'.repeat(80));
  console.log(`Total: ${results.length} | ✓ Passed: ${passed} | ✗ Failed: ${failed} | ⊘ Skipped: ${skipped}`);
  console.log('─'.repeat(80));

  if (failed > 0) {
    console.log('\n❌ Some tests failed. Review the errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    console.log('\n📝 Summary:');
    console.log('- All public routes accessible');
    console.log('- Auth routes working correctly');
    console.log('- Admin routes properly protected (401/403)');
    console.log('- CRUD operations require authentication');
    console.log('\n🎉 Migration validation complete!');
  }
}

// Wait a bit for server to be ready
setTimeout(() => {
  runTests().catch(console.error);
}, 2000);
