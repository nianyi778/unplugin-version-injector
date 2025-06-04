import fs from 'fs';
import path from 'path';

/**
 * 获取当前执行目录向上查找的最近的 package.json 中的版本号
 */
export function getPackageVersion(startDir?: string): {version: string,name: string} {
  try {
    let dir = startDir || process.cwd();

    while (dir !== path.parse(dir).root) {
      const pkgPath = path.join(dir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        return { version: pkg.version || '0.0.0', name: pkg.name || 'unknown' };
      }
      dir = path.dirname(dir);
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