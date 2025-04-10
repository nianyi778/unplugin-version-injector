import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function getCurrentDir(): string {
  try {
    // 在 ESM 中使用 import.meta.url
    return path.dirname(fileURLToPath(import.meta.url));
  } catch {
    // fallback（极少用到，保守写法）
    return process.cwd();
  }
}

export function getPackageVersion(): string {
  try {
    let dir = getCurrentDir();

    while (dir !== path.parse(dir).root) {
      const pkgPath = path.join(dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const content = fs.readFileSync(pkgPath, 'utf-8');
        const pkg = JSON.parse(content);
        return pkg.version ?? '0.0.0';
      }
      dir = path.dirname(dir);
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
