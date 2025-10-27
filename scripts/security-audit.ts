/**
 * Security Audit Script
 * Checks for common security issues before payment integration
 */

import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config({ path: '.env.local' });

interface SecurityIssue {
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  issue: string;
  file?: string;
  recommendation: string;
}

const issues: SecurityIssue[] = [];

console.log('🔒 SECURITY AUDIT - Pre-Payment Integration\n');
console.log('='.repeat(80) + '\n');

// 1. Check Environment Variables
console.log('📋 1. Environment Variables Security...');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    issues.push({
      severity: 'HIGH',
      category: 'Environment',
      issue: `Missing critical environment variable: ${varName}`,
      recommendation: 'Add this variable to .env.local before deployment'
    });
  }
});

// Check for exposed secrets
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  if (envContent.includes('mongodb') || envContent.includes('MONGODB')) {
    issues.push({
      severity: 'MEDIUM',
      category: 'Environment',
      issue: 'Old MongoDB credentials still present in .env.local',
      file: '.env.local',
      recommendation: 'Remove all MongoDB-related environment variables'
    });
  }
}

// Check .gitignore
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf-8');
  // Check for .env.local or .env* pattern
  if (!gitignore.includes('.env.local') && !gitignore.match(/^\.env\*$/m)) {
    issues.push({
      severity: 'HIGH',
      category: 'Source Control',
      issue: '.env.local not in .gitignore',
      file: '.gitignore',
      recommendation: 'Add .env.local or .env* to .gitignore to prevent credential exposure'
    });
  }
}

console.log('✓ Environment check complete\n');

// 2. Check for exposed secrets in code
console.log('📋 2. Hardcoded Secrets Check...');
const filesToCheck = [
  'lib/supabase.ts',
  'lib/auth/service.ts',
  'middleware.ts'
];

filesToCheck.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check for hardcoded API keys
    if (content.match(/['"]eyJ[a-zA-Z0-9_-]{20,}['"]/)) {
      issues.push({
        severity: 'HIGH',
        category: 'Hardcoded Secrets',
        issue: 'Potential hardcoded API key or token found',
        file,
        recommendation: 'Move all keys to environment variables'
      });
    }
    
    // Check for process.env usage without defaults
    const envMatches = content.match(/process\.env\.([A-Z_]+)!/g);
    if (envMatches) {
      issues.push({
        severity: 'MEDIUM',
        category: 'Environment Safety',
        issue: 'Using non-null assertion (!) on environment variables',
        file,
        recommendation: 'Add runtime validation for critical env vars'
      });
    }
  }
});

console.log('✓ Secrets check complete\n');

// 3. Check API Route Security
console.log('📋 3. API Route Security...');
const apiRoutes = [
  'app/api/auth/login/route.ts',
  'app/api/admin/gems/route.ts',
  'app/api/admin/users/route.ts'
];

apiRoutes.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check for authentication
    if (!content.includes('getCurrentUser') && !content.includes('auth')) {
      issues.push({
        severity: 'HIGH',
        category: 'Authentication',
        issue: 'Route may not have authentication check',
        file,
        recommendation: 'Verify all admin routes check user authentication'
      });
    }
    
    // Check for role-based access
    if (file.includes('admin') && !content.includes('role')) {
      issues.push({
        severity: 'HIGH',
        category: 'Authorization',
        issue: 'Admin route may not check user role',
        file,
        recommendation: 'Add role verification for admin routes'
      });
    }
    
    // Check for input validation (looking for validation libraries or manual checks)
    if ((content.includes('POST') || content.includes('PUT')) && 
        !content.includes('validation') &&
        !content.includes('validateInput') &&
        !content.includes('ValidationRule') &&
        !(content.includes('typeof') && content.includes('required'))) {
      issues.push({
        severity: 'MEDIUM',
        category: 'Input Validation',
        issue: 'Route may lack input validation',
        file,
        recommendation: 'Add input validation before processing requests'
      });
    }
  }
});

console.log('✓ API route check complete\n');

// 4. Check Dependencies
console.log('📋 4. Dependency Security...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  
  // Check for known vulnerable packages
  const vulnerablePatterns = ['mongoose', 'mongodb', 'jsonwebtoken'];
  vulnerablePatterns.forEach(pattern => {
    if (allDeps[pattern]) {
      issues.push({
        severity: 'HIGH',
        category: 'Dependencies',
        issue: `Old package still present: ${pattern}`,
        file: 'package.json',
        recommendation: 'Run: npm uninstall ' + pattern
      });
    }
  });
  
  // Check for missing security packages
  if (!allDeps['helmet']) {
    issues.push({
      severity: 'MEDIUM',
      category: 'Dependencies',
      issue: 'Missing security headers package',
      recommendation: 'Consider installing helmet for security headers'
    });
  }
}

console.log('✓ Dependency check complete\n');

// 5. CORS & Headers Check
console.log('📋 5. Security Headers Check...');
if (fs.existsSync('next.config.ts') || fs.existsSync('next.config.js')) {
  const configPath = fs.existsSync('next.config.ts') ? 'next.config.ts' : 'next.config.js';
  const content = fs.readFileSync(configPath, 'utf-8');
  
  if (!content.includes('headers')) {
    issues.push({
      severity: 'MEDIUM',
      category: 'Security Headers',
      issue: 'No security headers configured',
      file: configPath,
      recommendation: 'Add security headers (CSP, X-Frame-Options, etc.)'
    });
  }
}

console.log('✓ Headers check complete\n');

// 6. Payment-Specific Checks
console.log('📋 6. Payment Integration Readiness...');

// Check for HTTPS enforcement
if (fs.existsSync('middleware.ts')) {
  const content = fs.readFileSync('middleware.ts', 'utf-8');
  if (!content.includes('secure') && !content.includes('https')) {
    issues.push({
      severity: 'HIGH',
      category: 'Payment Security',
      issue: 'No HTTPS enforcement detected',
      recommendation: 'Enforce HTTPS for all payment-related routes'
    });
  }
}

// Check for rate limiting
const hasRateLimiting = fs.existsSync('lib/rate-limit.ts') || 
                       (fs.existsSync('middleware.ts') && 
                        fs.readFileSync('middleware.ts', 'utf-8').includes('rateLimit'));

if (!hasRateLimiting) {
  issues.push({
    severity: 'HIGH',
    category: 'Payment Security',
    issue: 'No rate limiting detected',
    recommendation: 'Implement rate limiting before adding payment endpoints'
  });
}

// Check for CSRF protection
const hasCSRF = fs.existsSync('lib/csrf.ts') || 
                (fs.existsSync('middleware.ts') && 
                 fs.readFileSync('middleware.ts', 'utf-8').includes('csrf'));

if (!hasCSRF) {
  issues.push({
    severity: 'HIGH',
    category: 'Payment Security',
    issue: 'No CSRF protection detected',
    recommendation: 'Implement CSRF tokens for payment forms'
  });
}

console.log('✓ Payment readiness check complete\n');

// 7. Database Security
console.log('📋 7. Database Security...');

// Check for Row Level Security usage
const repoFiles = fs.readdirSync('lib/repositories');
let usesRLS = false;
repoFiles.forEach(file => {
  if (file.endsWith('.ts')) {
    const content = fs.readFileSync(path.join('lib/repositories', file), 'utf-8');
    if (content.includes('rls') || content.includes('policies')) {
      usesRLS = true;
    }
  }
});

if (!usesRLS) {
  issues.push({
    severity: 'MEDIUM',
    category: 'Database Security',
    issue: 'Row Level Security (RLS) may not be enabled',
    recommendation: 'Ensure RLS is enabled on all Supabase tables'
  });
}

console.log('✓ Database security check complete\n');

// RESULTS
console.log('='.repeat(80));
console.log('📊 SECURITY AUDIT RESULTS');
console.log('='.repeat(80) + '\n');

const high = issues.filter(i => i.severity === 'HIGH');
const medium = issues.filter(i => i.severity === 'MEDIUM');
const low = issues.filter(i => i.severity === 'LOW');
const info = issues.filter(i => i.severity === 'INFO');

console.log(`🔴 HIGH Priority Issues: ${high.length}`);
console.log(`🟡 MEDIUM Priority Issues: ${medium.length}`);
console.log(`🟢 LOW Priority Issues: ${low.length}`);
console.log(`ℹ️  Informational: ${info.length}\n`);

if (issues.length === 0) {
  console.log('✅ No security issues found!\n');
  console.log('🎉 Your application is ready for payment integration!\n');
} else {
  console.log('Issues found:\n');
  
  // Print HIGH issues first
  if (high.length > 0) {
    console.log('🔴 HIGH PRIORITY:\n');
    high.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.category}] ${issue.issue}`);
      if (issue.file) console.log(`   File: ${issue.file}`);
      console.log(`   ⚡ Action: ${issue.recommendation}\n`);
    });
  }
  
  // Print MEDIUM issues
  if (medium.length > 0) {
    console.log('🟡 MEDIUM PRIORITY:\n');
    medium.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.category}] ${issue.issue}`);
      if (issue.file) console.log(`   File: ${issue.file}`);
      console.log(`   💡 Recommendation: ${issue.recommendation}\n`);
    });
  }
  
  // Print LOW issues
  if (low.length > 0) {
    console.log('🟢 LOW PRIORITY:\n');
    low.forEach((issue, i) => {
      console.log(`${i + 1}. [${issue.category}] ${issue.issue}`);
      if (issue.file) console.log(`   File: ${issue.file}`);
      console.log(`   📝 Note: ${issue.recommendation}\n`);
    });
  }
}

console.log('='.repeat(80));
console.log('🔐 PAYMENT INTEGRATION SECURITY CHECKLIST');
console.log('='.repeat(80) + '\n');

const checklist = [
  { item: 'HTTPS enforced in production', critical: true },
  { item: 'Rate limiting on payment endpoints', critical: true },
  { item: 'CSRF protection implemented', critical: true },
  { item: 'Input validation on payment forms', critical: true },
  { item: 'PayHere webhook signature verification', critical: true },
  { item: 'Payment amount verification (server-side)', critical: true },
  { item: 'Idempotency keys for payment requests', critical: true },
  { item: 'Audit logging for all payment actions', critical: false },
  { item: 'Error handling without exposing internals', critical: false },
  { item: 'Payment status stored in database', critical: true },
  { item: 'Transaction IDs properly validated', critical: true },
  { item: 'Customer data encrypted in transit', critical: true },
];

checklist.forEach((item, i) => {
  const icon = item.critical ? '🔴' : '🟡';
  console.log(`${icon} ${i + 1}. ${item.item}`);
});

console.log('\n' + '='.repeat(80));
console.log('📝 NEXT STEPS FOR PAYHERE INTEGRATION');
console.log('='.repeat(80) + '\n');

console.log('Before integrating PayHere:');
console.log('1. ✅ Fix all HIGH priority security issues');
console.log('2. ⚠️  Address MEDIUM priority issues');
console.log('3. 🔒 Implement rate limiting (critical for payments)');
console.log('4. 🛡️  Add CSRF protection');
console.log('5. 📜 Set up audit logging for payments');
console.log('6. 🔐 Get PayHere sandbox credentials');
console.log('7. 🧪 Test in sandbox mode first\n');

console.log('PayHere Security Requirements:');
console.log('• Store merchant_id and merchant_secret in environment variables');
console.log('• Never expose merchant_secret in client-side code');
console.log('• Verify webhook signatures from PayHere');
console.log('• Validate all payment amounts server-side');
console.log('• Use HTTPS only (required by PayHere)');
console.log('• Implement proper error handling\n');

if (high.length > 0) {
  console.log('⚠️  WARNING: Fix HIGH priority issues before payment integration!\n');
  process.exit(1);
} else {
  console.log('✅ Security baseline met. Address remaining issues before production.\n');
}
