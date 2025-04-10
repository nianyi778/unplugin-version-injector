import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

function getDirname(): string {
  try {
    // @ts-ignore – only works in ESM
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      return path.dirname(fileURLToPath(import.meta.url));
    }
  } catch {
    // ignore
  }

  // fallback for CJS
  return __dirname;
}

export function getPackageVersion(): string {
  try {
    let dir = getDirname();

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
