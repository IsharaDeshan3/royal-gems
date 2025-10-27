export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const csrf = document.cookie.split('; ').find(r => r.startsWith('csrfToken='))?.split('=')[1] || '';
  const resp = await fetch(input, {
    ...init,
    headers: {
      'x-csrf-token': csrf,
      ...(init.headers || {}),
    },
    credentials: 'include',
  });
  if (resp.status === 401) {
    // Try refresh once
    await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
    return fetch(input, {
      ...init,
      headers: { 'x-csrf-token': csrf, ...(init.headers || {}) },
      credentials: 'include',
    });
  }
  return resp;
}
