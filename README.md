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
| `formatDate`     | `(date: Date) => string`          | Custom build time formatter                            | ISO 8601 format        |
| `requestHeaders` | `boolean \| RequestHeadersOptions` | Attach version/build-time headers to outgoing requests | `false`                |

> `version` and `name` can be provided independently — whichever is missing falls back to the nearest `package.json`.

---

## 📡 Request Headers (identify clients in backend logs)

Enable `requestHeaders` to patch `window.fetch` and `XMLHttpRequest` so every API request carries the client version — making it trivial to tell which client build produced a request in backend/API logs:

```ts
versionInjector({
  requestHeaders: true, // same-origin requests only
});
```

Every same-origin request then includes:

```
X-Client-Version: my-app/1.2.3
X-Client-Build-Time: 2024-04-01T12:00:00.000Z
```

Full configuration:

```ts
versionInjector({
  requestHeaders: {
    versionHeaderName: 'X-Client-Version',      // default
    buildTimeHeaderName: 'X-Client-Build-Time', // default
    // Cross-origin URLs to include (string = URL prefix, RegExp = full URL test).
    // Same-origin requests are always included.
    include: ['https://api.example.com/', /\.internal\.example\.com/],
  },
});
```

> ⚠️ **CORS**: custom headers on cross-origin requests trigger a preflight — the server must allow them via `Access-Control-Allow-Headers`. That's why cross-origin injection is opt-in through `include`.
>
> Note: `navigator.sendBeacon` and WebSocket connections cannot carry custom headers; the patch covers `fetch` and `XMLHttpRequest` (which includes axios and most HTTP clients).

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
