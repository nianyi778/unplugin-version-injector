### **🚀 `unplugin-version-injector` - Auto Inject Version & Build Time**  

[🇨🇳 中文 README](./README.zh-CN.md) | [🇬🇧 English README](./README.md)  

---

## **📌 Introduction**  
`unplugin-version-injector` is a powerful and lightweight plugin that automatically injects the **version number** and **build timestamp** into all HTML files. It supports **Webpack 4/5, Vite, and Rollup**, making it ideal for both **Single Page Applications (SPA)** and **Multi-Page Applications (MPA)**.  

### **✨ Features**
✅ **Auto-injects** `<meta name="version">` into all HTML `<head>` sections  
✅ **Auto-injects a `<script>`** that logs `version` & `build time` in the browser console  
✅ **Supports Webpack 4 & 5, Vite, and Rollup**  
✅ **Works in Multi-Page Applications (MPA)**  
✅ **Highly configurable**: Supports manually specifying the version or using `package.json`  

---

## **📦 Installation**
```sh
# Using Yarn
yarn add -D unplugin-version-injector

# Using npm
npm install -D unplugin-version-injector
```

---

## **🚀 Usage**

### **📌 Webpack 4/5**
Modify your `webpack.config.js`:  
```js
const versionInjectorPlugin = require('unplugin-version-injector');

module.exports = {
  plugins: [
    versionInjectorPlugin.webpack({
      version: '1.2.3',  // (Optional) Manually specify version
    })
  ],
};
```

---

### **📌 Vite**
Modify your `vite.config.js`:  
```js
import versionInjectorPlugin from 'unplugin-version-injector';

export default {
  plugins: [versionInjectorPlugin.vite()]
};
```

---

### **📌 Rollup**
Modify your `rollup.config.js`:  
```js
import versionInjectorPlugin from 'unplugin-version-injector';

export default {
  plugins: [versionInjectorPlugin.rollup()]
};
```

---

## **📜 Example Output**
After building, all HTML files will include the following:  
```html
<head>
  <meta name="version" content="1.2.3">
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <h1>Hello World</h1>
  <script>
    console.log("%c Version: 1.2.3 ", "background: #222; color: #00ff00; font-size: 12px; padding: 4px; border-radius: 4px;");
    console.log("%c Build Time: 2024-03-01T12:00:00.000Z ", "background: #222; color: #ffcc00; font-size: 12px; padding: 4px; border-radius: 4px;");
  </script>
</body>
```

✅ **Console Output (Colored Logs)**  
```
🟢 Version: 1.2.3  (Green)
🟡 Build Time: 2024-03-01T12:00:00.000Z  (Yellow)
```

---

## **🔧 Configuration Options**
| **Option** | **Type** | **Description** | **Default** |
|------------|---------|----------------|-------------|
| `version`  | `string` | Custom version (e.g., `1.2.3`) | Auto-read from `package.json` |
| `log`      | `boolean` | Enable/Disable console logs | `true` |
| `dateFormat` | `string` | Format for build time | `ISO 8601` |

### **Example: Custom Config**
```js
versionInjectorPlugin.webpack({
  version: '2.0.0', 
  log: false,  // Disable console logs
});
```

---

## **🌍 Why Use This Plugin?**
- 🛠 **Works out of the box**: No extra setup needed  
- 🚀 **Improves debugging**: Always know what version is running in production  
- 📅 **Track build times**: Useful for monitoring deployments  
- 🎯 **Lightweight & fast**: Minimal overhead with maximum benefits  

---

## **📜 License**
MIT License © 2024 [Nian YI](https://github.com/nianyi778)  

---

## **💡 Contributing**
Pull requests are welcome! If you encounter any issues, feel free to open an issue on GitHub.  

**GitHub Repository:** [🔗 unplugin-version-injector](https://github.com/nianyi778/unplugin-version-injector)  

---

🔥 **`unplugin-version-injector` – The simplest way to keep track of your app's version & build time!** 🚀