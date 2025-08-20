#!/bin/bash

# i18n 依赖安装脚本
echo "🚀 开始安装 i18n 相关依赖..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在 web 目录下运行此脚本"
    exit 1
fi

# 安装核心依赖
echo "📦 安装核心依赖..."
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend

# 安装类型定义
echo "📝 安装类型定义..."
npm install --save-dev @types/react-i18next

# 检查安装结果
if [ $? -eq 0 ]; then
    echo "✅ i18n 依赖安装成功！"
    echo ""
    echo "📋 已安装的包："
    echo "  - i18next"
    echo "  - react-i18next"
    echo "  - i18next-browser-languagedetector"
    echo "  - i18next-http-backend"
    echo "  - @types/react-i18next"
    echo ""
    echo "🎯 下一步："
    echo "  1. 确保 src/i18n/ 目录下的文件已创建"
    echo "  2. 在 main.tsx 中导入 './i18n'"
    echo "  3. 在组件中使用 useTranslation hook"
    echo "  4. 运行 npm run dev 测试功能"
else
    echo "❌ 安装失败，请检查网络连接和 npm 配置"
    exit 1
fi
