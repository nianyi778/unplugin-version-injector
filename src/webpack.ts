import type { Compiler } from 'webpack';
import { createVersionInjector } from './core';

export default function versionInjectorPlugin(options = {}) {
  const inject = createVersionInjector(options);

  return {
    apply(compiler: Compiler) {
      const isWebpack5 = compiler.webpack?.version?.startsWith('5');
      compiler.hooks.compilation.tap('webpack-version-injector', (compilation) => {
        if (isWebpack5) {
          const { Compilation, sources } = compiler.webpack;
          compilation.hooks.processAssets.tap(
            { name: 'webpack-version-injector', stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE },
            (assets) => {
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
          // Webpack 4 fallback
        }
      });
    },
  };
}