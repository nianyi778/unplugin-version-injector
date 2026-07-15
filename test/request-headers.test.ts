import { describe, expect, it, vi } from 'vitest';
import { createVersionInjector, HEADERS_INJECTED_MARK } from '../src/core';

const HTML = '<html><head></head><body><div id="app"></div></body></html>';
const OPTIONS = { version: '1.2.3', name: 'my-app', formatDate: () => 'BUILD-TIME' };

/** 提取注入的 header script 内容，在伪造的浏览器环境中执行 */
function runHeaderScript(html: string, sandbox: Record<string, any>) {
  const start = html.indexOf(HEADERS_INJECTED_MARK);
  expect(start).toBeGreaterThan(-1);
  const body = html.slice(html.indexOf('>', start) + 1, html.indexOf('</script>', start));

  const fn = new Function(
    'window',
    'location',
    'document',
    'URL',
    'Headers',
    'Request',
    'XMLHttpRequest',
    body
  );
  fn(
    sandbox.window,
    sandbox.location,
    sandbox.document ?? { createElement: () => ({}) },
    URL,
    Headers,
    Request,
    sandbox.window.XMLHttpRequest
  );
}

function createSandbox() {
  const fetchCalls: Array<{ input: any; init: any }> = [];
  const originalFetch = vi.fn((input: any, init: any) => {
    fetchCalls.push({ input, init });
    return Promise.resolve('ok');
  });

  class FakeXHR {
    static sent: FakeXHR[] = [];
    url = '';
    headers: Record<string, string> = {};
    open(_method: string, url: string) {
      this.url = url;
    }
    send() {
      FakeXHR.sent.push(this);
    }
    setRequestHeader(name: string, value: string) {
      this.headers[name] = value;
    }
  }

  const sandbox = {
    window: { fetch: originalFetch, XMLHttpRequest: FakeXHR } as any,
    location: { href: 'https://app.example.com/index.html', protocol: 'https:', host: 'app.example.com' },
    fetchCalls,
    FakeXHR,
  };
  return sandbox;
}

describe('requestHeaders option', () => {
  it('is off by default', () => {
    const inject = createVersionInjector(OPTIONS);
    expect(inject(HTML)).not.toContain(HEADERS_INJECTED_MARK);
  });

  it('injects the patch script into <head> before body scripts', () => {
    const inject = createVersionInjector({ ...OPTIONS, requestHeaders: true });
    const result = inject(HTML);

    const headerAt = result.indexOf(HEADERS_INJECTED_MARK);
    const logAt = result.indexOf('data-injected="unplugin-version-injector">');
    expect(headerAt).toBeGreaterThan(-1);
    expect(result.indexOf('</head>')).toBeGreaterThan(headerAt);
    expect(logAt).toBeGreaterThan(headerAt);
  });

  it('is idempotent', () => {
    const inject = createVersionInjector({ ...OPTIONS, requestHeaders: true });
    const once = inject(HTML);
    expect(inject(once)).toBe(once);
  });

  it('rejects invalid header names', () => {
    expect(() =>
      createVersionInjector({ ...OPTIONS, requestHeaders: { versionHeaderName: 'bad name' } })
    ).toThrow(/invalid request header name/);
  });

  it('adds headers to same-origin fetch calls', async () => {
    const inject = createVersionInjector({ ...OPTIONS, requestHeaders: true });
    const sandbox = createSandbox();
    runHeaderScript(inject(HTML), sandbox);

    await sandbox.window.fetch('/api/users', { method: 'POST' });

    const { init } = sandbox.fetchCalls[0];
    expect(init.method).toBe('POST');
    expect(init.headers.get('X-Client-Version')).toBe('my-app/1.2.3');
    expect(init.headers.get('X-Client-Build-Time')).toBe('BUILD-TIME');
  });

  it('preserves existing headers and Request input', async () => {
    const inject = createVersionInjector({ ...OPTIONS, requestHeaders: true });
    const sandbox = createSandbox();
    runHeaderScript(inject(HTML), sandbox);

    await sandbox.window.fetch(
      new Request('https://app.example.com/api/x', { headers: { 'X-Custom': 'yes' } })
    );

    const { input, init } = sandbox.fetchCalls[0];
    expect(input).toBeInstanceOf(Request);
    expect(init.headers.get('X-Custom')).toBe('yes');
    expect(init.headers.get('X-Client-Version')).toBe('my-app/1.2.3');
  });

  it('skips cross-origin fetch calls by default', async () => {
    const inject = createVersionInjector({ ...OPTIONS, requestHeaders: true });
    const sandbox = createSandbox();
    runHeaderScript(inject(HTML), sandbox);

    await sandbox.window.fetch('https://other.example.com/api/x');

    expect(sandbox.fetchCalls[0].init).toBeUndefined();
  });

  it('include patterns opt cross-origin urls in (string prefix and RegExp)', async () => {
    const inject = createVersionInjector({
      ...OPTIONS,
      requestHeaders: { include: ['https://api.example.com/', /gateway\.example\.com/] },
    });
    const sandbox = createSandbox();
    runHeaderScript(inject(HTML), sandbox);

    await sandbox.window.fetch('https://api.example.com/v1/users');
    await sandbox.window.fetch('https://gateway.example.com/v1/orders');
    await sandbox.window.fetch('https://unrelated.example.com/x');

    expect(sandbox.fetchCalls[0].init.headers.get('X-Client-Version')).toBe('my-app/1.2.3');
    expect(sandbox.fetchCalls[1].init.headers.get('X-Client-Version')).toBe('my-app/1.2.3');
    expect(sandbox.fetchCalls[2].init).toBeUndefined();
  });

  it('adds headers to same-origin XHR and skips cross-origin', () => {
    const inject = createVersionInjector({ ...OPTIONS, requestHeaders: true });
    const sandbox = createSandbox();
    runHeaderScript(inject(HTML), sandbox);

    const same = new sandbox.window.XMLHttpRequest();
    same.open('GET', '/api/users');
    same.send();
    expect(same.headers['X-Client-Version']).toBe('my-app/1.2.3');
    expect(same.headers['X-Client-Build-Time']).toBe('BUILD-TIME');

    const cross = new sandbox.window.XMLHttpRequest();
    cross.open('GET', 'https://other.example.com/api');
    cross.send();
    expect(cross.headers).toEqual({});
  });

  it('supports custom header names', async () => {
    const inject = createVersionInjector({
      ...OPTIONS,
      requestHeaders: { versionHeaderName: 'X-App-Ver', buildTimeHeaderName: 'X-App-Built' },
    });
    const sandbox = createSandbox();
    runHeaderScript(inject(HTML), sandbox);

    await sandbox.window.fetch('/api');

    expect(sandbox.fetchCalls[0].init.headers.get('X-App-Ver')).toBe('my-app/1.2.3');
    expect(sandbox.fetchCalls[0].init.headers.get('X-App-Built')).toBe('BUILD-TIME');
  });

  it('injected header script is plain ES5', () => {
    const inject = createVersionInjector({ ...OPTIONS, requestHeaders: true });
    const result = inject(HTML);
    const start = result.indexOf(HEADERS_INJECTED_MARK);
    const script = result.slice(start, result.indexOf('</script>', start));

    expect(script).not.toContain('`');
    expect(script).not.toContain('=>');
    expect(script).not.toMatch(/\b(const|let)\b/);
  });
});
