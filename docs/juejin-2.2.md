# 线上出 Bug，你还在让用户"清一下缓存"？我用一个插件让每个请求自报版本

> `unplugin-version-injector` 2.2 发布：一次接入，Vite / Webpack / Rspack / Rollup / Rolldown 全支持，自动把版本号、构建时间注入页面**和请求头**。

## 一个所有前端都遇到过的场景

线上报了个诡异的 Bug。你本地复现不出来，问用户，用户说："我这边好好的啊。"

问题来了——**你根本不知道 ta 现在跑的是哪个版本的前端**：

- CDN 缓存还是旧的，用户加载的是三天前的构建；
- 你们在灰度，一半人新版本一半人旧版本；
- 多环境（dev / sandbox / staging / prod）搞混了。

翻后端日志，一堆请求整整齐齐，但**没有一条能告诉你"这是哪个前端构建发出来的"**。于是排查从"看代码"变成了"猜版本"。

这件事的本质是：**前端的版本信息，没有跟着请求一起流动到后端。**

`unplugin-version-injector` 想解决的就是这个问题。2.2 版本，它把这件事做完整了。

## 30 秒上手

```bash
pnpm add -D unplugin-version-injector
```

按你的构建工具，一行接入（子路径对应各自的适配器）：

```ts
// Vite
import versionInjector from 'unplugin-version-injector/vite';
export default { plugins: [versionInjector()] };
```

```js
// Webpack 4/5
const versionInjector = require('unplugin-version-injector/webpack');
module.exports = { plugins: [versionInjector()] };
```

```js
// Rspack / Rollup / Rolldown 同理
const versionInjector = require('unplugin-version-injector/rspack');
```

不传任何参数，它会自动读取最近的 `package.json`，往产物 HTML 里注入：

```html
<head>
  <meta name="version" content="my-app/1.2.3">
  <meta name="project" content="my-app">
</head>
```

并在控制台打印一条带样式、自动适配深浅色的构建信息 banner：

```
 my-app@1.2.3
 Build Time: 2024-04-01 12:00:00
```

打开线上页面 F12，版本一目了然。这是基础操作。真正解决开头那个痛点的，是下面这个。

## ⭐ 2.2 主角：让每个请求自报版本

开启 `requestHeaders`，插件会在页面**最前面**注入一段脚本，patch `window.fetch` 和 `XMLHttpRequest`，给请求自动带上两个头：

```ts
versionInjector({ requestHeaders: true });
```

之后每个请求都会带上：

```
X-Client-Version: my-app/1.2.3
X-Client-Build-Time: 2024-04-01 12:00:00
```

从此后端日志里，每条请求都自带前端版本。线上定位问题，直接按版本号过滤日志——**再也不用猜、不用问用户清缓存了。**

因为拦的是底层的 `fetch` / `XHR`，所以 **axios、umi-request 等主流库全部自动生效**，你的业务代码一行都不用改。

## requestHeaders 全场景配置

`requestHeaders` 默认**关闭**，且默认**只给同源请求注入**（安全、不制造无谓的跨域预检）。下面把所有场景过一遍。

### 场景 1：同源

页面和 API 同域，或本地走 dev-server 代理（请求发到 `/api`，浏览器视角同源）：

```ts
versionInjector({ requestHeaders: true }); // true = 默认配置，仅同源
```

### 场景 2：自定义头名称

```ts
versionInjector({
  requestHeaders: {
    versionHeaderName: 'X-App-Version',
    buildTimeHeaderName: 'X-App-Build',
  },
});
```

### 场景 3：单个跨域 API（生产最常见）

前端和 API 不同源，把域名加进 `include`（字符串按 URL 前缀匹配）：

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
      /^https:\/\/[^/]*\.example\.com\//, // *.example.com 所有子域
    ],
  },
});
```

### 场景 5：Monorepo + 全跨域（最难，也最值得说）⭐

这是我在真实项目里踩得最多的场景：**一个 monorepo 里多个子应用共用一份构建配置，每个应用又连着不同环境（dev / sandbox / prod）的跨域 API。** 硬编码域名根本没法维护。

两个关键点：

**① `include` 只在共享的根配置里写一次**，所有子包继承。别在每个子应用里各写一遍。

**② 域名随环境变，别硬编码——用环境变量动态拼。** 每个子应用的 `.env.*` 里通常已经有 API 域名变量，直接读：

```js
// 共享的根构建配置（webpack 为例）
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

这样 dev / sandbox / prod 各自带对应域名，构建时自动切换，一份配置全环境通用。

如果你们所有 API 都在固定几个主域名下，也可以一条正则收工（新增子域自动命中）：

```ts
versionInjector({
  requestHeaders: {
    include: [/^https:\/\/[^/]*\.(example\.io|example\.dev|sandbox-example\.com)\//],
  },
});
```

> 只把**你自己发 fetch/XHR、且能改 CORS 的 API 域名**放进去。CDN、第三方 SDK 脚本域（你控制不了 CORS）不要加，加了只会触发预检、把资源加载搞挂。

### ⚠️ 跨域必读：后端要配合放行

给跨域请求加自定义头，浏览器会先发一个 `OPTIONS` 预检。`include` 命中的**每一个** API 服务，都必须在响应里放行这两个头：

```
Access-Control-Allow-Headers: X-Client-Version, X-Client-Build-Time
```

哪个后端没配，哪个的请求就会被浏览器拦掉。多后端要逐个确认——这也是为什么跨域注入必须通过 `include` 显式开启，而不是默认全开。

### 排查小技巧：同源还是跨域？

打开 Network，看请求的**真实 URL**：

- `http://localhost:9040/api/...`（走 dev 代理）→ **同源**，`requestHeaders: true` 就够，不用 `include`；
- `https://api.xxx.com/...`（直连）→ **跨域**，必须进 `include` + 后端放行。

一个常见的坑：本地走代理是同源、生产直连是跨域。所以本地测好好的、上线后头没了——十有八九是生产的跨域域名没进 `include`，或后端没放行。

## 2.2 其他更新

- **新增 Rspack / Rolldown 适配**：现在五大构建工具（Vite / Webpack 4-5 / Rspack / Rollup / Rolldown）全覆盖。
- **`formatDate` 支持 dayjs 风格字符串**，且**零额外依赖**（内置轻量实现）。同时作用于控制台 banner 和 `X-Client-Build-Time` 头：

  ```ts
  versionInjector({ formatDate: 'YYYY-MM-DD HH:mm:ss' }); // 2024-04-01 12:30:45
  ```

- **完整 TypeScript 类型导出** + 规范的 `exports` 字段，ESM / CJS 双格式。
- **补齐单元测试**，26 个用例覆盖各构建工具与注入逻辑。
- **性能**：缓存 `package.json` 查找结果，多页 / watch 模式不重复读盘。

## 几个让我自己用得放心的细节

写这个插件时，有几个点是刻意打磨的：

- **同源始终注入、跨域显式白名单**：既省心又安全，不会莫名其妙给第三方域名发自定义头触发一堆预检。
- **构建时间每轮构建只算一次**：MPA 多页面时间戳保持一致，watch 模式重新构建也不会显示过期时间。
- **注入内容严格转义**：`name` / `version` 里的特殊字符会做 HTML 转义，内联脚本里的 `<` 会转义，避免破坏页面结构或提前闭合 `</script>`。
- **请求头值只保留可见 ASCII**：中文项目名之类的字符会被剔除，`setRequestHeader` 不会抛错。
- **注入脚本是纯 ES5**：老浏览器也能跑。

## 结语

版本注入是件小事，但"线上不知道用户跑哪个版本"是件大事。`unplugin-version-injector` 2.2 把它做成了一次接入、全构建工具通用、并且能一路带到后端日志的完整方案。

- npm：`pnpm add -D unplugin-version-injector`
- GitHub：https://github.com/nianyi778/unplugin-version-injector

如果它帮你省下了一次"猜版本"的排查，欢迎点个 Star ⭐
