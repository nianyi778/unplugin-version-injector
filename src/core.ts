import { getPackageVersion, defaultFormatDate, escapeHtml, toScriptString } from './shared/utils';
import { VersionInjectorOptions, RequestHeadersOptions } from './types';

export const INJECTED_MARK = 'data-injected="unplugin-version-injector"';
export const HEADERS_INJECTED_MARK = 'data-injected="unplugin-version-injector-headers"';

// RFC 7230 token
const HEADER_NAME_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

interface NormalizedRequestHeaders {
  versionHeaderName: string;
  buildTimeHeaderName: string;
  include: (string | RegExp)[];
}

function normalizeRequestHeaders(
  opt: VersionInjectorOptions['requestHeaders']
): NormalizedRequestHeaders | null {
  if (!opt) return null;
  const o: RequestHeadersOptions = typeof opt === 'object' ? opt : {};
  const versionHeaderName = o.versionHeaderName ?? 'X-Client-Version';
  const buildTimeHeaderName = o.buildTimeHeaderName ?? 'X-Client-Build-Time';
  for (const h of [versionHeaderName, buildTimeHeaderName]) {
    if (!HEADER_NAME_RE.test(h)) {
      throw new Error(`[VersionInjector] invalid request header name: "${h}"`);
    }
  }
  return { versionHeaderName, buildTimeHeaderName, include: o.include ?? [] };
}

/** header 值只允许可见 ASCII，其他字符直接剔除，避免 setRequestHeader 抛错 */
function sanitizeHeaderValue(value: string): string {
  return value.replace(/[^\t\x20-\x7E]/g, '').trim();
}

function serializeInclude(patterns: (string | RegExp)[]): string {
  const items = patterns.map((p) =>
    typeof p === 'string'
      ? toScriptString(p)
      : `new RegExp(${toScriptString(p.source)}, ${toScriptString(p.flags)})`
  );
  return `[${items.join(', ')}]`;
}

export interface HtmlInjector {
  (html: string): string;
  /** 每轮构建开始时调用，重置缓存的构建时间 */
  resetBuildTime(): void;
}

// <head> 可能带属性（如 <head lang="en">）；要求属性前有空白，避免误匹配 <header>
const HEAD_OPEN_RE = /<head(\s[^>]*)?>/i;

export function createVersionInjector(options: VersionInjectorOptions = {}): HtmlInjector {
  // version / name 允许单独传（空字符串视为未传），缺哪个补哪个
  const pkg =
    options.version && options.name
      ? { version: options.version, name: options.name }
      : getPackageVersion();
  const version = options.version || pkg.version;
  const name = options.name || pkg.name;
  const formatDate = options.formatDate ?? defaultFormatDate;
  const headersConfig = normalizeRequestHeaders(options.requestHeaders);

  // 构建时间每轮构建只算一次（适配器在 buildStart/compilation 时重置）：
  // watch 模式不会显示过期时间，MPA 多页面的时间戳也保持一致
  let cachedBuildTime: string | null = null;
  const getBuildTime = () => {
    if (cachedBuildTime === null) cachedBuildTime = formatDate(new Date());
    return cachedBuildTime;
  };

  const metaTag = `<meta name="version" content="${escapeHtml(version)}">\n<meta name="project" content="${escapeHtml(name)}">\n`;

  // 注入的脚本保持纯 ES5，兼容老浏览器
  const buildLogScript = (buildTime: string) => `
<script ${INJECTED_MARK}>
  (function () {
    var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var bg = isDark ? '#ffffff' : '#1e1e1e';
    var base = 'background: ' + bg + '; border-radius: 4px; padding: 4px; font-size: 12px;';
    console.log('%c' + ${toScriptString(` ${name}@${version} `)}, base + ' color: #00c853;');
    console.log('%c' + ${toScriptString(` Build Time: ${buildTime} `)}, base + ' color: #ffab00;');
  })();
</script>`;

  // patch fetch / XHR，给同源（及 include 白名单）请求附加版本头；必须先于业务脚本执行
  const buildHeaderScript = (buildTime: string, cfg: NormalizedRequestHeaders) => {
    const versionValue = sanitizeHeaderValue(`${name}/${version}`);
    const buildValue = sanitizeHeaderValue(buildTime);
    return `
<script ${HEADERS_INJECTED_MARK}>
  (function () {
    if (window.__UVI_HEADERS_PATCHED__) return;
    window.__UVI_HEADERS_PATCHED__ = true;
    var VERSION_HEADER = ${toScriptString(cfg.versionHeaderName)};
    var BUILD_HEADER = ${toScriptString(cfg.buildTimeHeaderName)};
    var VERSION_VALUE = ${toScriptString(versionValue)};
    var BUILD_VALUE = ${toScriptString(buildValue)};
    var INCLUDE = ${serializeInclude(cfg.include)};

    function resolveUrl(url) {
      try {
        if (typeof URL === 'function') return new URL(url, location.href);
      } catch (e) {
        return null;
      }
      try {
        var a = document.createElement('a');
        a.href = url;
        return { protocol: a.protocol, host: a.host, href: a.href };
      } catch (e2) {
        return null;
      }
    }

    function shouldInject(url) {
      var u = resolveUrl(url == null ? '' : String(url));
      if (!u || (u.protocol !== 'http:' && u.protocol !== 'https:')) return false;
      if (u.protocol === location.protocol && u.host === location.host) return true;
      for (var i = 0; i < INCLUDE.length; i++) {
        var p = INCLUDE[i];
        if (typeof p === 'string' ? u.href.indexOf(p) === 0 : p.test(u.href)) return true;
      }
      return false;
    }

    if (typeof window.fetch === 'function' && typeof Headers === 'function') {
      var originalFetch = window.fetch;
      window.fetch = function (input, init) {
        try {
          var isRequest = typeof Request === 'function' && input instanceof Request;
          var url = isRequest ? input.url : String(input);
          if (shouldInject(url)) {
            var headers = new Headers(
              (init && init.headers) || (isRequest ? input.headers : undefined)
            );
            headers.set(VERSION_HEADER, VERSION_VALUE);
            headers.set(BUILD_HEADER, BUILD_VALUE);
            var copy = {};
            if (init) for (var k in init) copy[k] = init[k];
            copy.headers = headers;
            init = copy;
          }
        } catch (e) {}
        return originalFetch.call(this, input, init);
      };
    }

    if (window.XMLHttpRequest && XMLHttpRequest.prototype) {
      var proto = XMLHttpRequest.prototype;
      var originalOpen = proto.open;
      var originalSend = proto.send;
      if (originalOpen && originalSend) {
        proto.open = function (method, url) {
          try {
            this.__uviInject = shouldInject(url);
          } catch (e) {}
          return originalOpen.apply(this, arguments);
        };
        proto.send = function () {
          if (this.__uviInject) {
            try {
              this.setRequestHeader(VERSION_HEADER, VERSION_VALUE);
              this.setRequestHeader(BUILD_HEADER, BUILD_VALUE);
            } catch (e) {}
          }
          return originalSend.apply(this, arguments);
        };
      }
    }
  })();
</script>`;
  };

  return function processHtml(html: string): string {
    // 每次注入时取当前时间，watch/dev 模式下 rebuild 不会显示过期时间
    const buildTime = formatDate(new Date());

    if (!html.includes('<meta name="version"')) {
      // <head> 可能带属性（如 <head lang="en">），replace 用函数避免特殊字符 $ 的坑
      html = html.replace(/<head[^>]*>/i, (match) => `${match}\n  ${metaTag}`);
    }

    if (headersConfig && !html.includes(HEADERS_INJECTED_MARK)) {
      const headerScript = buildHeaderScript(buildTime, headersConfig);
      html = html.replace(/<head[^>]*>/i, (match) => `${match}\n  ${headerScript}\n`);
    }

    if (options.log !== false && !html.includes(INJECTED_MARK)) {
      const logScript = buildLogScript(buildTime);
      html = html.replace(/<\/body>/i, () => `  ${logScript}\n</body>`);
    }

    return html;
  };
}
