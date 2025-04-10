import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function getPackageVersion(): string {
  try {
    // 获取当前文件路径（支持 esm）
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // 向上寻找 package.json
    let dir = __dirname;
    while (dir !== path.parse(dir).root) {
      const pkgPath = path.join(dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const content = fs.readFileSync(pkgPath, 'utf-8');
        const pkg = JSON.parse(content);
        return pkg.version || '0.0.0';
      }
      dir = path.dirname(dir); // 上一级
    }

    console.warn('[VersionInjector] package.json not found');
    return '0.0.0';
  } catch (err) {
    console.warn('[VersionInjector] Failed to read package.json:', err);
    return '0.0.0';
  }
}
/** 默认格式化 build time */
export function defaultFormatDate(date: Date): string {
  return date.toISOString();
}
