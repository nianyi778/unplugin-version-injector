# 🚀 `unplugin-version-injector` - Auto Inject Version & Build Time into HTML

[🇨🇳 中文文档](./README.zh-CN.md) | [🇺🇸 English README](./README.md)

---

## 📌 Introduction

`unplugin-version-injector` is a lightweight universal plugin that automatically injects **version number** and **build timestamp** into HTML files during build.  
It supports **Webpack 4/5**, **Vite**, and **Rollup**, and works perfectly in **SPA** and **MPA** projects.

---

## ✨ Features

- ✅ Auto-injects `<meta name="version">` into HTML `<head>`
- ✅ Auto-injects `<script>` to log version/build time to the browser console
- ✅ Supports Webpack 4, Webpack 5, Vite, and Rollup
- ✅ Supports Multi-Page Applications (MPA)
- ✅ Supports custom version & timestamp format
- ✅ Tiny, fast, and zero-runtime dependency

---

## 📦 Installation

```bash
# With npm
npm install -D unplugin-version-injector

# With yarn
yarn add -D unplugin-version-injector
```

---

## 🚀 Usage

### ✅ Vite

```ts
// vite.config.ts
import versionInjector from 'unplugin-version-injector/vite';

export default {
  plugins: [versionInjector()],
};
```

---

### ✅ Webpack 4 / 5

```js
// webpack.config.js
const versionInjector = require('unplugin-version-injector/webpack');

module.exports = {
  plugins: [
    versionInjector({
      version: '1.2.3',
      injectToHead: true,
      injectToBody: true,
    }),
  ],
};
```

---

### ✅ Rollup

```js
// rollup.config.js
import versionInjector from 'unplugin-version-injector/rollup';

export default {
  plugins: [
    versionInjector({
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
    }),
  ],
};
```

---

## 📜 Output Example

```html
<head>
  <meta name="version" content="1.2.3">
  <meta charset="UTF-8">
</head>
<body>
  <h1>Hello</h1>
  <script>
    console.log("%c Version: 1.2.3 ", "background: #222; color: #00ff00; font-size: 12px;");
    console.log("%c Build Time: 2025-04-10 14:00:00 ", "background: #222; color: #ffcc00; font-size: 12px;");
  </script>
</body>
```

✅ Console output example:

```
🟢 Version: 1.2.3
🟡 Build Time: 2025-04-10 14:00:00
```

---

## 🔧 Configuration Options

| Option         | Type                        | Default                           | Description |
|----------------|-----------------------------|-----------------------------------|-------------|
| `version`      | `string`                    | Auto from `package.json`          | Manually specify a version |
| `formatDate`   | `(date: Date) => string`    | `YYYY-MM-DD HH:mm:ss`             | Custom date formatter |
| `dateFormat`   | `string`                    | None                              | Uses `dayjs` to format time (requires installation) |
| `injectToHead` | `boolean`                   | `true`                            | Injects `<meta name="version">` into `<head>` |
| `injectToBody` | `boolean`                   | `true`                            | Injects version log `<script>` into `<body>` |

📦 If using `dateFormat`, please install `dayjs` manually:

```bash
npm install dayjs
```

---

## 📌 Custom Example

```ts
versionInjector({
  version: '2.0.0',
  injectToHead: true,
  injectToBody: false,
  dateFormat: 'YYYY/MM/DD HH:mm:ss',
});
```

---

## 🧪 Supported Build Tools

| Build Tool   | Supported | Description                      |
|--------------|-----------|----------------------------------|
| **Vite**     | ✅        | Uses `transformIndexHtml` hook  |
| **Webpack 5**| ✅        | Uses `processAssets` hook       |
| **Webpack 4**| ✅        | Uses `emit` hook                |
| **Rollup**   | ✅        | Uses `generateBundle` hook      |

---

## 💡 Use Cases

- 🧪 Quickly identify deployed version & build time
- 📅 Useful for deployment tracking / diagnostics
- ⚡️ No runtime cost – build-time only

---

## 📄 License

MIT © [Nian YI](https://github.com/nianyi778)

---

## 🤝 Contributing

Contributions are welcome!

GitHub Repo:  
[https://github.com/nianyi778/unplugin-version-injector](https://github.com/nianyi778/unplugin-version-injector)

---

🔥 `unplugin-version-injector` – The simplest way to track version and build time in your HTML!
