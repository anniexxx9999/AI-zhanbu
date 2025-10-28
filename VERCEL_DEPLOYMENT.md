# Vercel 部署指南

## 🚀 快速部署

### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 设置环境变量

#### 后端环境变量
在 Vercel Dashboard 中为后端项目设置：
- `FREE_ASTROLOGY_API_KEY`: 你的 Free Astrology API 密钥
- `NODE_ENV`: production

#### 前端环境变量
在 Vercel Dashboard 中为前端项目设置：
- `NEXT_PUBLIC_API_BASE_URL`: 后端部署后的 URL（如：https://astro-backend.vercel.app）

### 4. 部署步骤

#### 方法一：使用脚本（推荐）
```bash
./deploy-vercel.sh
```

#### 方法二：手动部署

**部署后端：**
```bash
cd backend
vercel --prod
```

**部署前端：**
```bash
cd frontend
vercel --prod
```

## 📁 项目结构

```
backend/
├── api/                    # Vercel API 路由
│   ├── health.js          # 健康检查
│   └── astrology-chart.js # 占星图表 API
├── freeAstrologyClient.js # API 客户端
├── package.json
└── vercel.json           # Vercel 配置

frontend/
├── src/
├── package.json
└── next.config.js
```

## 🔧 配置说明

### 后端配置 (vercel.json)
- 使用 `@vercel/node` runtime
- 所有请求路由到 `server.js`
- 支持 CORS

### 前端配置
- 自动检测 Next.js
- 环境变量通过 `NEXT_PUBLIC_` 前缀暴露给客户端

## 🧪 测试部署

### 后端测试
```bash
# 健康检查
curl https://your-backend.vercel.app/api/health

# 占星图表 API
curl -X POST https://your-backend.vercel.app/api/astrology-chart \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "date": "1993-11-20",
    "time": "14:30",
    "city": "北京",
    "latitude": 39.9042,
    "longitude": 116.4074
  }'
```

### 前端测试
1. 打开前端 URL
2. 检查行星卡片布局（大屏应为 2 行 × 5 列）
3. 测试占星数据获取

## 🚨 常见问题

### 1. CORS 错误
- 后端已配置 CORS 允许所有来源
- 如需限制，修改 `api/astrology-chart.js` 中的 CORS 设置

### 2. API 密钥问题
- 确保在 Vercel Dashboard 中正确设置 `FREE_ASTROLOGY_API_KEY`
- 检查密钥是否有效

### 3. 环境变量未生效
- 确保变量名以 `NEXT_PUBLIC_` 开头（前端）
- 重新部署项目

### 4. 构建失败
- 检查 `package.json` 依赖
- 查看 Vercel 构建日志

## 📊 监控

- Vercel Dashboard 提供实时日志
- 可设置 Webhook 监控部署状态
- 建议设置错误监控（如 Sentry）

## 🔄 更新部署

```bash
# 更新代码后
git add .
git commit -m "Update for production"
git push

# Vercel 会自动重新部署
```

## 💡 优化建议

1. **CDN**: Vercel 自动提供全球 CDN
2. **缓存**: 可配置 API 缓存策略
3. **监控**: 集成 Vercel Analytics
4. **域名**: 绑定自定义域名
