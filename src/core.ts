import { getPackageVersion, defaultFormatDate } from './shared/utils';
import { VersionInjectorOptions } from './types';


export function createVersionInjector(options: VersionInjectorOptions = {}) {
  const version = options.version ?? getPackageVersion();
  const buildTime = (options.formatDate ?? defaultFormatDate)(new Date());

  const metaTag = `<meta name="version" content="${version}">\n`;

  const logScript = `
<script data-injected="unplugin-version-injector">
  console.log("%c Version: ${version} ", "background: #222; color: #00ff00; font-size: 12px; padding: 4px; border-radius: 4px;");
  console.log("%c Build Time: ${buildTime} ", "background: #222; color: #ffcc00; font-size: 12px; padding: 4px; border-radius: 4px;");
</script>`;

  return function processHtml(html: string): string {
    if (!html.includes('<meta name="version"')) {
      html = html.replace(/<head>/i, `<head>\n  ${metaTag}`);
    }

    if (options.log !== false && !html.includes('data-injected="unplugin-version-injector"')) {
      html = html.replace(/<\/body>/i, `  ${logScript}\n</body>`);
    }

    return html;
  };
}