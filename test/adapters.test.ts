import fs from 'fs';
import os from 'os';
import path from 'path';
import { rollup, type Plugin as RollupPlugin } from 'rollup';
import webpack, { type Compiler } from 'webpack';
import { describe, expect, it } from 'vitest';
import rollupVersionInjector from '../src/rollup';
import viteVersionInjector from '../src/vite';
import webpackVersionInjector from '../src/webpack';

const HTML = '<html><head></head><body><div id="app"></div></body></html>';
const OPTIONS = { version: '1.2.3', name: 'my-app' };

describe('rollup adapter', () => {
  it('injects into emitted html assets', async () => {
    const emitHtml: RollupPlugin = {
      name: 'emit-html',
      resolveId: (id) => (id === 'entry.js' ? id : null),
      load: (id) => (id === 'entry.js' ? 'console.log(1)' : null),
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'index.html', source: HTML });
      },
    };

    const bundle = await rollup({
      input: 'entry.js',
      plugins: [emitHtml, rollupVersionInjector(OPTIONS)],
    });
    const { output } = await bundle.generate({ format: 'es' });
    await bundle.close();

    const html = output.find((f) => f.fileName === 'index.html');
    expect(html).toBeDefined();
    const source = (html as any).source.toString();
    expect(source).toContain('<meta name="version" content="1.2.3">');
    expect(source).toContain('my-app@1.2.3');
  });

  it('log: false still injects meta but no script', async () => {
    const emitHtml: RollupPlugin = {
      name: 'emit-html',
      resolveId: (id) => (id === 'entry.js' ? id : null),
      load: (id) => (id === 'entry.js' ? 'console.log(1)' : null),
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'index.html', source: HTML });
      },
    };

    const bundle = await rollup({
      input: 'entry.js',
      plugins: [emitHtml, rollupVersionInjector({ ...OPTIONS, log: false })],
    });
    const { output } = await bundle.generate({ format: 'es' });
    await bundle.close();

    const source = (output.find((f) => f.fileName === 'index.html') as any).source.toString();
    expect(source).toContain('<meta name="version" content="1.2.3">');
    expect(source).not.toContain('<script');
  });
});

describe('vite adapter', () => {
  it('exposes transformIndexHtml that injects', () => {
    const plugin = viteVersionInjector(OPTIONS) as any;
    const hook = plugin.transformIndexHtml;
    const fn = typeof hook === 'function' ? hook : hook.handler ?? hook.transform;

    const result = fn(HTML);
    expect(result).toContain('<meta name="version" content="1.2.3">');
    expect(result).toContain('my-app@1.2.3');
  });
});

describe('webpack adapter', () => {
  it('injects into html assets after processAssets', async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'uvi-webpack-'));
    const entryFile = path.join(tmpDir, 'entry.js');
    fs.writeFileSync(entryFile, 'console.log(1)');

    const emitHtmlPlugin = {
      apply(compiler: Compiler) {
        compiler.hooks.compilation.tap('emit-html', (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: 'emit-html',
              stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
            },
            () => {
              compilation.emitAsset('index.html', new webpack.sources.RawSource(HTML));
            }
          );
        });
      },
    };

    const stats = await new Promise<webpack.Stats>((resolve, reject) => {
      webpack(
        {
          mode: 'production',
          entry: entryFile,
          output: { path: path.join(tmpDir, 'dist') },
          plugins: [emitHtmlPlugin, webpackVersionInjector(OPTIONS)],
        },
        (err, result) => (err || !result ? reject(err) : resolve(result))
      );
    });

    expect(stats.hasErrors()).toBe(false);
    const html = fs.readFileSync(path.join(tmpDir, 'dist', 'index.html'), 'utf-8');
    expect(html).toContain('<meta name="version" content="1.2.3">');
    expect(html).toContain('my-app@1.2.3');

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});
