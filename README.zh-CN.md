# **🚀 `unplugin-version-injector` - 自动注入版本号 & 构建时间**  

[🇬🇧 English README](./README.md) | [🇨🇳 中文 README](./README.zh-CN.md)  

---

## **📌 简介**  
`unplugin-version-injector` 是一个 **轻量级** 插件，可自动将 **版本号** 和 **构建时间** 注入到所有 HTML 文件中。  
支持 **Webpack 4/5、Vite 和 Rollup**，适用于 **单页应用 (SPA) 和 多页应用 (MPA)**。

### **✨ 功能特点**
✅ **自动注入** `<meta name="version">` 到所有 HTML `<head>` 部分  
✅ **自动注入 `<script>`**，在浏览器控制台打印 `版本号` & `构建时间`  
✅ **兼容 Webpack 4 & 5、Vite 和 Rollup**  
✅ **支持多页应用 (MPA)**，不会遗漏任何 HTML  
✅ **支持手动指定版本号**，默认读取 `package.json`  

---

## **📦 安装**
```sh
# 使用 Yarn
yarn add -D unplugin-version-injector

# 使用 npm
npm install -D unplugin-version-injector
```

---

## **🚀 使用方法**

### **📌 Webpack 4/5**
修改 `webpack.config.js`：
```js
const versionInjectorPlugin = require('unplugin-version-injector');

module.exports = {
  plugins: [
    versionInjectorPlugin.webpack({
      version: '1.2.3',  // （可选）手动指定版本号
    })
  ],
};
```

---

### **📌 Vite**
修改 `vite.config.js`：
```js
import versionInjectorPlugin from 'unplugin-version-injector';

export default {
  plugins: [versionInjectorPlugin.vite()]
};
```

---

### **📌 Rollup**
修改 `rollup.config.js`：
```js
import versionInjectorPlugin from 'unplugin-version-injector';

export default {
  plugins: [versionInjectorPlugin.rollup()]
};
```

---

## **📜 生成的 HTML 示例**
构建完成后，所有 HTML 文件将包含以下内容：
```html
<head>
  <meta name="version" content="1.2.3">
  <meta charset="UTF-8">
  <title>我的应用</title>
</head>
<body>
  <h1>Hello World</h1>
  <script>
    console.log("%c 版本号: 1.2.3 ", "background: #222; color: #00ff00; font-size: 12px; padding: 4px; border-radius: 4px;");
    console.log("%c 构建时间: 2024-03-01T12:00:00.000Z ", "background: #222; color: #ffcc00; font-size: 12px; padding: 4px; border-radius: 4px;");
  </script>
</body>
```

✅ **浏览器控制台输出 (带颜色日志)**  
```
🟢 版本号: 1.2.3  (绿色)
🟡 构建时间: 2024-03-01T12:00:00.000Z  (黄色)
```

---

## **🔧 配置选项**
| **选项** | **类型** | **描述** | **默认值** |
|---------|--------|---------|---------|
| `version`  | `string` | 手动指定版本号 (如 `1.2.3`) | 自动读取 `package.json` |
| `log`      | `boolean` | 是否在控制台打印版本信息 | `true` |
| `dateFormat` | `string` | 自定义构建时间格式 | `ISO 8601` |

### **📌 自定义配置示例**
```js
versionInjectorPlugin.webpack({
  version: '2.0.0', 
  log: false,  // 关闭控制台日志
});
```

---

## **🌍 为什么选择 `unplugin-version-injector`？**
- 🛠 **开箱即用**：安装后立即生效，无需额外配置  
- 🚀 **提升调试效率**：轻松查看当前版本信息  
- 📅 **追踪构建时间**：方便监控不同版本的发布时间  
- 🎯 **轻量高效**：几乎不会影响构建速度  

---

## **📜 许可证**
MIT License © 2024 [Nian YI](https://github.com/nianyi778)  

---

## **💡 贡献**
欢迎 PR！如有问题，欢迎在 GitHub 提交 issue。  

**GitHub 仓库**：[🔗 unplugin-version-injector](https://github.com/nianyi778/unplugin-version-injector)  

---

🔥 **`unplugin-version-injector` - 让你的应用版本管理更简单！** 🚀🚀🚀