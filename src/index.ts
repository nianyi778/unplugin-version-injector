import { createUnplugin } from 'unplugin';
import { Compilation, sources } from 'webpack';
import type { VersionInjectorOptions } from './types';
import { getPackageVersion, defaultFormatDate } from './utils';

 const VersionInjectorPlugin = createUnplugin((options: VersionInjectorOptions = {}) => {

  const shouldInject = options.log !== false; // ✅ 只有 log: false 时不注入

  if (!shouldInject) {
    return { name: 'unplugin-version-injector' }; // ❌ 直接返回空插件，避免无意义的操作
  }

  const version = options.version || getPackageVersion();
  const buildTime = options.formatDate ? options.formatDate(new Date()) : defaultFormatDate(new Date());

  const metaTag = `<meta name="version" content="${version}">\n`;
  const logScript = `
  <script>
    console.log("%c Version: ${version} ", "background: #222; color: #00ff00; font-size: 12px; padding: 4px; border-radius: 4px;");
    console.log("%c Build Time: ${buildTime} ", "background: #222; color: #ffcc00; font-size: 12px; padding: 4px; border-radius: 4px;");
  </script>`;

  function processHtml(html: string): string {
    if (!html.includes('<meta name="version"')) {
      html = html.replace(/<head>/, `<head>\n  ${metaTag}`);
    }
    if (!html.includes('<script>console.log("%c Version:')) {
      html = html.replace('</body>', `  ${logScript}\n</body>`);
    }
    return html;
  }

  return {
    name: 'unplugin-version-injector',

    // ✅ Vite 适配
    vite: {
      transformIndexHtml(html: string) {
        return processHtml(html);
      }
    },

    // ✅ Webpack 适配
    webpack(compiler) {
      compiler.hooks.compilation.tap('unplugin-version-injector', (compilation: Compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'unplugin-version-injector',
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
          },
          (assets) => {
            Object.keys(assets).forEach((filename) => {
              if (filename.endsWith('.html')) {
                let source = assets[filename].source().toString();
                source = processHtml(source);

                compilation.updateAsset(
                  filename,
                  new sources.RawSource(source) // ✅ 修正 updateAsset 类型
                );
              }
            });
          }
        );
      });
    }
  };
});

// ✅ 兼容 Webpack / Vite / Rollup

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VersionInjectorPlugin; // ✅ 让 CommonJS 直接拿到
}

export default VersionInjectorPlugin;