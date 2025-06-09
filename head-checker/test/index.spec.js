import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('head-checker worker', () => {
  it('returns 400 when url parameter is missing (unit)', async () => {
    const request = new Request('http://example.com');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Missing 'url' parameter" });
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('handles OPTIONS request for CORS preflight', async () => {
    const request = new Request('http://example.com', { method: 'OPTIONS' });
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});
