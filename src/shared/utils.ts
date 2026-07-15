import fs from 'fs';
import path from 'path';

/**
 * 获取当前执行目录向上查找的最近的 package.json 中的版本号
 */
export function getPackageVersion(startDir?: string): { version: string; name: string } {
  try {
    let dir = startDir || process.cwd();

    while (true) {
      const pkgPath = path.join(dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return { version: pkg.version || '0.0.0', name: pkg.name || 'unknown' };
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }

    console.warn('[VersionInjector] package.json not found');
    return { version: '0.0.0', name: 'unknown' };
  } catch (err) {
    console.warn('[VersionInjector] Failed to read package.json:', err);
    return { version: '0.0.0', name: 'unknown' };
  }
}

/** 默认格式化 build time */
export function defaultFormatDate(date: Date): string {
  return date.toISOString();
}

/** 转义 HTML 属性值，防止 name/version 中的特殊字符破坏页面结构 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 序列化为 JS 字符串字面量，并转义 `<` 避免出现 `</script>` 提前闭合标签 */
export function toScriptString(value: string): string {
  return JSON.stringify(value).replace(/</g, '\\u003C');
}
