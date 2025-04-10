export interface VersionInjectorOptions {
  version?: string;
  formatDate?: (date: Date) => string;
  dateFormat?: string; // 新增
  injectToHead?: boolean;
  injectToBody?: boolean;
}