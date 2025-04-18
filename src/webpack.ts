import type { Compiler } from 'webpack';
import { createVersionInjector } from './core';

export default function versionInjectorPlugin(options = {}) {
  const inject = createVersionInjector(options);

  return {
    apply(compiler: Compiler) {
      const isWebpack5 = Boolean(compiler.webpack?.version?.startsWith('5'));

      compiler.hooks.compilation.tap('webpack-version-injector', (compilation: any) => {
        if (isWebpack5 && compiler.webpack) {
          const { Compilation, sources } = compiler.webpack;
          compilation.hooks.processAssets.tap(
            {
              name: 'webpack-version-injector',
              stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
            },
            (assets: Record<string, any>) => {
              for (const name in assets) {
                if (name.endsWith('.html')) {
                  const html = assets[name].source().toString();
                  const result = inject(html);
                  compilation.updateAsset(name, new sources.RawSource(result));
                }
              }
            }
          );
        } else {
          // ✅ Webpack 4 fallback with `webpack-sources`
          const RawSourceLegacy = require('webpack-sources').RawSource;
          compiler.hooks.emit.tapAsync('webpack-version-injector', (compilation, callback) => {
            for (const name in compilation.assets) {
              if (name.endsWith('.html')) {
                const html = compilation.assets[name].source().toString();
                const result = inject(html);
                compilation.assets[name] = new RawSourceLegacy(result);
              }
            }
            callback();
          });
        }
      });
    },
  };
}