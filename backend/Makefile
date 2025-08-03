.PHONY: help install dev test lint format clean run init-db

# 默认目标
help: ## 显示帮助信息
	@echo "Markdown转PDF API - 开发命令"
	@echo "================================"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# 安装和设置
install: ## 安装项目依赖
	uv sync

dev: ## 安装开发依赖
	uv sync --extra dev

# 数据库操作
init-db: ## 初始化数据库
	uv run python scripts/init_db.py

# 运行服务
run: ## 运行开发服务器
	uv run python run.py

run-prod: ## 运行生产服务器
	uv run uvicorn app.main:app --host 0.0.0.0 --port 8000

# 测试
test: ## 运行所有测试
	uv run pytest

test-cov: ## 运行测试并生成覆盖率报告
	uv run pytest --cov=app --cov=db --cov-report=html --cov-report=term

test-watch: ## 运行测试并监听文件变化
	uv run pytest-watch

# 代码质量
lint: ## 运行代码检查
	uv run ruff check .

lint-fix: ## 自动修复代码问题
	uv run ruff check . --fix

format: ## 格式化代码
	uv run black .
	uv run isort .

type-check: ## 类型检查
	uv run mypy app db

# 数据库迁移
migrate: ## 创建数据库迁移
	uv run alembic revision --autogenerate -m "$(message)"

migrate-up: ## 应用数据库迁移
	uv run alembic upgrade head

migrate-down: ## 回滚数据库迁移
	uv run alembic downgrade -1

# 清理
clean: ## 清理临时文件
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf build/
	rm -rf dist/
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage
	rm -rf .mypy_cache/

# 开发工具
setup: ## 完整项目设置
	@echo "🚀 设置Markdown转PDF API项目..."
	uv sync
	uv run python scripts/init_db.py
	@echo "✅ 项目设置完成！"

dev-setup: ## 设置开发环境
	@echo "🔧 设置开发环境..."
	uv sync --extra dev
	uv run python scripts/init_db.py
	@echo "✅ 开发环境设置完成！"

# 文档
docs: ## 生成API文档
	@echo "📚 生成API文档..."
	uv run python -c "import uvicorn; from app.main import app; uvicorn.run(app, host='0.0.0.0', port=8000)"

# 部署
build: ## 构建项目
	uv build

publish: ## 发布到PyPI
	uv publish

# 安全
security-check: ## 安全漏洞检查
	uv run safety check

# 性能
profile: ## 性能分析
	uv run python -m cProfile -o profile.stats run.py

# 监控
monitor: ## 启动监控
	uv run python -m memory_profiler run.py

# 帮助信息
help-dev: ## 显示开发命令帮助
	@echo "开发命令:"
	@echo "  make install      - 安装依赖"
	@echo "  make dev          - 安装开发依赖"
	@echo "  make run          - 运行开发服务器"
	@echo "  make test         - 运行测试"
	@echo "  make lint         - 代码检查"
	@echo "  make format       - 代码格式化"
	@echo "  make type-check   - 类型检查"
	@echo "  make clean        - 清理临时文件"
	@echo "  make setup        - 完整项目设置"
	@echo "  make dev-setup    - 设置开发环境" 