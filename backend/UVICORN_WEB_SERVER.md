# uvicorn 作为 HTML Web 服务器

## 🚀 概述

uvicorn 不仅可以作为 ASGI 应用服务器运行 FastAPI 应用，还可以提供完整的 Web 服务功能，包括静态文件服务和 HTML 页面渲染。

## ✨ 功能特性

### 1. 静态文件服务
- **HTML 文件**：直接提供 HTML 页面
- **CSS 样式**：提供样式文件服务
- **JavaScript**：提供脚本文件服务
- **图片和媒体**：支持各种媒体文件
- **文档文件**：支持 PDF、文档等文件

### 2. 模板引擎支持
- **Jinja2 模板**：支持动态模板渲染
- **模板继承**：支持模板继承和复用
- **变量传递**：支持从后端传递数据到模板

### 3. API 服务
- **RESTful API**：提供完整的 API 服务
- **自动文档**：自动生成 Swagger/OpenAPI 文档
- **CORS 支持**：内置跨域资源共享支持

## 📁 文件结构

```
backend/
├── static/              # 静态文件目录
│   ├── style.css       # CSS 样式文件
│   ├── demo.html       # HTML 演示页面
│   └── with-css.html   # 使用外部CSS的页面
├── templates/           # 模板文件目录
│   └── base.html       # 基础模板
├── app/
│   └── main.py         # FastAPI 应用
└── run.py              # 启动脚本
```

## 🌐 访问地址

启动服务后，可以访问以下地址：

- **主页**：http://localhost:8000/
- **API 文档**：http://localhost:8000/docs
- **交互式文档**：http://localhost:8000/redoc
- **健康检查**：http://localhost:8000/health
- **静态文件演示**：http://localhost:8000/static/demo.html
- **CSS 演示**：http://localhost:8000/static/with-css.html
- **模板演示**：http://localhost:8000/template-demo

## 🔧 配置说明

### 静态文件配置
```python
from fastapi.staticfiles import StaticFiles

# 挂载静态文件目录
app.mount("/static", StaticFiles(directory="static"), name="static")
```

### 模板配置
```python
from fastapi.templating import Jinja2Templates

# 配置模板目录
templates = Jinja2Templates(directory="templates")
```

### 路由示例
```python
@app.get("/", response_class=HTMLResponse)
async def root():
    """提供 HTML 页面"""
    html_content = """
    <!DOCTYPE html>
    <html>
        <head><title>欢迎</title></head>
        <body><h1>Hello World!</h1></body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/template-demo")
async def template_demo(request: Request):
    """使用模板渲染页面"""
    return templates.TemplateResponse("base.html", {
        "request": request,
        "title": "模板页面"
    })
```

## 🚀 启动服务

```bash
# 进入后端目录
cd backend

# 激活虚拟环境
source .venv/bin/activate

# 启动服务
python run.py
```

## 📊 性能优势

1. **高性能**：基于 ASGI 标准，支持异步处理
2. **自动重载**：开发模式下文件变化自动重启
3. **内存效率**：高效的内存使用和资源管理
4. **并发支持**：支持高并发请求处理

## 🔒 安全特性

1. **CORS 支持**：内置跨域资源共享控制
2. **请求验证**：自动请求参数验证
3. **错误处理**：完善的错误处理机制
4. **日志记录**：详细的访问和错误日志

## 🎯 使用场景

- **全栈 Web 应用**：前后端一体化开发
- **API 服务**：提供 RESTful API 接口
- **静态网站**：托管静态网站和文档
- **开发服务器**：本地开发和测试
- **原型开发**：快速原型和演示

## 📝 注意事项

1. **生产环境**：生产环境建议使用 nginx 等反向代理
2. **静态文件**：大文件建议使用 CDN 或专门的静态文件服务器
3. **安全配置**：生产环境需要配置适当的安全策略
4. **性能优化**：根据需求调整并发和内存配置 