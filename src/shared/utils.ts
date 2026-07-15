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

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function pad(num: number): string {
  return num < 10 ? '0' + num : String(num);
}

/**
 * 轻量级日期格式化，支持 dayjs 常用 token（无需额外依赖）
 * @example formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2024-04-01 12:30:45"
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ms = date.getMilliseconds();
  const dayOfWeek = date.getDay();

  const tokens: Record<string, string> = {
    YYYY: String(year),
    YY: String(year).slice(-2),
    MMMM: MONTHS_FULL[month],
    MMM: MONTHS_SHORT[month],
    MM: pad(month + 1),
    M: String(month + 1),
    DD: pad(day),
    D: String(day),
    dddd: WEEKDAYS_FULL[dayOfWeek],
    ddd: WEEKDAYS_SHORT[dayOfWeek],
    dd: WEEKDAYS_SHORT[dayOfWeek].slice(0, 2),
    d: String(dayOfWeek),
    HH: pad(hours),
    H: String(hours),
    hh: pad(hours % 12 || 12),
    h: String(hours % 12 || 12),
    mm: pad(minutes),
    m: String(minutes),
    ss: pad(seconds),
    s: String(seconds),
    SSS: pad(ms),
    SS: pad(Math.floor(ms / 10)),
    S: String(Math.floor(ms / 100)),
    A: hours < 12 ? 'AM' : 'PM',
    a: hours < 12 ? 'am' : 'pm',
  };

  return format.replace(/YYYY|YY|MMMM|MMM|MM|M|DD|D|dddd|ddd|dd|d|HH|H|hh|h|mm|m|ss|s|SSS|SS|S|A|a/g, (match) => tokens[match]);
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
