# 🚀 `unplugin-version-injector` - 自动注入版本号 & 构建时间

[🇬🇧 English README](./README.md) | [🇨🇳 中文 README](./README.zh-CN.md)

---

## 📌 简介

`unplugin-version-injector` 是一个 **轻量级通用插件**，可在构建时自动将 **版本号** 和 **构建时间** 注入 HTML 文件中。  
兼容 **Webpack 4/5、Vite 和 Rollup**，适用于 **SPA / MPA** 多种项目结构。

---

## ✨ 功能特点

- ✅ 自动注入 `<meta name="version">` 到 HTML `<head>`
- ✅ 自动注入 `<script>`，在浏览器控制台打印版本号与构建时间
- ✅ 支持 Webpack 4、Webpack 5、Vite、Rollup
- ✅ 支持多页应用（MPA），自动处理所有 HTML 文件
- ✅ 支持自定义版本号、自定义构建时间格式
- ✅ 体积小、零运行时依赖

---

## 📦 安装

```bash
# 使用 npm
npm install -D unplugin-version-injector

# 使用 yarn
yarn add -D unplugin-version-injector
```

---

## 🚀 使用方法

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

## 📜 注入效果示例

```html
<head>
  <meta name="version" content="1.2.3">
  <meta charset="UTF-8">
</head>
<body>
  <h1>Hello</h1>
  <script>
    console.log("%c 版本号: 1.2.3 ", "background: #222; color: #00ff00; font-size: 12px;");
    console.log("%c 构建时间: 2025-04-10 14:00:00 ", "background: #222; color: #ffcc00; font-size: 12px;");
  </script>
</body>
```

✅ 控制台输出示例：

```
🟢 版本号: 1.2.3
🟡 构建时间: 2025-04-10 14:00:00
```

---

## 🔧 配置选项

| 选项            | 类型                          | 默认值                        | 说明 |
|-----------------|-------------------------------|-------------------------------|------|
| `version`       | `string`                      | 自动读取 `package.json`       | 手动指定版本号 |
| `formatDate`    | `(date: Date) => string`      | `YYYY-MM-DD HH:mm:ss`         | 自定义时间格式函数 |
| `dateFormat`    | `string`                      | 无                            | 使用 `dayjs` 格式化（需用户安装） |
| `injectToHead`  | `boolean`                     | `true`                        | 是否注入 `<meta>` 标签 |
| `injectToBody`  | `boolean`                     | `true`                        | 是否注入控制台日志脚本 |

📦 如果使用 `dateFormat`，请先安装：

```bash
npm install dayjs
```

---

## 📌 自定义配置示例

```ts
versionInjector({
  version: '2.0.0',
  injectToHead: true,
  injectToBody: false,
  dateFormat: 'YYYY/MM/DD HH:mm:ss',
});
```

---

## 🧪 支持的构建工具

| 构建工具     | 状态     | 说明 |
|--------------|----------|------|
| **Vite**     | ✅ 支持   | 使用 `transformIndexHtml` |
| **Webpack 5**| ✅ 支持   | 使用 `processAssets` 钩子 |
| **Webpack 4**| ✅ 支持   | 使用 `emit` 钩子 |
| **Rollup**   | ✅ 支持   | 使用 `generateBundle` 钩子 |

---

## 💡 应用场景

- 🧪 快速定位部署版本与构建时间
- 📅 部署监控 / 运维可见性
- ⚡️ 零运行时依赖，构建时注入

---

## 📄 许可证

MIT © [Nian YI](https://github.com/nianyi778)

---

## 🤝 参与贡献

欢迎提交 PR 和 issue！

GitHub 仓库：  
[https://github.com/nianyi778/unplugin-version-injector](https://github.com/nianyi778/unplugin-version-injector)

---

🔥 `unplugin-version-injector` —— 让你的应用版本信息透明、可追踪！
