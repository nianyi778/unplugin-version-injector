import fs from 'fs';
import path from 'path';

/** 获取 package.json 版本 */
export function getPackageVersion(): string {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return require(packageJsonPath).version;
    }
  } catch (error) {
    console.warn('[VersionInjector] Failed to read package.json:', error);
  }
  return '0.0.0';
}

/** 默认格式化 build time */
export function defaultFormatDate(date: Date): string {
  return date.toISOString();
}