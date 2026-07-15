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
| `formatDate` | `(date: Date) => string` | 自定义时间格式函数         | ISO 格式            |
| `requestHeaders` | `boolean \| RequestHeadersOptions` | 给发出的请求自动附加版本/构建时间请求头 | `false`  |

> `version` 和 `name` 可以单独传入，缺失的一项会自动从最近的 `package.json` 读取。

---

## **📡 请求头注入（后端日志定位客户端版本）**

开启 `requestHeaders` 后，插件会在页面最前面 patch `window.fetch` 和 `XMLHttpRequest`，让所有 API 请求自动带上版本信息——排查前后端请求日志时可以直接看出是哪个客户端、哪个版本发出的请求：

```ts
versionInjector({
  requestHeaders: true, // 默认仅同源请求
});
```

之后每个同源请求都会带上：

```
X-Client-Version: my-app/1.2.3
X-Client-Build-Time: 2024-04-01T12:00:00.000Z
```

完整配置：

```ts
versionInjector({
  requestHeaders: {
    versionHeaderName: 'X-Client-Version',      // 默认值
    buildTimeHeaderName: 'X-Client-Build-Time', // 默认值
    // 跨域白名单：字符串按 URL 前缀匹配，正则按完整 URL 测试；同源请求始终注入
    include: ['https://api.example.com/', /\.internal\.example\.com/],
  },
});
```

> ⚠️ **CORS 注意**：给跨域请求加自定义头会触发预检（preflight），服务端必须在 `Access-Control-Allow-Headers` 中放行这两个头，否则请求会失败——所以跨域注入设计为通过 `include` 显式开启。
>
> 说明：`navigator.sendBeacon` 和 WebSocket 无法携带自定义请求头；补丁覆盖 `fetch` 与 `XMLHttpRequest`（axios 等主流 HTTP 客户端底层都走这两条路）。

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
