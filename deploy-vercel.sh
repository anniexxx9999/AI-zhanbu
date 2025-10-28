#!/bin/bash

echo "🚀 开始 Vercel 部署流程..."

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 请先安装 Vercel CLI: npm i -g vercel"
    exit 1
fi

# 1. 部署后端
echo "📦 部署后端到 Vercel..."
cd backend
vercel --prod --yes
BACKEND_URL=$(vercel ls | grep backend | head -1 | awk '{print $2}')
echo "✅ 后端部署完成: https://$BACKEND_URL"

# 2. 设置前端环境变量
echo "🔧 设置前端环境变量..."
cd ../frontend
vercel env add NEXT_PUBLIC_API_BASE_URL production
echo "请手动输入后端 URL: https://$BACKEND_URL"

# 3. 部署前端
echo "📦 部署前端到 Vercel..."
vercel --prod --yes
FRONTEND_URL=$(vercel ls | grep frontend | head -1 | awk '{print $2}')
echo "✅ 前端部署完成: https://$FRONTEND_URL"

echo "🎉 部署完成！"
echo "后端: https://$BACKEND_URL"
echo "前端: https://$FRONTEND_URL"
echo "健康检查: https://$BACKEND_URL/api/health"
