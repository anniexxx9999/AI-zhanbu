# 完整工作流程示例

## 系统流程概述

```
用户输入 → API获取星盘 → 喂给大模型 → 生成分析报告
```

## 步骤详解

### 步骤1: 用户输入
用户在前端输入：
- 姓名
- 出生日期 (年月日)
- 出生时间 (时分秒)
- 出生地点 (城市)

### 步骤2: 系统自动获取星盘数据
调用 `/api/astrology/chart` 获取完整星盘数据

### 步骤3: 数据+提示词喂给大模型
将获取的星盘数据和用户提示词一起发送给 DeepSeek

### 步骤4: 生成专业分析报告
大模型根据专业提示词框架生成1500-2500字的分析报告

## API 调用示例

### 方式1: 一次性调用 (推荐)

```bash
curl -X POST http://localhost:3001/api/chart-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "birthInfo": {
      "name": "张三",
      "date": "1990-05-15",
      "time": "10:30:00",
      "city": "北京",
      "latitude": 39.9042,
      "longitude": 116.4074,
      "timezone": "Asia/Shanghai"
    },
    "prompt": "请对我进行全面的吠陀占星分析"
  }'
```

**这个API会自动：**
1. ✅ 根据 birthInfo 调用占星API获取星盘
2. ✅ 将星盘数据整理成专业格式
3. ✅ 结合用户prompt喂给大模型
4. ✅ 返回完整的分析报告

### 方式2: 分步调用 (自定义)

#### Step 1: 获取星盘数据
```bash
curl -X POST http://localhost:3001/api/astrology/chart \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "date": "1990-05-15",
    "time": "10:30:00",
    "city": "北京"
  }'
```

返回: 完整星盘数据 (包含 aiEnhancements)

#### Step 2: 基于现有星盘生成报告 (需要自行实现)

## 响应数据示例

### 完整分析报告响应

```json
{
  "success": true,
  "data": {
    "analysis": "# 命盘核心基调与人格特质分析\n\n## 上升点解读...\n\n## 关键领域深度分析\n\n### 事业与天命(10宫)...\n\n[完整的1500-2500字专业分析报告]",
    "chartData": {
      "birthInfo": {...},
      "risingSign": "Leo",
      "sunSign": "Taurus",
      "moonSign": "Scorpio",
      "planets": [...],
      "houses": [...],
      "aspects": [...],
      "aiEnhancements": {...}
    },
    "metadata": {
      "generatedAt": "2024-01-01T00:00:00.000Z",
      "source": "deepseek-ai",
      "prompt": "请对我进行全面的吠陀占星分析"
    }
  }
}
```

## 前端集成示例

### React/Next.js 调用代码

```typescript
async function generateAnalysisReport(birthInfo: BirthInfo, prompt: string) {
  const response = await fetch('/api/chart-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      birthInfo,
      prompt
    })
  });

  const result = await response.json();
  
  if (result.success) {
    // 显示分析报告
    displayAnalysis(result.data.analysis);
    // 可选: 保存星盘数据供后续使用
    saveChartData(result.data.chartData);
  }
}

// 使用示例
generateAnalysisReport(
  {
    name: "张三",
    date: "1990-05-15",
    time: "10:30:00",
    city: "北京"
  },
  "请对我进行全面的吠陀占星分析，包括事业、财富和感情运势"
);
```

## 数据流程

```
1. 用户输入生日信息
   ↓
2. 前端发送到 /api/chart-analysis
   ↓
3. 后端调用 freeAstrologyClient.getBasicChartInfo()
   ↓
4. 处理星盘数据 (processAstrologyData)
   ↓
5. 构造专业提示词 (包含星盘数据 + 用户prompt)
   ↓
6. 调用 deepseekClient.generateChartAnalysisReport()
   ↓
7. DeepSeek 根据专业框架生成报告
   ↓
8. 返回完整响应 (分析报告 + 星盘数据)
   ↓
9. 前端展示给用户
```

## 优势

✅ **自动化**: 用户只需输入生日和提示词
✅ **完整**: 自动获取星盘 + 生成分析
✅ **专业**: 使用吠陀占星大师级别的提示词框架
✅ **灵活**: 用户可以自定义分析重点
✅ **高效**: 一次调用完成所有流程

## 费用估算

每次完整分析:
- 星盘计算: 免费 (本地计算)
- AI 分析: ~3000 tokens = ¥0.04

