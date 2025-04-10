import { versionInjectorPlugin } from './core';
import type { VersionInjectorOptions } from './types';

// 真正的插件工厂函数
function versionInjector(options: VersionInjectorOptions = {}) {
  return versionInjectorPlugin.webpack(options);
}

// ✅ 同时导出 ESModule 和 CommonJS 格式
export default versionInjector;

// ✅ 为 require() 提供兼容：自动注入到 module.exports
// @ts-ignore
if (typeof module !== 'undefined') {
  // @ts-ignore
  module.exports = versionInjector;
  // @ts-ignore
  module.exports.default = versionInjector;
}