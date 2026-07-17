# 🚀 `unplugin-version-injector` - Auto Inject Version & Build Time

[🇨🇳 中文文档](./README.zh-CN.md) | [🇬🇧 English README](./README.md)

---

## 📌 Introduction

`unplugin-version-injector` is a lightweight [unplugin](https://github.com/unjs/unplugin)-based plugin that automatically injects **version** and **build timestamp** into all HTML files. It supports **Vite**, **Webpack 4/5**, **Rspack**, **Rollup** and **Rolldown**, and works seamlessly with both **SPA** and **MPA** projects.

---

## ✨ Features

✅ Injects `<meta name="version">` and `<meta name="project">` into the `<head>`  
✅ Injects `<script>` into the `<body>` to log version, name, and build time  
✅ Supports Vite, Webpack 4/5, Rspack, Rollup, Rolldown  
✅ Fully compatible with Multi-Page Applications (MPA)  
✅ Customizable version, project name, date format, and theme-based console styling  
✅ Date format supports dayjs-style patterns (`YYYY-MM-DD HH:mm:ss`) with zero extra dependencies  
✅ Optional: attach a version header (`X-Client-Version`) to `fetch` / `XMLHttpRequest` requests to identify clients in backend logs  

---

## 📦 Installation

```bash
# Using npm
npm install -D unplugin-version-injector

# Using yarn
yarn add -D unplugin-version-injector

# Using pnpm
pnpm add -D unplugin-version-injector
```

---

## 🚀 Usage

### 📌 Vite

```ts
// vite.config.ts
import versionInjector from 'unplugin-version-injector/vite';

export default {
  plugins: [versionInjector()],
};
```

### 📌 Webpack 4/5

```js
// webpack.config.js
const versionInjector = require('unplugin-version-injector/webpack');

module.exports = {
  plugins: [
    versionInjector({
      version: '1.2.3', // Optional: manually specify version
    }),
  ],
};
```

### 📌 Rspack

```js
// rspack.config.js
const versionInjector = require('unplugin-version-injector/rspack');

module.exports = {
  plugins: [versionInjector()],
};
```

### 📌 Rollup

```js
// rollup.config.js
import versionInjector from 'unplugin-version-injector/rollup';

export default {
  plugins: [versionInjector()],
};
```

### 📌 Rolldown

```js
// rolldown.config.js
import versionInjector from 'unplugin-version-injector/rolldown';

export default {
  plugins: [versionInjector()],
};
```

---

## 🧪 Example Output

In your final HTML output:

```html
<head>
  <meta name="version" content="1.2.3">
  <meta name="project" content="my-project">
</head>
<body>
  <script data-injected="unplugin-version-injector">
    // console badges:
    //  my-project@1.2.3
    //  Build Time: 2024-04-01T12:00:00.000Z
  </script>
</body>
```

---

## 🔧 Configuration Options

| Option           | Type                              | Description                                            | Default                |
|------------------|-----------------------------------|--------------------------------------------------------|------------------------|
| `version`        | `string`                          | Custom version number                                  | Read from package.json |
| `name`           | `string`                          | Custom project name                                    | Read from package.json |
| `log`            | `boolean`                         | Whether to inject the console log script               | `true`                 |
| `formatDate`     | `string \| ((date: Date) => string)` | Custom build time format: a dayjs-style pattern (e.g. `'YYYY-MM-DD HH:mm:ss'`) or a function | ISO 8601 format        |
| `requestHeaders` | `boolean \| RequestHeadersOptions` | Attach version/build-time headers to outgoing requests | `false`                |

> `version` and `name` can be provided independently — whichever is missing falls back to the nearest `package.json`.

---

## 📅 Formatting build time (`formatDate`)

`formatDate` accepts two forms, and applies to both the **console banner** and the **`X-Client-Build-Time` header**:

```ts
// 1) dayjs-style pattern (built-in lightweight impl, no dayjs needed)
versionInjector({ formatDate: 'YYYY-MM-DD HH:mm:ss' }); // 2024-04-01 12:30:45

// 2) custom function
versionInjector({ formatDate: (date) => date.getTime().toString() }); // timestamp
```

Supported tokens: `YYYY YY MMMM MMM MM M DD D dddd ddd dd d HH H hh h mm m ss s SSS SS S A a`.

---

## 📡 Request Headers (identify clients in backend logs)

Enable `requestHeaders` to patch `window.fetch` and `XMLHttpRequest` so requests carry the client version and build time — making it trivial to tell which client build produced a request in backend/API logs. Two headers are injected by default:

```
X-Client-Version: my-app/1.2.3
X-Client-Build-Time: 2024-04-01 12:00:00
```

> Because it patches `fetch` / `XMLHttpRequest`, **axios and most HTTP clients work automatically**. `navigator.sendBeacon` and WebSocket connections cannot carry custom headers and are not covered.

### `RequestHeadersOptions`

| Option | Type | Description | Default |
|---|---|---|---|
| `versionHeaderName` | `string` | Version header name; value is `${name}/${version}` | `'X-Client-Version'` |
| `buildTimeHeaderName` | `string` | Build-time header name; value is the `formatDate` output | `'X-Client-Build-Time'` |
| `include` | `(string \| RegExp)[]` | Extra **cross-origin** allowlist: string = URL prefix, RegExp = full-URL test. **Same-origin requests are always injected** | `[]` |

### Scenario 1: same-origin (simplest)

Page and API share an origin, or you use a dev-server proxy (requests hit `/api`, which the browser treats as same-origin):

```ts
versionInjector({ requestHeaders: true }); // true = defaults, same-origin only
```

### Scenario 2: custom header names

```ts
versionInjector({
  requestHeaders: {
    versionHeaderName: 'X-App-Version',
    buildTimeHeaderName: 'X-App-Build',
  },
});
```

### Scenario 3: a single cross-origin API (most common in prod)

Front end and API are on different origins — add the API origin to `include` (string = URL prefix):

```ts
versionInjector({
  requestHeaders: { include: ['https://api.example.com'] },
});
```

### Scenario 4: multiple cross-origin APIs / RegExp

```ts
versionInjector({
  requestHeaders: {
    include: [
      'https://api.example.com',
      'https://auth.example.com',
      /^https:\/\/[^/]*\.example\.com\//, // any *.example.com subdomain
    ],
  },
});
```

### Scenario 5: Monorepo + all cross-origin (the trickiest) ⭐

Many packages share one build config, and each app talks to cross-origin APIs that differ per environment (dev / sandbox / prod). Two keys:

**1. Write `include` once in the shared root config** — every package inherits it (put the plugin in the shared `configureWebpack` / `vite` config).

**2. Don't hardcode origins — build them from env vars.** Each app's `.env.*` usually already defines its API origins:

```js
// shared root build config (webpack example)
const versionInjector = require('unplugin-version-injector/webpack');

// provided by each app / each environment's .env
const apiOrigins = [
  process.env.VUE_APP_API_ORIGIN,
  process.env.VUE_APP_SDK_API_ORIGIN,
  process.env.VUE_APP_USER_API_ORIGIN,
].filter(Boolean);

module.exports = {
  configureWebpack: {
    plugins: [
      versionInjector({ requestHeaders: { include: apiOrigins } }),
    ],
  },
};
```

dev / sandbox / prod each get the right origins automatically — no giant hardcoded list.

If all APIs live under a few fixed base domains, a single RegExp also works (new subdomains match automatically):

```ts
versionInjector({
  requestHeaders: {
    include: [/^https:\/\/[^/]*\.(example\.io|example\.dev|sandbox-example\.com)\//],
  },
});
```

> Only include API origins you actually `fetch`/`XHR` **and** whose CORS you control. Don't add CDNs or third-party SDK script hosts — that only triggers preflights and can break asset loading.

### ⚠️ Cross-origin requires backend cooperation (CORS preflight)

Custom headers on cross-origin requests trigger an `OPTIONS` preflight. **Every** API service matched by `include` must allow the two headers, or the browser blocks the request:

```
Access-Control-Allow-Headers: X-Client-Version, X-Client-Build-Time
```

This is exactly why cross-origin injection is opt-in via `include` rather than on by default.

### 🔍 Same-origin or cross-origin?

Open the browser Network tab and look at the request's **real URL**:
- `http://localhost:9040/api/...` (via dev proxy) → **same-origin**, `requestHeaders: true` is enough, no `include`.
- `https://api.xxx.com/...` (direct) → **cross-origin**, must be in `include` + backend must allow the headers.

---

## 🌍 Why Use This Plugin?

- 🛠 Plug and play
- 🚀 Helps identify deployed versions
- 📅 Track build timestamps
- 🎯 Works across major bundlers
- 🧩 Easily configurable

---

## 📜 License

MIT License © 2024 [Nian YI](https://github.com/nianyi778)

---

🔥 `unplugin-version-injector` – the simplest way to track version and build info!
