from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
import uvicorn
import os

from app.config import settings
from app.api import auth, users, documents
from db.database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时创建数据库表
    create_tables()
    yield
    # 关闭时的清理工作
    pass

# 创建FastAPI应用
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Markdown转PDF API服务",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# 配置静态文件服务
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# 配置模板
templates_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
if os.path.exists(templates_dir):
    templates = Jinja2Templates(directory=templates_dir)
else:
    templates = None

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(documents.router, prefix="/api")

# 根路径 - 提供HTML页面
@app.get("/", response_class=HTMLResponse)
async def root():
    """根路径 - 提供HTML页面"""
    html_content = """
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Markdown转PDF服务</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            h1 {
                text-align: center;
                margin-bottom: 30px;
                font-size: 2.5em;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }
            .service-info {
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }
            .links {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 30px;
                flex-wrap: wrap;
            }
            .link-btn {
                display: inline-block;
                padding: 12px 24px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .link-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }
            .status {
                text-align: center;
                margin: 20px 0;
                padding: 10px;
                background: rgba(76, 175, 80, 0.3);
                border-radius: 5px;
                border: 1px solid rgba(76, 175, 80, 0.5);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Markdown转PDF服务</h1>
            
            <div class="status">
                ✅ 服务运行正常
            </div>
            
            <div class="service-info">
                <h3>📋 服务信息</h3>
                <p><strong>版本:</strong> """ + settings.app_version + """</p>
                <p><strong>状态:</strong> 运行中</p>
                <p><strong>端口:</strong> 8000</p>
            </div>
            
            <div class="links">
                <a href="/docs" class="link-btn">📚 API文档</a>
                <a href="/redoc" class="link-btn">📖 交互式文档</a>
                <a href="/health" class="link-btn">💚 健康检查</a>
                <a href="/api" class="link-btn">🔧 API端点</a>
            </div>
            
            <div class="service-info">
                <h3>🔧 可用功能</h3>
                <ul>
                    <li>用户注册和登录</li>
                    <li>Markdown文档管理</li>
                    <li>PDF生成和下载</li>
                    <li>文档加密和安全</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

# 健康检查
@app.get("/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version
    }

# 模板演示页面
@app.get("/template-demo", response_class=HTMLResponse)
async def template_demo(request: Request):
    """模板演示页面"""
    if templates is None:
        return HTMLResponse(content="<h1>模板目录不存在</h1>")
    
    return templates.TemplateResponse("base.html", {
        "request": request,
        "title": "模板演示页面",
        "message": "这是一个使用 Jinja2 模板引擎渲染的页面！"
    })

# 全局异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP异常处理"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """通用异常处理"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "内部服务器错误",
            "detail": str(exc) if settings.debug else "请稍后重试"
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    ) 