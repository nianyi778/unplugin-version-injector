export interface VersionInjectorOptions {
  version?: string;  // 用户手动传递的版本号
  name?: string;     // 用户手动传递的包名
  log?: boolean; // 是否打印日志
  formatDate?: (date: Date) => string; // 自定义 build time 格式化
}
