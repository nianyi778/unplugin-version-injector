import path from 'node:path';
import fs from 'node:fs';

// Support both ESM and CJS: detect __dirname
const isESM = typeof __dirname === 'undefined';

function getCallerDir(): string {
  // try to infer the caller directory
  const _stack = new Error().stack;
  if (!_stack) return process.cwd();

  const stackLines = _stack.split('\n');
  const callerLine = stackLines.find((l) => l.includes('.js') || l.includes('.ts')) || '';
  const match = callerLine.match(/\((.*):\d+:\d+\)$/) || callerLine.match(/at (.*):\d+:\d+/);
  if (match) return path.dirname(match[1]);

  return process.cwd();
}

export function getPackageVersion(): string {
  try {
    const baseDir = getCallerDir();
    const pkgPath = path.resolve(baseDir, 'package.json');
    const content = fs.readFileSync(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    return pkg.version || '0.0.0';
  } catch (e) {
    console.warn('[VersionInjector] Failed to read package.json:', e);
    return '0.0.0';
  }
}

/** 默认格式化 build time */
export function defaultFormatDate(date: Date): string {
  return date.toISOString();
}
