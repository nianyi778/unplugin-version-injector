### **🚀 `unplugin-version-injector` - 自动注入版本号与构建时间**

[🇬🇧 English README](./README.md) | [🇨🇳 中文文档](./README.zh-CN.md)

---

## **📌 插件简介**
`unplugin-version-injector` 是一个基于 [unplugin](https://github.com/unjs/unplugin) 的轻量级插件，可在构建时自动向所有 HTML 文件注入 **版本号**、**构建时间戳** 和 **项目名**。支持 **Vite、Webpack 4/5、Rspack、Rollup 和 Rolldown**，适用于 **SPA / MPA 项目**。

---

## **✨ 功能亮点**
✅ 自动注入 `<meta name="version">` 和 `<meta name="project">` 到 HTML `<head>`  
✅ 自动注入 `<script>`，控制台输出 `项目名`、`版本号` 和 `构建时间`  
✅ 支持 Vite、Webpack 4/5、Rspack、Rollup、Rolldown  
✅ 完美兼容多页面应用（MPA）  
✅ 支持自定义版本号、项目名、时间格式，默认读取 `package.json`  
✅ 控制台输出支持自动适配深/浅主题配色  
✅ 时间格式支持 dayjs 风格字符串（`YYYY-MM-DD HH:mm:ss`），零额外依赖  
✅ 可选：给 `fetch` / `XMLHttpRequest` 请求自动注入版本请求头（`X-Client-Version`），在后端日志中定位客户端版本  

---

## **📦 安装**
```bash
# 使用 yarn
yarn add -D unplugin-version-injector

# 使用 npm
npm install -D unplugin-version-injector
```

---

## **🚀 使用方法**

### **📌 Vite**
`vite.config.ts` 中配置：
```ts
import versionInjector from 'unplugin-version-injector/vite';

export default {
  plugins: [versionInjector()],
};
```

---

### **📌 Webpack 4/5**
`webpack.config.js` 中配置：
```js
const versionInjector = require('unplugin-version-injector/webpack');

module.exports = {
  plugins: [
    versionInjector({
      version: '1.2.3', // 可选，自定义版本号
      name: 'MyApp'     // 可选，自定义项目名
    }),
  ],
};
```

---

### **📌 Rspack**
`rspack.config.js` 中配置：
```js
const versionInjector = require('unplugin-version-injector/rspack');

module.exports = {
  plugins: [versionInjector()],
};
```

---

### **📌 Rollup**
`rollup.config.js` 中配置：
```js
import versionInjector from 'unplugin-version-injector/rollup';

export default {
  plugins: [versionInjector()],
};
```

---

### **📌 Rolldown**
`rolldown.config.js` 中配置：
```js
import versionInjector from 'unplugin-version-injector/rolldown';

export default {
  plugins: [versionInjector()],
};
```

---

## **🧪 示例输出**

构建后的 HTML 文件中将自动注入：

```html
<head>
  <meta name="version" content="1.2.3">
  <meta name="project" content="MyApp">
</head>
<body>
  ...
  <script data-injected="unplugin-version-injector">
    console.log(...);
  </script>
</body>
```

控制台输出（根据主题自适应配色）：

```
🟦 Project: MyApp
🟢 Version: 1.2.3
🟡 Build Time: 2024-06-04T12:00:00.000Z
```

---

## **🔧 配置项说明**

| 选项         | 类型      | 说明                             | 默认值              |
|--------------|-----------|----------------------------------|---------------------|
| `version`    | `string`  | 自定义版本号                     | 自动读取 package.json |
| `name`       | `string`  | 自定义项目名                     | 自动读取 package.json |
| `log`        | `boolean` | 是否输出控制台日志               | `true`              |
| `formatDate` | `string \| ((date: Date) => string)` | 自定义构建时间格式：支持 dayjs 风格字符串（如 `'YYYY-MM-DD HH:mm:ss'`）或函数 | ISO 格式 |
| `requestHeaders` | `boolean \| RequestHeadersOptions` | 给发出的请求自动附加版本/构建时间请求头 | `false`  |
| `nonce`      | `string`  | 给注入的内联 `<script>` 加 CSP nonce（严格 CSP 站点需设置） | —  |

> `version` 和 `name` 可以单独传入，缺失的一项会自动从最近的 `package.json` 读取。

---

## **📅 构建时间格式化 `formatDate`**

`formatDate` 支持两种写法，同时作用于**控制台构建时间**和 **`X-Client-Build-Time` 请求头**：

```ts
// 1) dayjs 风格字符串（内置轻量实现，无需安装 dayjs）
versionInjector({ formatDate: 'YYYY-MM-DD HH:mm:ss' }); // 2024-04-01 12:30:45

// 2) 自定义函数
versionInjector({ formatDate: (date) => date.getTime().toString() }); // 时间戳
```

支持的 token：`YYYY YY MMMM MMM MM M DD D dddd ddd dd d HH H hh h mm m ss s SSS SS S A a`。

---

## **📡 请求头注入（在后端日志中定位客户端版本）**

开启 `requestHeaders` 后，插件会在页面最前面 patch `window.fetch` 和 `XMLHttpRequest`，让请求自动带上版本与构建时间——排查前后端日志时，一眼就能看出是哪个客户端、哪个版本发出的请求。默认注入两个头：

```
X-Client-Version: my-app/1.2.3
X-Client-Build-Time: 2024-04-01 12:00:00
```

> 底层是 patch `fetch` / `XMLHttpRequest`，所以 **axios、umi-request 等主流库都自动生效**；`navigator.sendBeacon` 和 WebSocket 无法携带自定义头，不在覆盖范围。

### 子配置 `RequestHeadersOptions`

| 选项 | 类型 | 说明 | 默认值 |
|---|---|---|---|
| `versionHeaderName` | `string` | 版本头名称，值为 `${name}/${version}` | `'X-Client-Version'` |
| `buildTimeHeaderName` | `string` | 构建时间头名称，值为 `formatDate` 的输出 | `'X-Client-Build-Time'` |
| `include` | `(string \| RegExp)[]` | 额外注入的**跨域**地址白名单：字符串按 URL 前缀匹配，正则按完整 URL 测试。**同源请求始终注入** | `[]` |

### 场景 1：同源请求（最简单）

页面与 API 同域，或本地走 dev-server 代理（请求发到 `/api`，浏览器视角是同源）：

```ts
versionInjector({ requestHeaders: true }); // true = 默认配置，仅同源
```

### 场景 2：自定义请求头名称

```ts
versionInjector({
  requestHeaders: {
    versionHeaderName: 'X-App-Version',
    buildTimeHeaderName: 'X-App-Build',
  },
});
```

### 场景 3：单个跨域 API（生产最常见）

前端和 API 不同源，把 API 域名加进 `include`（字符串 = URL 前缀）：

```ts
versionInjector({
  requestHeaders: { include: ['https://api.example.com'] },
});
```

### 场景 4：多个跨域 API / 正则批量匹配

```ts
versionInjector({
  requestHeaders: {
    include: [
      'https://api.example.com',
      'https://auth.example.com',
      /^https:\/\/[^/]*\.example\.com\//, // 匹配 *.example.com 所有子域
    ],
  },
});
```

### 场景 5：Monorepo + 全跨域（最容易踩坑）⭐

多包共用一份构建配置、每个子应用又连不同环境（dev / sandbox / prod）的跨域 API——这是最难配的场景。两个关键点：

**① `include` 只需在共享的根配置里写一次**，所有子包继承即可（把插件放进共享的 `configureWebpack` / `vite` 配置）。

**② 域名随环境变化，别硬编码——用环境变量动态拼**。每个子应用的 `.env.*` 里通常已有 API 域名变量，直接读：

```js
// 共享的根构建配置（以 webpack 为例）
const versionInjector = require('unplugin-version-injector/webpack');

// 这些变量由各子应用 / 各环境的 .env 提供
const apiOrigins = [
  process.env.VUE_APP_API_ORIGIN,
  process.env.VUE_APP_SDK_API_ORIGIN,
  process.env.VUE_APP_USER_API_ORIGIN,
].filter(Boolean); // 去掉未定义的

module.exports = {
  configureWebpack: {
    plugins: [
      versionInjector({ requestHeaders: { include: apiOrigins } }),
    ],
  },
};
```

这样 dev / sandbox / prod 各自带对应域名，不用维护一份大清单。

若所有 API 都在固定的几个主域名下，也可以直接用一条正则（新增子域自动命中）：

```ts
versionInjector({
  requestHeaders: {
    include: [/^https:\/\/[^/]*\.(example\.io|example\.dev|sandbox-example\.com)\//],
  },
});
```

> 只把**你自己发 fetch/XHR、且能改 CORS 的 API 域名**放进去。CDN、第三方 SDK 脚本域（你控制不了 CORS）不要加，否则只会触发预检导致资源加载失败。

### ⚠️ 跨域必读：后端要放行（CORS 预检）

给跨域请求加自定义头，浏览器会先发一个 `OPTIONS` 预检。`include` 命中的**每一个** API 服务都必须在响应里放行这两个头，否则请求会被浏览器拦掉：

```
Access-Control-Allow-Headers: X-Client-Version, X-Client-Build-Time
```

多后端场景要逐个确认。这也是跨域注入必须通过 `include` 显式开启、而非默认全开的原因。

### 🔍 怎么判断请求是同源还是跨域？

打开浏览器 Network，看请求的**真实 URL**：
- `http://localhost:9040/api/...`（走 dev 代理）→ **同源**，`requestHeaders: true` 就够，不用 `include`；
- `https://api.xxx.com/...`（直连）→ **跨域**，必须加进 `include` + 后端放行。

---

## **🎨 控制台配色自动适配说明**
- 插件自动判断浏览器是否为暗色模式（`window.matchMedia('(prefers-color-scheme: dark')`）；
- 深色模式下将使用亮色字体以确保可读性；
- 你也可以重写 `<script>` 注入逻辑以自定义样式。

---

## **📜 开源许可**
MIT License © 2024 [Nian YI](https://github.com/nianyi778)

---

🔥 `unplugin-version-injector` —— 最轻巧的版本信息注入解决方案！
