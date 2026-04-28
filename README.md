# Terminal · 个人空间

> 赛博朋克风格的个人门户主页，集成工具库、大模型管理、文件管理，带二次元装饰元素。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Size](https://img.shields.io/badge/size-~208KB-orange)

## ✨ 特性

### 🏠 主页仪表盘
- **实时时钟** — 时间、日期、季节信息、智能问候语
- **天气卡片** — 自动获取当前城市天气（基于 wttr.in API）
- **一言语录** — 动漫/游戏/文学随机语录
- **快捷入口** — 可自定义的常用链接导航
- **待办事项** — 本地持久化的任务管理
- **系统状态** — 浏览器、分辨率、在线状态一览

### 🔧 工具库（10+ 内置工具）
| 工具 | 分类 | 说明 |
|------|------|------|
| JSON 格式化 | 格式化 | 美化、压缩、验证 |
| Base64 编解码 | 编解码 | 标准 & URL 安全编码 |
| 颜色转换器 | 其他 | HEX / RGB / HSL 互转 + 取色板 |
| 正则表达式测试 | 文本处理 | 实时匹配高亮 |
| Markdown 预览 | 文本处理 | 实时渲染预览 |
| 哈希生成器 | 编解码 | SHA-1 / SHA-256 / SHA-384 / SHA-512 |
| 时间戳转换 | 开发工具 | Unix ↔ 日期互转 |
| UUID 生成器 | 生成器 | 批量生成 v4 UUID |
| 二维码生成 | 生成器 | 文本/URL → QR Code |
| 文本差异对比 | 文本处理 | 逐行 Diff 对比 |

**插件化架构** — 新增工具只需注册一个对象，详见下方 [扩展指南](#-扩展指南)。

### 🤖 大模型管理
- 多模型配置（OpenAI / Anthropic / 自定义 API）
- 多轮对话界面，对话历史本地持久化
- Prompt 模板库（翻译、代码审查、写作助手等）
- 支持系统提示词注入

### 📁 文件库
- 虚拟文件系统（基于 localStorage）
- 文件夹层级、收藏、标签分类
- 支持创建、重命名、删除、搜索

### ⚙️ 设置中心
- **主题色** — 5 种预设 + 自定义取色器
- **二次元开关** — 樱花飘落 / 粒子背景 / 动态光晕 / 一言，逐项控制
- **布局调整** — 侧边栏位置、卡片圆角
- **数据管理** — 导出 / 导入 / 清除所有数据

## 🚀 快速开始

### 方式一：直接打开
```bash
# 双击 index.html 即可在浏览器中运行
open index.html
```

### 方式二：本地服务器（推荐）
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# 访问 http://localhost:8080
```

### 方式三：部署到 Nginx
```nginx
server {
    listen 80;
    server_name your.domain.com;
    root /path/to/personal-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📂 项目结构

```
personal-site/
├── index.html                 # 主入口
├── README.md                  # 项目说明
├── css/
│   ├── main.css               # 全局主题 & 布局
│   ├── widgets.css            # 主页卡片 & 文件库
│   ├── tools.css              # 工具库
│   ├── llm.css                # 大模型对话
│   └── anime.css              # 二次元装饰效果
└── js/
    ├── core.js                # 核心工具库（存储/事件/Toast/MD解析）
    ├── app.js                 # 应用入口 & 初始化
    ├── widgets/
    │   ├── clock.js           # 时钟组件
    │   ├── weather.js         # 天气组件
    │   ├── hitokoto.js        # 一言组件
    │   ├── shortcuts.js       # 快捷入口
    │   └── todo.js            # 待办事项
    ├── tools/
    │   ├── registry.js        # 工具注册管理器
    │   ├── json-formatter.js
    │   ├── base64.js
    │   ├── color-converter.js
    │   ├── regex-tester.js
    │   ├── markdown-preview.js
    │   ├── hash-generator.js
    │   ├── timestamp.js
    │   ├── uuid-generator.js
    │   ├── qrcode.js
    │   └── text-diff.js
    ├── llm.js                 # 大模型管理
    ├── files.js               # 文件管理
    ├── anime.js               # 二次元效果引擎
    └── settings.js            # 设置管理
```

## 🔌 扩展指南

### 添加新工具

在 `js/tools/` 目录下创建新文件：

```js
// js/tools/my-tool.js
ToolManager.register({
  id: 'my-tool',           // 唯一标识
  name: '我的工具',         // 显示名称
  icon: '🛠️',              // 图标（emoji）
  desc: '工具功能描述',     // 简短描述
  category: 'other',       // 分类：encoding | format | generate | text | dev | other

  render(container) {
    // 渲染工具 UI
    container.innerHTML = `
      <div class="tool-panel">
        <input id="my-input" class="tool-input" placeholder="输入...">
        <button class="btn btn-primary btn-sm" onclick="MyTool.run()">执行</button>
        <div id="my-result" class="tool-result"></div>
      </div>
    `;
  }
});

const MyTool = {
  run() {
    const input = document.getElementById('my-input').value;
    document.getElementById('my-result').textContent = '结果: ' + input;
  }
};
```

然后在 `index.html` 的 `<script>` 区域添加引用：
```html
<script src="js/tools/my-tool.js"></script>
```

### 添加 Prompt 模板

在大模型管理页面点击「Prompt 模板」→「添加模板」，或在 `js/llm.js` 的默认配置中添加。

### 自定义主题色

在设置页面使用取色器，或修改 `css/main.css` 中的 CSS 变量：

```css
:root {
  --accent: #00f0ff;           /* 主色调 */
  --accent-rgb: 0, 240, 255;   /* RGB值 */
  --accent-dim: #00a8b3;       /* 暗色变体 */
  --bg-root: #0a0e17;          /* 背景色 */
}
```

## 🌐 浏览器兼容性

| 浏览器 | 版本 |
|--------|------|
| Chrome | ≥ 80 |
| Firefox | ≥ 78 |
| Safari | ≥ 14 |
| Edge | ≥ 80 |

## 📝 技术说明

- **零依赖** — 纯原生 HTML/CSS/JS，无需 npm install
- **本地存储** — 所有数据保存在浏览器 localStorage
- **API 调用** — 天气（wttr.in）、一言（hitokoto.cn）均为免费公开 API
- **大模型 API** — 需自行配置 Endpoint 和 API Key

## 📄 License

MIT License

---

> 🌸 「即使如此，世界依然美丽。」
