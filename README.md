# 🚀 `unplugin-version-injector` – Auto Inject Version & Build Time

[🇨🇳 中文文档](./README.zh-CN.md) | [🇺🇸 English README](./README.md)

---

## 📌 Introduction

**`unplugin-version-injector`** is a lightweight plugin that automatically injects **version number** and **build timestamp** into all your HTML files.

### ✨ Features

- ✅ Auto-injects `<meta name="version">` into `<head>`
- ✅ Auto-injects `<script>` for version & build log
- ✅ Supports **Vite**, **Webpack 4/5**, and **Rollup**
- ✅ Works with **SPA / MPA**
- ✅ Fully configurable and tree-shakable

---

## 📦 Installation

```bash
# npm
npm install -D unplugin-version-injector

# yarn
yarn add -D unplugin-version-injector

# pnpm
pnpm add -D unplugin-version-injector
```

---

## 🚀 Usage

### ▶ Vite

```ts
// vite.config.ts
import versionInjector from 'unplugin-version-injector/vite'

export default {
  plugins: [versionInjector()],
}
```

---

### ▶ Webpack (4 or 5)

```js
// webpack.config.js
const versionInjector = require('unplugin-version-injector/webpack')

module.exports = {
  plugins: [
    versionInjector({
      version: '1.2.3', // Optional custom version
    }),
  ],
}
```

---

### ▶ Rollup

```js
// rollup.config.js
import versionInjector from 'unplugin-version-injector/rollup'

export default {
  plugins: [versionInjector()],
}
```

---

## 📜 Output Example

### Injected into HTML

```html
<head>
  <meta name="version" content="1.2.3">
</head>
<body>
  ...
  <script data-injected="unplugin-version-injector">
    console.log("%c Version: 1.2.3 ", "background:#222; color:#00ff00;");
    console.log("%c Build Time: 2024-03-01T12:00:00Z ", "background:#222; color:#ffcc00;");
  </script>
</body>
```

---

## 🔧 Options

| Option       | Type      | Description                              | Default                  |
|--------------|-----------|------------------------------------------|--------------------------|
| `version`    | `string`  | Custom version string                    | From `package.json`      |
| `log`        | `boolean` | Whether to inject `<script>` console log | `true`                   |
| `dateFormat` | `string`  | Use `dayjs` format string (if installed) | ISO timestamp string     |
| `formatDate` | `fn`      | Custom function for formatting date      | `date.toISOString()`     |

```ts
versionInjector({
  version: '2.0.0',
  log: false,
  dateFormat: 'YYYY-MM-DD HH:mm:ss', // requires dayjs
})
```

---

## 💡 Why Use This?

- 🔍 Track build info in production
- 🕒 Know what you deployed & when
- ✅ No manual version updates
- 🚀 Great for debugging and multi-page apps

---

## 📜 License

MIT © [@nianyi778](https://github.com/nianyi778)

---

## 📂 Project Structure

```
unplugin-version-injector/
├── dist/
├── src/
│   ├── vite.ts
│   ├── webpack.ts
│   ├── rollup.ts
│   └── shared/
├── tsup.config.ts
└── package.json
```

---

## 🤝 Contributing

Feel free to submit issues or PRs 🙌

GitHub → https://github.com/nianyi778/unplugin-version-injector

---

🔥 Simple, reliable version & build timestamp injection – that just works!
