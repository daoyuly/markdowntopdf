# Markdown to PDF Converter

一个现代化的Markdown转PDF Web应用，使用React技术栈构建。

## 功能特性

- 📝 **实时Markdown编辑器** - 支持语法高亮和行号显示
- 👁️ **实时预览** - 支持GitHub风格的Markdown渲染
- 📄 **PDF导出** - 一键将Markdown转换为PDF文件
- 🔐 **用户认证** - 完整的登录和注册系统
- 📁 **文件上传** - 支持拖拽上传Markdown文件
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🛣️ **路由系统** - 支持独立页面访问登录和注册

## 技术栈

- **React 18** - 现代化的React框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理
- **React Router** - 客户端路由
- **React Hook Form** - 表单处理
- **Lucide React** - 现代化图标库
- **React Markdown** - Markdown渲染
- **jsPDF + html2canvas** - PDF生成

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── Editor.tsx      # 主编辑器组件
│   ├── Sidebar.tsx     # 侧边栏组件
│   ├── LoginModal.tsx  # 登录模态框
│   └── MarkdownPreview.tsx # Markdown预览组件
├── stores/             # 状态管理
│   ├── authStore.ts    # 认证状态
│   └── editorStore.ts  # 编辑器状态
├── utils/              # 工具函数
│   └── pdfGenerator.ts # PDF生成工具
├── App.tsx             # 主应用组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 使用说明

1. **编辑Markdown** - 在编辑器中直接输入或粘贴Markdown内容
2. **文件上传** - 点击"click to browse"或拖拽文件到编辑器
3. **预览内容** - 点击"Preview"标签查看渲染效果
4. **导出PDF** - 点击"Download"按钮生成PDF文件
5. **用户认证** - 访问 `/login` 或 `/register` 进行登录/注册
6. **模态框登录** - 在主页面点击"Login"按钮打开登录模态框

## 开发说明

### 状态管理

- `authStore` - 管理用户登录状态
- `editorStore` - 管理编辑器内容和文档名称

### PDF生成

使用`jsPDF`和`html2canvas`将Markdown内容转换为PDF：

1. 将Markdown渲染为HTML
2. 使用html2canvas将HTML转换为图片
3. 使用jsPDF将图片转换为PDF

### 样式系统

使用Tailwind CSS进行样式管理，自定义组件类：

- `.btn-primary` - 主要按钮样式
- `.btn-secondary` - 次要按钮样式
- `.input-field` - 输入框样式
- `.modal-overlay` - 模态框遮罩
- `.modal-content` - 模态框内容

## 许可证

MIT License 