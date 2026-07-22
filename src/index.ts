import { createRequire } from 'module';
import { createUnplugin } from 'unplugin';
import type { UnpluginFactory, UnpluginInstance } from 'unplugin';
import { createVersionInjector } from './core';
import type { VersionInjectorOptions } from './types';

export type { VersionInjectorOptions, RequestHeadersOptions } from './types';

const PLUGIN_NAME = 'unplugin-version-injector';

type InjectFn = (html: string) => string;

/** rollup / rolldown：处理 bundle 里的 HTML asset */
function injectBundleHtml(bundle: Record<string, any>, inject: InjectFn): void {
  for (const file of Object.values(bundle)) {
    if (file.type === 'asset' && file.fileName.endsWith('.html')) {
      const source =
        typeof file.source === 'string' ? file.source : Buffer.from(file.source).toString('utf-8');
      file.source = inject(source);
    }
  }
}

/** webpack 5 / rspack 共用实现，webpack 4 走 emit 兜底 */
function applyWebpackLike(compiler: any, inject: InjectFn): void {
  const api = compiler.webpack ?? compiler.rspack;

  if (api?.Compilation && api?.sources) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: any) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          // html-webpack-plugin 在 OPTIMIZE_INLINE 阶段产出 HTML，SUMMARIZE 保证跑在它之后
          stage: api.Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        (assets: Record<string, any>) => {
          for (const name of Object.keys(assets)) {
            if (name.endsWith('.html')) {
              const html = assets[name].source().toString();
              compilation.updateAsset(name, new api.sources.RawSource(inject(html)));
            }
          }
        }
      );
    });
  } else {
    // webpack 4 fallback with `webpack-sources`（CJS 直接用 require，ESM 走 createRequire）
    const requireFn =
      typeof require === 'function' ? require : createRequire(import.meta.url);
    const { RawSource } = requireFn('webpack-sources');
    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation: any, callback: () => void) => {
      for (const name of Object.keys(compilation.assets)) {
        if (name.endsWith('.html')) {
          const html = compilation.assets[name].source().toString();
          compilation.assets[name] = new RawSource(inject(html));
        }
      }
      callback();
    });
  }
}

export const unpluginFactory: UnpluginFactory<VersionInjectorOptions | undefined> = (
  options = {}
) => {
  const inject = createVersionInjector(options);

  return {
    name: PLUGIN_NAME,
    // 每轮（重）构建开始时重置构建时间缓存：watch 重建刷新时间，同一次构建里 MPA 各页保持一致
    buildStart() {
      inject.resetBuildTime();
    },
    vite: {
      transformIndexHtml(html: string) {
        return inject(html);
      },
    },
    rollup: {
      generateBundle(_outputOptions: unknown, bundle: Record<string, any>) {
        injectBundleHtml(bundle, inject);
      },
    },
    rolldown: {
      generateBundle(_outputOptions: unknown, bundle: Record<string, any>) {
        injectBundleHtml(bundle, inject);
      },
    },
    webpack(compiler) {
      applyWebpackLike(compiler, inject);
    },
    rspack(compiler) {
      applyWebpackLike(compiler, inject);
    },
  };
};

export const VersionInjector: UnpluginInstance<VersionInjectorOptions | undefined> =
  /* #__PURE__ */ createUnplugin(unpluginFactory);

export default VersionInjector;
