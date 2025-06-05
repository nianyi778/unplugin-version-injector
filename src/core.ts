import { getPackageVersion, defaultFormatDate } from './shared/utils';
import { VersionInjectorOptions } from './types';

export function createVersionInjector(options: VersionInjectorOptions = {}) {
  const { version, name } =
    options.version && options.name ? options : getPackageVersion();
  const buildTime = (options.formatDate ?? defaultFormatDate)(new Date());

  const metaTag = `<meta name="version" content="${version}">\n<meta name="project" content="${name}">\n`;

  const logScript = `
<script data-injected="unplugin-version-injector">
  (function () {
    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var bg = isDark ? '#ffffff' : '#1e1e1e' ;
    var border = 'border-radius: 4px; padding: 4px; font-size: 12px;';
    var styles = {
      version: \`background: \${bg}; color: #00c853; \${border}\`,
      time:    \`background: \${bg}; color: #ffab00; \${border}\`,
    };
    console.log("%c ${name}@${version} ", styles.version);
    console.log("%c Build Time: ${buildTime} ", styles.time);
  })();
</script>`;

  return function processHtml(html: string): string {
    if (!html.includes('<meta name="version"')) {
      html = html.replace(/<head>/i, `<head>\n  ${metaTag}`);
    }

    if (
      options.log !== false &&
      !html.includes('data-injected="unplugin-version-injector"')
    ) {
      html = html.replace(/<\/body>/i, `  ${logScript}\n</body>`);
    }

    return html;
  };
}