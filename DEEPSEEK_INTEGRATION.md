# DeepSeek API 集成说明

## 已完成的集成

### 1. DeepSeek Client (`backend/deepseekClient.js`)
创建了完整的 DeepSeek 客户端，支持：
- ✅ 星座个性描述生成
- ✅ 行星强弱分析
- ✅ 个性化建议生成
- ✅ 灵魂伴侣描述生成

### 2. 需要完成

#### 步骤 1: 设置 API Key
```bash
# 在项目根目录创建 .env 文件
DEEPSEEK_API_KEY=你的API密钥
```

#### 步骤 2: 在 server.js 中集成
在 `backend/server.js` 开头添加：
```javascript
const DeepSeekClient = require('./deepseekClient');
const deepseekClient = new DeepSeekClient(process.env.DEEPSEEK_API_KEY);
```

#### 步骤 3: 修改现有 API 端点
在以下端点中使用 DeepSeek：
- `/api/report-generate` - 生成报告
- `/api/soulmate-generate` - 生成灵魂伴侣描述
- 扩展 `/api/astrology/chart` 返回 AI 生成的描述

## API 方法

### generateSignDescription(signType, sign, context)
生成星座描述（lagna/moon/sun）

### analyzePlanetStrength(planets, houses, aspects)
分析行星强弱

### generatePersonalizedAdvice(chartData)
生成个性化建议

### generateSoulmateDescription(birthInfo, chartData)
生成灵魂伴侣描述

## 使用示例

```javascript
// 生成星座描述
const lagnaDesc = await deepseekClient.generateSignDescription(
  'lagna', 
  chartData.risingSign, 
  context
);

// 分析行星强弱
const planetStrength = await deepseekClient.analyzePlanetStrength(
  chartData.planets,
  chartData.houses,
  chartData.aspects
);
```

## 注意事项

1. API 调用有 rate limit，建议添加缓存
2. 每次调用需要 1-3 秒
3. 如果 API 失败，会自动返回 fallback 数据
4. 建议在生产环境添加错误监控

## 成本估算

- 每次调用约消耗 100-500 tokens
- DeepSeek 价格: ¥0.0014 / 1K tokens
- 每个用户完整报告约 ¥0.01-0.05
