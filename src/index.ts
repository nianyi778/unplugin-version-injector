// Updated version with support for both `formatDate` and `dateFormat`

import { createUnplugin } from 'unplugin';
import { Compilation, sources } from 'webpack';
import type { Compiler } from 'webpack';
import type { VersionInjectorOptions } from './types';
import { getPackageVersion, defaultFormatDate } from './utils';

let dayjs: any;

const VersionInjectorPlugin = createUnplugin((options: VersionInjectorOptions = {}) => {
  const {
    version = getPackageVersion(),
    formatDate,
    dateFormat,
    injectToHead = true,
    injectToBody = true,
  } = options;

  // resolve date formatter
  let resolvedFormatDate: (d: Date) => string = defaultFormatDate;

  if (typeof formatDate === 'function') {
    resolvedFormatDate = formatDate;
  } else if (typeof dateFormat === 'string') {
    try {
      dayjs = require('dayjs');
      resolvedFormatDate = (d) => dayjs!(d).format(dateFormat);
    } catch (err) {
      console.warn('[unplugin-version-injector] To use `dateFormat`, please install `dayjs` manually.');
    }
  }

  if (!injectToHead && !injectToBody) {
    return { name: 'unplugin-version-injector' };
  }

  const buildTime = resolvedFormatDate(new Date());

  const metaTag = `<meta name="version" content="${version}">\n`;
  const logScript = `
  <script>
    console.log("%c Version: ${version} ", "background: #222; color: #00ff00; font-size: 12px; padding: 4px; border-radius: 4px;");
    console.log("%c Build Time: ${buildTime} ", "background: #222; color: #ffcc00; font-size: 12px; padding: 4px; border-radius: 4px;");
  </script>`;

  function processHtml(html: string): string {
    if (injectToHead && !html.includes('<meta name="version"')) {
      html = html.replace(/<head>/, `<head>\n  ${metaTag}`);
    }
    if (injectToBody && !html.includes('<script>console.log("%c Version:')) {
      html = html.replace('</body>', `  ${logScript}\n</body>`);
    }
    return html;
  }

  return {
    name: 'unplugin-version-injector',

    vite: {
      transformIndexHtml(html: string) {
        return processHtml(html);
      },
    },

    rollup: {
      generateBundle(_, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.type === 'asset' && file.fileName.endsWith('.html')) {
            file.source = processHtml(file.source as string);
          }
        }
      },
    },

    webpack(compiler: Compiler) {
      const isWebpack5 = typeof sources !== 'undefined' && sources.RawSource;

      if (isWebpack5) {
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
                  compilation.updateAsset(filename, new sources.RawSource(source));
                }
              });
            },
          );
        });
      } else {
        compiler.hooks.emit.tapAsync('unplugin-version-injector', (compilation, callback) => {
          Object.keys(compilation.assets).forEach((filename) => {
            if (filename.endsWith('.html')) {
              const rawSource = compilation.assets[filename].source().toString();
              const newSource = processHtml(rawSource);
              compilation.assets[filename] = new sources.RawSource(newSource);
            }
          });
          callback();
        });
      }
    },
  };
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VersionInjectorPlugin;
}

export default VersionInjectorPlugin;