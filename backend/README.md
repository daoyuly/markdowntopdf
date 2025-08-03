# Markdown转PDF后端服务

基于FastAPI + SQLAlchemy + JWT的现代化Python后端服务，使用uv作为包管理器

## 🚀 技术栈

- **FastAPI** - 现代、快速的Web框架
- **SQLAlchemy** - 强大的ORM
- **Pydantic** - 数据验证和序列化
- **JWT** - 无状态认证
- **Alembic** - 数据库迁移
- **bcrypt** - 密码加密
- **uvicorn** - ASGI服务器
- **uv** - 快速Python包管理器

## 📁 项目结构

```
backend/
├── app/                    # 应用主目录
│   ├── __init__.py
│   ├── main.py            # FastAPI应用入口
│   ├── config.py          # 配置管理
│   ├── auth.py            # JWT认证
│   ├── crud.py            # 数据库操作
│   └── api/               # API路由
│       ├── __init__.py
│       ├── auth.py        # 认证相关API
│       ├── users.py       # 用户管理API
│       └── documents.py   # 文档管理API
├── db/                     # 数据库相关
│   ├── __init__.py
│   ├── database.py        # 数据库连接配置
│   ├── models.py          # 数据库模型
│   └── schemas.py         # Pydantic模型
├── scripts/               # 脚本工具
│   ├── __init__.py
│   ├── init_db.py        # 数据库初始化
│   └── setup_dev.py      # 开发环境设置
├── alembic/               # 数据库迁移
│   ├── env.py
│   └── script.py.mako
├── pyproject.toml         # 项目配置（uv使用）
├── uv.lock               # 依赖锁定文件
├── .uvignore             # uv忽略文件
├── Makefile              # 开发命令
├── alembic.ini           # Alembic配置
├── run.py                # 启动脚本
├── env.example           # 环境变量示例
└── README.md             # 项目说明
```

## 🗄️ 数据库设计

### 用户表 (users)
- **id**: 主键
- **username**: 用户名（唯一）
- **email**: 邮箱（唯一）
- **hashed_password**: 加密密码
- **role**: 用户角色（FREE/PREMIUM/ADMIN）
- **full_name**: 全名
- **avatar_url**: 头像URL
- **bio**: 个人简介
- **is_active**: 是否激活
- **is_verified**: 是否验证
- **premium_expires_at**: 会员过期时间
- **total_documents**: 文档总数
- **total_conversions**: 转换总数
- **created_at**: 创建时间
- **updated_at**: 更新时间
- **last_login_at**: 最后登录时间

### Markdown文档表 (markdown_documents)
- **id**: 主键
- **user_id**: 用户ID（外键）
- **title**: 文档标题
- **content**: 文档内容
- **description**: 文档描述
- **is_public**: 是否公开
- **is_deleted**: 是否删除
- **pdf_settings**: PDF设置（JSON）
- **template_name**: 模板名称
- **view_count**: 查看次数
- **conversion_count**: 转换次数
- **created_at**: 创建时间
- **updated_at**: 更新时间
- **last_converted_at**: 最后转换时间

## ✨ 功能特性

### 用户管理
- ✅ 用户注册
- ✅ 用户登录
- ✅ 密码加密
- ✅ JWT令牌认证
- ✅ 用户信息更新
- ✅ 会员系统

### 文档管理
- ✅ 创建Markdown文档
- ✅ 编辑文档
- ✅ 删除文档
- ✅ 文档列表查询
- ✅ 文档权限控制
- ✅ 文档统计

### 会员功能
- ✅ 免费用户限制
- ✅ 会员升级
- ✅ 会员过期管理
- ✅ 使用统计

## 🛠️ 安装和运行

### 1. 环境要求
- Python 3.8+
- uv (推荐) 或 pip

### 2. 安装uv (推荐)
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 3. 克隆项目
```bash
git clone <repository-url>
cd markdowntopdf/backend
```

### 4. 快速设置 (推荐)
```bash
# 自动设置开发环境
python scripts/setup_dev.py

# 或使用Makefile
make setup
```

### 5. 手动设置
```bash
# 安装依赖
uv sync

# 或安装开发依赖
uv sync --extra dev

# 初始化数据库
uv run python scripts/init_db.py
```

### 6. 环境配置
复制环境变量示例文件：
```bash
cp env.example .env
```

编辑 `.env` 文件，配置必要的环境变量：
```env
DATABASE_URL=sqlite:///./markdown_to_pdf.db
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 7. 运行服务
```bash
# 使用uv运行
uv run python run.py

# 或使用Makefile
make run

# 或直接使用uvicorn
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 8. 访问服务
- API文档：http://localhost:8000/docs
- ReDoc文档：http://localhost:8000/redoc
- 健康检查：http://localhost:8000/health

## 📚 API文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/login-username` - 用户名登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/refresh` - 刷新令牌

### 用户管理
- `GET /api/users/me` - 获取个人信息
- `PUT /api/users/me` - 更新个人信息
- `GET /api/users/me/stats` - 获取使用统计
- `POST /api/users/me/upgrade` - 升级会员
- `GET /api/users/me/premium-status` - 检查会员状态

### 文档管理
- `POST /api/documents/` - 创建文档
- `GET /api/documents/` - 获取文档列表
- `GET /api/documents/public` - 获取公开文档
- `GET /api/documents/{id}` - 获取文档详情
- `PUT /api/documents/{id}` - 更新文档
- `DELETE /api/documents/{id}` - 删除文档
- `POST /api/documents/{id}/convert` - 转换为PDF
- `GET /api/documents/{id}/download` - 下载PDF

## 🔐 认证说明

### JWT令牌
- 令牌类型：Bearer Token
- 过期时间：30分钟（可配置）
- 刷新：支持令牌刷新

### 用户角色
- **FREE**: 免费用户（有限制）
- **PREMIUM**: 会员用户（无限制）
- **ADMIN**: 管理员（所有权限）

### 使用限制
- 免费用户：最多5个文档，10次转换
- 会员用户：无限制
- 管理员：无限制

## 🗄️ 数据库迁移

### 初始化Alembic
```bash
uv run alembic init alembic
```

### 创建迁移
```bash
uv run alembic revision --autogenerate -m "描述变更"
```

### 应用迁移
```bash
uv run alembic upgrade head
```

### 回滚迁移
```bash
uv run alembic downgrade -1
```

## 🧪 测试

### 运行测试
```bash
# 运行所有测试
uv run pytest

# 运行测试并生成覆盖率报告
uv run pytest --cov=app --cov=db --cov-report=html

# 或使用Makefile
make test
make test-cov
```

### 创建测试用户
```bash
# 使用API注册
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "测试用户"
  }'
```

### 登录获取令牌
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

## 🛠️ 开发工具

### 代码质量
```bash
# 代码检查
uv run ruff check .

# 自动修复
uv run ruff check . --fix

# 代码格式化
uv run black .
uv run isort .

# 类型检查
uv run mypy app db

# 或使用Makefile
make lint
make lint-fix
make format
make type-check
```

### 数据库操作
```bash
# 初始化数据库
uv run python scripts/init_db.py

# 创建迁移
uv run alembic revision --autogenerate -m "描述变更"

# 应用迁移
uv run alembic upgrade head

# 或使用Makefile
make init-db
make migrate
make migrate-up
```

### 清理和构建
```bash
# 清理临时文件
make clean

# 构建项目
uv build

# 发布到PyPI
uv publish
```

## 🚀 部署

### 生产环境配置
1. 修改 `.env` 文件中的配置
2. 使用PostgreSQL数据库
3. 设置强密码的SECRET_KEY
4. 配置HTTPS
5. 使用生产级ASGI服务器

### Docker部署
```dockerfile
FROM python:3.9-slim

# 安装uv
RUN pip install uv

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen

COPY . .
EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 开发说明

### uv vs pip 优势
- **速度更快** - uv比pip快10-100倍
- **依赖解析** - 更智能的依赖解析
- **锁定文件** - 精确的依赖版本控制
- **虚拟环境** - 自动管理虚拟环境
- **现代标准** - 支持pyproject.toml

### 项目配置
- 使用 `pyproject.toml` 作为项目配置文件
- 支持可选依赖（dev, test）
- 集成代码质量工具配置
- 支持类型检查和格式化

### 开发工作流
1. 使用 `uv sync` 安装依赖
2. 使用 `uv run` 运行命令
3. 使用 `make` 简化常用命令
4. 使用 `uv build` 构建项目

## 🤝 贡献

欢迎提交Issue和Pull Request！

## �� 许可证

MIT License 