import { getPackageVersion, defaultFormatDate } from './shared/utils';

export function createVersionInjector(options: any = {}) {
  const version = options.version ?? getPackageVersion();
  const buildTime = (options.formatDate ?? defaultFormatDate)(new Date());

  const metaTag = `<meta name="version" content="${version}">\n`;
  const logScript = `<script data-injected="unplugin-version-injector">console.log(...)</script>`;

  return function processHtml(html: string) {
    if (!html.includes('<meta name="version"')) {
      html = html.replace(/<head>/, `<head>\n  ${metaTag}`);
    }
    if (!html.includes('<script data-injected="unplugin-version-injector"')) {
      html = html.replace('</body>', `  ${logScript}\n</body>`);
    }
    return html;
  };
}