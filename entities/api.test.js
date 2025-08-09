import { beforeEach, afterEach, expect, test, vi } from 'vitest';

const mockResponse = { ok: true, json: () => Promise.resolve({}) };

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(mockResponse)));
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.REACT_APP_API_BASE_URL;
});

test('request uses provided API_BASE_URL', async () => {
  process.env.REACT_APP_API_BASE_URL = 'http://example.com/api/v1';
  const { request } = await import('./api.js');
  await request('/test');
  expect(fetch).toHaveBeenCalledWith('http://example.com/api/v1/test', expect.any(Object));
});

test('request falls back to default URL', async () => {
  const { request, API_BASE_URL } = await import('./api.js');
  await request('/test');
  expect(API_BASE_URL).toBe('http://localhost:3001/api/v1');
  expect(fetch).toHaveBeenCalledWith('http://localhost:3001/api/v1/test', expect.any(Object));
});
