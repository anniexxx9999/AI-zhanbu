#!/bin/bash

echo "✨ 启动 AstroSoul 前端开发服务器 ✨"
echo ""

cd frontend

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    echo ""
fi

echo "🚀 启动开发服务器..."
echo "🌸 打开浏览器访问: http://localhost:3000"
echo "💕 按 Ctrl+C 停止服务器"
echo ""

npm run dev


