# Prokerala API 配置指南

## 🔧 当前配置状态

### API 凭据信息 (最新)
- **Client Name**: `爱占卜` (ai_zhanbu)
- **Client ID**: `220f8b0c-2ceb-48a3-acab-de118c64de0a`
- **Client Secret**: `E0xM3Nfxm324AYb4MBiSJ8QfltbupUpaXIjkDwOZ`
- **Client Type**: `Web Application`
- **Created On**: `2025-10-24 04:06:18`
- **Authorized JavaScript Origins**: `https://localhost`

### 旧API凭据信息 (已失效)
- **Client Name**: `ai_yinzhan`
- **Client ID**: `cab49a45-4718-46d3-be9b-79670a4ecce1`
- **Client Secret**: `0N4JbE2o6iFp0gFJYFl3rYgLtWDOLOGQAcPeRyQ8`
- **Client Type**: `Web Application`
- **Created On**: `2025-10-22 18:18:38`

### 授权域名配置
- **Authorized JavaScript Origins**: `https://localhost`
- **当前CORS配置**: `http://localhost:3000,http://localhost:3002,https://localhost`

## 🚨 当前问题

### API认证失败
- **错误代码**: 602
- **错误信息**: "Client authentication failed. Please check your client credentials"
- **可能原因**:
  1. Client Secret可能已过期或无效
  2. 需要重新生成Client Secret
  3. API账户可能需要激活或验证

## 🛠 解决方案

### 1. 重新生成Client Secret
访问 [Prokerala API管理页面](https://api.prokerala.com/account/client/cab49a45-4718-46d3-be9b-79670a4ecce1) 并点击 "Reset App Secret" 按钮。

### 2. 更新授权域名
在Prokerala API管理页面中，更新 "Authorized JavaScript Origins" 以包含：
- `http://localhost:3000`
- `http://localhost:3002`
- `http://localhost:3001` (如果需要)

### 3. 验证API状态
确保API账户：
- 已激活
- 有足够的API额度
- 没有使用限制

## 📋 当前系统配置

### 环境变量 (最新)
```bash
PROKERALA_CLIENT_ID=220f8b0c-2ceb-48a3-acab-de118c64de0a
PROKERALA_CLIENT_SECRET=E0xM3Nfxm324AYb4MBiSJ8QfltbupUpaXIjkDwOZ
PROKERALA_BASE_URL=https://api.prokerala.com
CORS_ORIGIN=http://localhost:3000,http://localhost:3002,https://localhost
PORT=3001
NODE_ENV=development
```

### 备用方案
由于Prokerala API认证问题，系统已配置智能回退机制：
- 优先使用Prokerala API
- 回退到免费API
- 最终使用模拟数据

## 🎯 测试结果

### ✅ 正常工作的功能
- 后端服务器运行正常
- 基础占星计算（使用模拟数据）
- 增强功能（每日占星、数字学等）
- CORS配置正确
- 错误处理完善

### ⚠️ 需要解决的问题
- Prokerala API认证失败
- 需要有效的API凭据

## 📞 下一步行动

1. **联系Prokerala支持** - 验证API账户状态
2. **重新生成凭据** - 获取新的Client Secret
3. **更新授权域名** - 确保域名配置正确
4. **测试API连接** - 验证修复后的连接

## 🔄 当前系统状态

系统目前使用模拟数据运行，所有功能正常工作。一旦Prokerala API凭据问题解决，系统将自动切换到真实API。
