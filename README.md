# 🚀 `unplugin-version-injector` - Auto Inject Version & Build Time

[🇨🇳 中文文档](./README.zh-CN.md) | [🇬🇧 English README](./README.md)

---

## 📌 Introduction

`unplugin-version-injector` is a lightweight plugin that automatically injects **version** and **build timestamp** into all HTML files. It supports **Webpack 4/5**, **Vite**, and **Rollup**, and works seamlessly with both **SPA** and **MPA** projects.

---

## ✨ Features

✅ Injects `<meta name="version">` and `<meta name="project">` into the `<head>`  
✅ Injects `<script>` into the `<body>` to log version, name, and build time  
✅ Supports Webpack 4 & 5, Vite, Rollup  
✅ Fully compatible with Multi-Page Applications (MPA)  
✅ Customizable version, project name, date format, and theme-based console styling  

---

## 📦 Installation

```bash
# Using Yarn
yarn add -D unplugin-version-injector

# Using npm
npm install -D unplugin-version-injector
```

---

## 🚀 Usage

### 📌 Vite

```ts
import versionInjector from 'unplugin-version-injector/vite';

export default {
  plugins: [versionInjector()],
};
```

---

### 📌 Webpack 4/5

```js
const versionInjector = require('unplugin-version-injector/webpack');

module.exports = {
  plugins: [
    versionInjector({
      version: '1.2.3', // Optional: manually specify version
    }),
  ],
};
```

---

### 📌 Rollup

```js
import versionInjector from 'unplugin-version-injector/rollup';

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
    console.log("%c Version: 1.2.3 ", "background: #222; color: #00ff00;");
    console.log("%c Project Name: my-project ", "background: #222; color: #0080ff;");
    console.log("%c Build Time: 2024-04-01T12:00:00.000Z ", "background: #222; color: #ffcc00;");
  </script>
</body>
```

---

## 🔧 Configuration Options

| Option        | Type      | Description                             | Default                  |
|---------------|-----------|-----------------------------------------|--------------------------|
| `version`     | `string`  | Custom version number                   | Read from package.json   |
| `name`        | `string`  | Custom project name                     | Read from package.json   |
| `log`         | `boolean` | Whether to output console logs         | `true`                   |
| `dateFormat`  | `string`  | Format for build time (e.g., YYYY-MM-DD)| ISO 8601 format          |

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