#!/bin/bash

echo "🔧 配置Prokerala API凭据..."

# 设置Prokerala API凭据
export PROKERALA_CLIENT_ID="cab49a45-4718-46d3-be9b-79670a4ecce1"
export PROKERALA_CLIENT_SECRET="0N4JbE2o6iFp0gFJYFl3rYgLtWDOLOGQAcPeRyQ8"
export PROKERALA_BASE_URL="https://api.prokerala.com"

# 设置CORS配置以匹配授权域名
export CORS_ORIGIN="http://localhost:3000,http://localhost:3002"

# 设置其他配置
export PORT=3001
export NODE_ENV=development

echo "✅ 环境变量已设置:"
echo "   PROKERALA_CLIENT_ID: $PROKERALA_CLIENT_ID"
echo "   PROKERALA_CLIENT_SECRET: ${PROKERALA_CLIENT_SECRET:0:10}..."
echo "   CORS_ORIGIN: $CORS_ORIGIN"
echo "   PORT: $PORT"
echo ""

echo "🚀 启动后端服务器..."
cd backend && node dist/server.js
