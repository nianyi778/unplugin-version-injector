export interface RequestHeadersOptions {
  /** 版本头名称，值为 `${name}/${version}`，默认 'X-Client-Version' */
  versionHeaderName?: string;
  /** 构建时间头名称，值为 formatDate 的输出，默认 'X-Client-Build-Time' */
  buildTimeHeaderName?: string;
  /**
   * 额外注入的跨域地址白名单：字符串按 URL 前缀匹配，正则按完整 URL 测试。
   * 同源请求始终注入。注意：跨域自定义头会触发 CORS 预检，
   * 服务端需在 Access-Control-Allow-Headers 中放行这两个头。
   */
  include?: (string | RegExp)[];
}

export interface VersionInjectorOptions {
  version?: string;  // 用户手动传递的版本号
  name?: string;     // 用户手动传递的包名
  log?: boolean; // 是否打印日志
  formatDate?: (date: Date) => string; // 自定义 build time 格式化
  /**
   * 给页面发出的 fetch / XMLHttpRequest 请求自动附加版本与构建时间请求头，
   * 便于在后端日志中定位客户端版本。默认关闭；true 使用默认配置（仅同源）。
   */
  requestHeaders?: boolean | RequestHeadersOptions;
}
