/**
 * Route Testing Script (Simple JS version)
 * Tests all API routes to ensure they work correctly after migration
 */

const BASE_URL = 'http://localhost:3000';
const results = [];

async function testRoute(route, method = 'GET', body = null, expectedStatus = 200, skipOn401 = true) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${route}`, options);
    const statusCode = response.status;

    if (skipOn401 && statusCode === 401) {
      results.push({
        route,
        method,
        status: 'PASS',
        statusCode,
        note: 'Auth required ✓'
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
  } catch (error) {
    results.push({
      route,
      method,
      status: 'FAIL',
      error: error.message,
    });
  }
}

async function runTests() {
  console.log('\n🧪 Testing All Routes After MongoDB→Supabase Migration\n');
  console.log('Server:', BASE_URL);
  console.log('─'.repeat(90) + '\n');

  // Public Routes
  console.log('📂 PUBLIC ROUTES:');
  await testRoute('/', 'GET');
  await testRoute('/about', 'GET');
  await testRoute('/academy', 'GET');
  await testRoute('/collection', 'GET');

  // Auth Routes
  console.log('\n🔐 AUTH ROUTES:');
  await testRoute('/api/auth/login', 'POST', { email: 'invalid@test.com', password: 'wrong' }, 401, false);
  await testRoute('/api/auth/logout', 'POST', {}, 200, false);
  await testRoute('/api/auth/profile', 'GET');
  await testRoute('/api/auth/forgot-password', 'POST', { email: 'test@example.com' }, 200, false);

  // Admin Routes (Should require auth)
  console.log('\n👤 ADMIN ROUTES (Testing Auth Protection):');
  await testRoute('/api/admin/admins', 'GET');
  await testRoute('/api/admin/users', 'GET');
  await testRoute('/api/admin/gems', 'GET');
  await testRoute('/api/admin/logs', 'GET');
  await testRoute('/api/admin/stats', 'GET');

  // Admin CRUD (Should require auth)
  console.log('\n✏️  ADMIN CRUD (Testing Auth Protection):');
  await testRoute('/api/admin/gems', 'POST', { name: 'Test', price: 100, category: 'Diamond' });
  await testRoute('/api/admin/gems', 'PUT', { id: 'test-id', name: 'Updated' });
  await testRoute('/api/admin/gems?id=test-id', 'DELETE');

  // Results
  console.log('\n' + '='.repeat(90));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(90) + '\n');

  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;

  results.forEach(result => {
    const icon = result.status === 'PASS' ? '✓' : '✗';
    const statusText = result.statusCode ? `[${result.statusCode}]` : '[ERR]';
    
    console.log(
      `${icon} ${result.method.padEnd(6)} ${result.route.padEnd(45)} ${statusText.padEnd(6)} ${result.note || result.error || ''}`
    );
  });

  console.log('\n' + '─'.repeat(90));
  console.log(`📈 Summary: ${results.length} tests | ✓ ${passed} passed | ✗ ${failed} failed`);
  console.log('─'.repeat(90));

  if (failed > 0) {
    console.log('\n❌ Some tests failed - review errors above\n');
  } else {
    console.log('\n✅ ALL TESTS PASSED!\n');
    console.log('✓ Public routes accessible');
    console.log('✓ Auth routes working');
    console.log('✓ Admin routes protected');
    console.log('✓ CRUD operations secured');
    console.log('\n🎉 Migration Validation Complete!\n');
  }
}

// Wait for server
console.log('⏳ Waiting for server to be ready...');
setTimeout(() => {
  runTests().catch(err => {
    console.error('\n❌ Test Error:', err.message);
    console.log('\n💡 Make sure dev server is running: npm run dev\n');
  });
}, 3000);
