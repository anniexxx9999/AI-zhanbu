# 🔄 自动切换到Prokerala API指南

## 📊 当前状态分析

从系统日志可以看到：

### 当前数据源状态
- ❌ **VedAstro API**: 已达到免费限额
- ❌ **Prokerala API**: 需要配置真实凭证
- ✅ **模拟数据**: 作为回退正常工作

### 系统日志显示的问题
```
❌ VedAstro API失败: Error: We are happy you're enjoying this easy to use astrology API. But sadly you've hit your free limit.
[ProkeralaClient] Missing PROKERALA_CLIENT_ID or PROKERALA_CLIENT_SECRET environment variables.
```

## 🚀 自动切换到Prokerala的步骤

### 1. 获取Prokerala API凭证

1. **访问官网**: https://api.prokerala.com
2. **注册账户**: 创建免费账户
3. **创建应用**: 在控制台中创建新的API应用
4. **获取凭证**: 复制 `CLIENT_ID` 和 `CLIENT_SECRET`

### 2. 更新环境变量

编辑 `/Users/xuan/Desktop/AI-zhanbu/backend/.env` 文件：

```bash
# 替换为真实的Prokerala凭证
PROKERALA_CLIENT_ID=your_actual_client_id
PROKERALA_CLIENT_SECRET=your_actual_client_secret
```

### 3. 重启后端服务

```bash
# 停止当前服务
pkill -f "node dist/server.js"

# 重新启动
cd /Users/xuan/Desktop/AI-zhanbu/backend
npm start
```

## 🔧 系统自动切换机制

### 数据源优先级
系统已经配置了以下优先级：

1. **Prokerala API** (主要) - 需要配置凭证
2. **VedAstro API** (备用) - 已超限额
3. **模拟数据** (最终回退) - 当前使用

### 自动切换逻辑
```javascript
// 系统会自动按以下顺序尝试：
try {
  // 1. 尝试Prokerala API
  if (prokeralaClient.isConfigured()) {
    return await prokeralaClient.getChart(params);
  }
} catch (error) {
  // 2. 尝试VedAstro API
  try {
    return await vedastroClient.getChart(params);
  } catch (error) {
    // 3. 使用模拟数据回退
    return generateMockData(params);
  }
}
```

## 📈 配置Prokerala后的效果

### 数据质量提升
- ✅ **真实天文计算**: 基于Prokerala的专业算法
- ✅ **完整分盘系统**: 支持D1、D9、D10等
- ✅ **大运数据**: 准确的Vimshottari大运
- ✅ **专业分析**: 详细的吠陀占星分析

### 性能优势
- ✅ **更快响应**: Prokerala API响应更快
- ✅ **更高限额**: 每月5,000 credits免费额度
- ✅ **更稳定**: 商业级API服务

## 🎯 立即行动步骤

### 步骤1: 获取API凭证
1. 访问 https://api.prokerala.com
2. 注册并创建API应用
3. 获取 `CLIENT_ID` 和 `CLIENT_SECRET`

### 步骤2: 更新配置
```bash
# 编辑环境变量文件
nano /Users/xuan/Desktop/AI-zhanbu/backend/.env

# 更新以下行：
PROKERALA_CLIENT_ID=your_actual_client_id
PROKERALA_CLIENT_SECRET=your_actual_client_secret
```

### 步骤3: 重启服务
```bash
# 停止当前服务
pkill -f "node dist/server.js"

# 重新启动
cd /Users/xuan/Desktop/AI-zhanbu/backend
npm start
```

### 步骤4: 验证切换
```bash
# 测试API是否使用Prokerala
curl --noproxy localhost -X POST http://localhost:3001/api/astrology/chart \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","date":"1993-11-20","time":"19:55","city":"北京","latitude":39.9042,"longitude":116.4074,"timezone":"Asia/Shanghai"}' \
  | jq '.data.source'
```

## 🔍 验证切换成功

### 成功指标
- ✅ **数据源**: 显示 "Prokerala" 而不是 "VedAstro"
- ✅ **响应时间**: 更快的API响应
- ✅ **数据质量**: 更详细的占星数据
- ✅ **无错误**: 不再显示API限额错误

### 预期响应
```json
{
  "success": true,
  "data": {
    "source": "Prokerala",
    "planets": [...],
    "houses": [...],
    "dasha": [...]
  }
}
```

## 🚨 故障排除

### 常见问题

1. **认证失败**
   ```
   Error: Prokerala API credentials are not configured
   ```
   **解决方案**: 检查CLIENT_ID和CLIENT_SECRET是否正确

2. **API限制**
   ```
   Error: Rate limit exceeded
   ```
   **解决方案**: 实现请求限流和缓存

3. **网络超时**
   ```
   Error: Request timeout
   ```
   **解决方案**: 检查网络连接

### 调试步骤

1. **检查环境变量**:
   ```bash
   echo $PROKERALA_CLIENT_ID
   echo $PROKERALA_CLIENT_SECRET
   ```

2. **查看服务日志**:
   ```bash
   tail -f /Users/xuan/Desktop/AI-zhanbu/backend/server.log
   ```

3. **测试API连接**:
   ```bash
   curl -X POST https://api.prokerala.com/token \
     -d "grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET"
   ```

## 🎉 切换完成后的优势

### 数据质量
- **专业级数据**: 基于真实天文计算
- **完整功能**: 支持所有主要占星功能
- **高精度**: 精确到秒级的计算

### 系统性能
- **更快响应**: 商业级API性能
- **更高限额**: 每月5,000 credits
- **更稳定**: 99.9%可用性保证

### 商业价值
- **专业服务**: 支持付费用户
- **扩展性**: 支持更多功能
- **可靠性**: 商业级服务保障

## 📚 相关资源

- [Prokerala API文档](https://api.prokerala.com/docs)
- [系统配置指南](./PROKERALA_CONFIGURATION_GUIDE.md)
- [API测试报告](./SPECIFIC_BIRTH_DATA_TEST.md)

**配置Prokerala API后，您的系统将自动切换到专业级数据源，提供更高质量的占星服务！** 🌟
