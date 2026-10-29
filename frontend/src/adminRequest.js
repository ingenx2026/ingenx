import { API_BASE } from './apiConfig';

// Only read requests retry automatically; mutations must never be replayed here.
export async function adminRequest(path, method = 'GET', body, token) {
  const attempts = method === 'GET' ? 2 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(`${API_BASE}/api/${path}`, {
        method, signal: controller.signal, cache: 'no-store',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        const error = new Error(data?.error?.message || 'The server could not load this request. Please retry.');
        error.status = response.status;
        throw error;
      }
      return data;
    } catch (error) {
      const temporary = !error.status || error.status >= 500;
      if (temporary && attempt + 1 < attempts) continue;
      if (error.name === 'AbortError') throw new Error('The server took too long to respond. Please retry.');
      if (!error.status) throw new Error('Connection interrupted. Check your internet connection and retry.');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
}
