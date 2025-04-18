### **🚀 `unplugin-version-injector` - 自动注入版本号与构建时间**

[🇬🇧 English README](./README.md) | [🇨🇳 中文文档](./README.zh-CN.md)

---

## **📌 插件简介**
`unplugin-version-injector` 是一个轻量级插件，可在构建时自动向所有 HTML 文件注入 **版本号** 和 **构建时间戳**。支持 **Webpack 4/5、Vite 和 Rollup**，非常适合 **SPA / MPA 项目**使用。

---

## **✨ 功能亮点**
✅ 自动注入 `<meta name="version">` 到 HTML 的 `<head>` 中  
✅ 自动注入 `<script>`，控制台输出 `版本号` 和 `构建时间`  
✅ 支持 Webpack 4 / 5、Vite、Rollup  
✅ 完美兼容多页面应用（MPA）  
✅ 支持自定义版本号、时间格式，默认读取 `package.json`

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
    }),
  ],
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

## **🧪 示例输出**

构建后的 HTML 文件中将自动注入：

```html
<head>
  <meta name="version" content="1.2.3">
  ...
</head>
<body>
  ...
  <script>
    console.log("%c Version: 1.2.3 ", "background: #222; color: #00ff00;");
    console.log("%c Build Time: 2024-04-01T12:00:00.000Z ", "background: #222; color: #ffcc00;");
  </script>
</body>
```

控制台输出：

```
🟢 Version: 1.2.3
🟡 Build Time: 2024-04-01T12:00:00.000Z
```

---

## **🔧 配置项说明**

| 选项           | 类型      | 说明                          | 默认值           |
|----------------|-----------|-------------------------------|------------------|
| `version`      | `string`  | 指定版本号                   | 自动读取 package.json |
| `log`          | `boolean` | 是否输出控制台日志            | `true`           |
| `dateFormat`   | `string`  | 使用 dayjs 自定义时间格式     | `ISO 格式`       |

---

## **🌍 为什么选择这个插件？**

- 🛠 零配置，开箱即用  
- 🚀 快速定位版本问题  
- 📅 跟踪构建时间  
- 🎯 支持多构建工具  
- 🧩 高度可配置，灵活插拔  

---

## **📜 开源许可**
MIT License © 2024 [Nian YI](https://github.com/nianyi778)

---

🔥 `unplugin-version-injector` —— 最轻巧的版本信息注入解决方案！