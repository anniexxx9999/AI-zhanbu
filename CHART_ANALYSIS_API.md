# 命盘分析报告 API

## 新增功能

已添加根据自定义提示词生成命盘分析报告的功能。

## API 端点

### POST `/api/chart-analysis`

根据提示词生成个性化的命盘分析报告。

### 请求参数

```json
{
  "birthInfo": {
    "name": "用户姓名",
    "date": "1993-11-20",
    "time": "14:30",
    "city": "北京",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  },
  "prompt": "请分析我2024年的财运和事业发展"
}
```

**参数说明**：
- `birthInfo` (可选): 出生信息，如果不提供将使用示例数据
- `prompt` (必需): 你的分析要求和问题

### 响应示例

```json
{
  "success": true,
  "data": {
    "analysis": "基于你的星盘分析...",
    "chartData": {
      "risingSign": "Leo",
      "sunSign": "Scorpio",
      ...
    },
    "metadata": {
      "generatedAt": "2024-01-01T00:00:00.000Z",
      "source": "deepseek-ai",
      "prompt": "请分析我2024年的财运"
    }
  }
}
```

## 使用示例

### 1. 分析财运

```bash
curl -X POST http://localhost:3001/api/chart-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "birthInfo": {
      "name": "张三",
      "date": "1990-05-15",
      "time": "10:30",
      "city": "上海"
    },
    "prompt": "请详细分析我2024年的财运，包括收入趋势、投资机会和需要注意的财务风险"
  }'
```

### 2. 分析感情运势

```bash
curl -X POST http://localhost:3001/api/chart-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "birthInfo": {
      "name": "李四",
      "date": "1995-08-20",
      "time": "15:45",
      "city": "广州"
    },
    "prompt": "分析我的感情运势，何时会遇到真爱，理想的伴侣特征是什么"
  }'
```

### 3. 分析事业发展

```bash
curl -X POST http://localhost:3001/api/chart-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "birthInfo": {
      "name": "王五",
      "date": "1988-12-10",
      "time": "09:00",
      "city": "深圳"
    },
    "prompt": "分析我的事业发展方向，最适合的行业和职业是什么，什么时候会有重要转折点"
  }'
```

### 4. 综合分析

```bash
curl -X POST http://localhost:3001/api/chart-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "birthInfo": {
      "name": "赵六",
      "date": "1992-03-25",
      "time": "20:15",
      "city": "杭州"
    },
    "prompt": "请对我的人生进行全面的占星分析，包括性格特质、人生使命、主要机遇和挑战"
  }'
```

## 提示词建议

### 好的提示词示例：

✅ "分析我2024年的整体运势"
✅ "我的性格有什么特点，优势和挑战是什么"
✅ "分析我的财运和事业发展趋势"
✅ "我的感情运势如何，理想的伴侣是什么样的"
✅ "我在哪些领域有天赋，应该如何发展"

### 不好的提示词示例：

❌ "你好" (太模糊)
❌ "分析" (不够具体)
❌ "告诉我运势" (不完整)

## 分析内容

AI 会根据你的提示词和星盘数据生成：
- 详细的占星分析
- 专业的解读和建议
- 具体的行动指导
- 温暖而专业的语言

## 成本

每次调用约消耗 1000-3000 tokens
成本约 ¥0.02-0.05 每次

