#!/bin/bash

# 设置错误时退出
set -e

echo "🚀 启动 Markdown to PDF 服务..."

# 启动后端服务（后台运行）
echo "📦 启动后端服务..."
cd ./backend
source .venv/bin/activate
uv run python run.py &
BACKEND_PID=$!
cd ..

# 等待后端服务启动
echo "⏳ 等待后端服务启动..."
sleep 3

# 启动前端服务（后台运行）
echo "🌐 启动前端服务..."
cd ./web
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ 服务启动完成！"
echo "📊 后端服务 PID: $BACKEND_PID"
echo "📊 前端服务 PID: $FRONTEND_PID"
echo "🌐 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# 保持脚本运行
wait