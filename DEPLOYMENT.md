# 🚀 AstroSoul 部署指南

## 📋 项目架构

- **前端**: Next.js 14 + React 18 + TypeScript
- **后端**: Express.js + TypeScript
- **数据库**: 无数据库依赖（使用外部API）
- **部署方式**: 多种选择

## 🎯 推荐部署方案

### 方案一：Vercel + Railway (推荐)

#### 前端部署到 Vercel
1. **连接 GitHub 仓库**
   ```bash
   # 在 Vercel 控制台连接你的 GitHub 仓库
   # https://vercel.com/dashboard
   ```

2. **配置构建设置**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

3. **环境变量设置**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_DEV_BACKEND_PORT=3000
   ```

#### 后端部署到 Railway
1. **连接 GitHub 仓库**
   ```bash
   # 在 Railway 控制台连接你的 GitHub 仓库
   # https://railway.app/dashboard
   ```

2. **配置构建设置**
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **环境变量设置**
   ```
   NODE_ENV=production
   PORT=3000
   FREEASTROLOGY_API_KEY=your_api_key
   PROKERALA_API_KEY=your_api_key
   VEDASTRO_API_KEY=your_api_key
   ```

### 方案二：Docker 部署

#### 创建 Dockerfile

**前端 Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

**后端 Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - FREEASTROLOGY_API_KEY=${FREEASTROLOGY_API_KEY}
      - PROKERALA_API_KEY=${PROKERALA_API_KEY}
      - VEDASTRO_API_KEY=${VEDASTRO_API_KEY}
```

### 方案三：传统服务器部署

#### 使用 PM2 管理进程

1. **安装 PM2**
   ```bash
   npm install -g pm2
   ```

2. **创建 PM2 配置文件** (`ecosystem.config.js`):
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'astrosoul-backend',
         script: './backend/dist/server.js',
         cwd: './backend',
         env: {
           NODE_ENV: 'production',
           PORT: 3001
         }
       },
       {
         name: 'astrosoul-frontend',
         script: 'npm',
         args: 'start',
         cwd: './frontend',
         env: {
           NODE_ENV: 'production',
           PORT: 3000,
           NEXT_PUBLIC_API_URL: 'http://localhost:3001'
         }
       }
     ]
   };
   ```

3. **部署脚本** (`deploy.sh`):
   ```bash
   #!/bin/bash
   
   # 拉取最新代码
   git pull origin main
   
   # 安装依赖
   cd frontend && npm install && npm run build
   cd ../backend && npm install && npm run build
   
   # 重启服务
   pm2 restart ecosystem.config.js
   ```

## 🔧 部署步骤

### 1. 准备环境变量

创建生产环境配置文件：

**前端** (`.env.production`):
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_DEV_BACKEND_PORT=3000
```

**后端** (`.env.production`):
```
NODE_ENV=production
PORT=3000
FREEASTROLOGY_API_KEY=your_freeastrology_api_key
PROKERALA_API_KEY=your_prokerala_api_key
VEDASTRO_API_KEY=your_vedastro_api_key
```

### 2. 构建项目

```bash
# 构建前端
cd frontend
npm install
npm run build

# 构建后端
cd ../backend
npm install
npm run build
```

### 3. 配置域名和SSL

- 购买域名
- 配置DNS解析
- 申请SSL证书（Let's Encrypt免费）
- 配置反向代理（Nginx）

### 4. 监控和日志

```bash
# 使用PM2监控
pm2 monit

# 查看日志
pm2 logs

# 设置开机自启
pm2 startup
pm2 save
```

## 🌐 推荐平台

### 免费方案
1. **Vercel** (前端) + **Railway** (后端)
2. **Netlify** (前端) + **Heroku** (后端)
3. **GitHub Pages** (静态前端) + **Render** (后端)

### 付费方案
1. **AWS** (EC2 + S3 + CloudFront)
2. **Google Cloud** (Compute Engine + Cloud Storage)
3. **阿里云** (ECS + OSS + CDN)
4. **腾讯云** (CVM + COS + CDN)

## 📊 性能优化

### 前端优化
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### 后端优化
```javascript
// 启用压缩
app.use(compression());

// 设置缓存
app.use(express.static('public', {
  maxAge: '1d'
}));

// 限流
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 100次请求
}));
```

## 🔒 安全配置

### 1. 环境变量安全
- 使用 `.env` 文件存储敏感信息
- 确保 `.env` 文件在 `.gitignore` 中
- 使用不同的密钥用于开发和生产环境

### 2. HTTPS 配置
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 防火墙配置
```bash
# 只开放必要端口
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

## 📈 监控和维护

### 1. 健康检查
```javascript
// 后端健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### 2. 日志管理
```bash
# 使用 PM2 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. 备份策略
```bash
# 定期备份代码
git push origin main

# 备份环境变量
cp .env .env.backup
```

## 🚀 快速部署命令

```bash
# 1. 克隆仓库
git clone https://github.com/anniexxx9999/AI-zhanbu.git
cd AI-zhanbu

# 2. 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 3. 构建项目
cd frontend && npm run build
cd ../backend && npm run build

# 4. 启动服务
cd frontend && npm start &
cd ../backend && npm start &
```

## 📞 技术支持

如果在部署过程中遇到问题，请检查：

1. **端口冲突** - 确保端口3000和3001未被占用
2. **环境变量** - 确保所有必要的API密钥已配置
3. **网络连接** - 确保服务器可以访问外部API
4. **日志文件** - 查看PM2日志或应用日志

---

**祝您部署顺利！🌟**
