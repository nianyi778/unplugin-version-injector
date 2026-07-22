import { describe, expect, it } from 'vitest';
import { createVersionInjector } from '../src/core';

const HTML = '<html><head></head><body><div id="app"></div></body></html>';

describe('createVersionInjector', () => {
  it('injects meta tags and log script', () => {
    const inject = createVersionInjector({ version: '1.2.3', name: 'my-app' });
    const result = inject(HTML);

    expect(result).toContain('<meta name="version" content="1.2.3">');
    expect(result).toContain('<meta name="project" content="my-app">');
    expect(result).toContain('data-injected="unplugin-version-injector"');
    expect(result).toContain('my-app@1.2.3');
  });

  it('injects into <head> with attributes', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: 'app' });
    const result = inject('<html><head lang="en"><title>t</title></head><body></body></html>');

    expect(result).toContain('<head lang="en">');
    expect(result).toContain('<meta name="version" content="1.0.0">');
  });

  it('skips meta injection if a version meta already exists', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: 'app' });
    const html = '<html><head><meta name="version" content="9.9.9"></head><body></body></html>';
    const result = inject(html);

    expect(result).toContain('content="9.9.9"');
    expect(result).not.toContain('content="1.0.0"');
  });

  it('is idempotent when applied twice', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: 'app' });
    const once = inject(HTML);
    const twice = inject(once);

    expect(twice).toBe(once);
  });

  it('log: false skips the script but still injects meta', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: 'app', log: false });
    const result = inject(HTML);

    expect(result).toContain('<meta name="version" content="1.0.0">');
    expect(result).not.toContain('<script');
  });

  it('accepts version without name (falls back to package.json for name)', () => {
    const inject = createVersionInjector({ version: '7.7.7' });
    const result = inject(HTML);

    expect(result).toContain('<meta name="version" content="7.7.7">');
    // name 来自本仓库 package.json
    expect(result).toContain('<meta name="project" content="unplugin-version-injector">');
  });

  it('accepts name without version (falls back to package.json for version)', () => {
    const inject = createVersionInjector({ name: 'custom-name' });
    const result = inject(HTML);

    expect(result).toContain('<meta name="project" content="custom-name">');
    expect(result).toMatch(/<meta name="version" content="\d+\.\d+\.\d+">/);
  });

  it('uses custom formatDate', () => {
    const inject = createVersionInjector({
      version: '1.0.0',
      name: 'app',
      formatDate: () => 'FIXED-TIME',
    });
    const result = inject(HTML);

    expect(result).toContain('Build Time: FIXED-TIME');
  });

  it('supports formatDate string pattern', () => {
    const inject = createVersionInjector({
      version: '1.0.0',
      name: 'app',
      formatDate: 'YYYY-MM-DD',
    });
    const result = inject(HTML);

    // Should contain a date in YYYY-MM-DD format
    expect(result).toMatch(/Build Time: \d{4}-\d{2}-\d{2}/);
  });

  it('escapes special characters in meta attributes and script', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: '<bad>"name"</script>' });
    const result = inject(HTML);

    expect(result).toContain('content="&lt;bad&gt;&quot;name&quot;&lt;/script&gt;"');
    // script 字符串里 `<` 被转义，不会提前闭合 </script>
    expect(result).not.toContain('</script>"');
    expect(result).toContain('\\u003C');
  });

  it('injected script is plain ES5 (no template literals)', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: 'app' });
    const result = inject(HTML);
    const script = result.slice(result.indexOf('<script'), result.indexOf('</script>'));

    expect(script).not.toContain('`');
    expect(script).not.toContain('=>');
  });

  it('caches build time within a build and refreshes after resetBuildTime', () => {
    let n = 0;
    const inject = createVersionInjector({ version: '1.0.0', name: 'app', formatDate: () => 'T' + n++ });
    const first = inject(HTML);
    const second = inject(HTML); // 同一次构建：命中缓存，仍是 T0
    expect(first).toContain('Build Time: T0');
    expect(second).toContain('Build Time: T0');
    inject.resetBuildTime();
    expect(inject(HTML)).toContain('Build Time: T1'); // 重置后刷新
  });

  it('does not inject into a <header> element when there is no <head>', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: 'app' });
    const out = inject('<html><body><header>hi</header></body></html>');
    expect(out).not.toContain('<meta name="version"');
    expect(out).toContain('<header>hi</header>');
  });

  it('adds the CSP nonce to the injected script', () => {
    const inject = createVersionInjector({ version: '1.0.0', name: 'app', nonce: 'abc123' });
    expect(inject(HTML)).toContain('<script nonce="abc123"');
  });
});
