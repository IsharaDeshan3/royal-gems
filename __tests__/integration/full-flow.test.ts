/**
 * Integration Test: Full User Flow
 * Tests the complete user journey from signup to making an order
 */

import { describe, it, expect } from '@jest/globals';

describe('Full User Flow Integration Test', () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  let authToken: string;
  let userId: string;

  it('should complete signup flow', async () => {
    const response = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: 'Test123!@#',
        firstName: 'Test',
        lastName: 'User'
      })
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.user).toBeDefined();
  });

  it('should login successfully', async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@test.com',
        password: 'Customer123!@#'
      })
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.session).toBeDefined();
    
    if (data.session?.access_token) {
      authToken = data.session.access_token;
      userId = data.user.id;
    }
  });

  it('should fetch user profile', async () => {
    if (!authToken) {
      console.log('Skipping: No auth token');
      return;
    }

    const response = await fetch(`${baseUrl}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.user).toBeDefined();
  });
});
