#!/bin/bash

# 健康数据可视化应用启动脚本

echo "🚀 启动健康数据可视化应用..."
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 进入 Next.js 应用目录
cd "$(dirname "$0")/nextjs-app" || exit 1

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    echo ""
fi

# 检查 .env.local 是否存在
if [ ! -f ".env.local" ] || ! grep -q "ANTHROPIC_API_KEY=sk-ant" .env.local; then
    echo "⚠️  警告: Anthropic API Key 未配置"
    echo ""
    echo "请编辑 nextjs-app/.env.local 文件并添加你的 API Key:"
    echo "  ANTHROPIC_API_KEY=sk-ant-xxxxx"
    echo ""
    echo "获取 API Key: https://console.anthropic.com/"
    echo ""
    read -p "按 Enter 继续（部分功能将不可用）..."
fi

echo "✅ 启动开发服务器..."
echo ""
echo "应用地址: http://localhost:3000"
echo "按 Ctrl+C 停止服务器"
echo ""

# 启动开发服务器
npm run dev
