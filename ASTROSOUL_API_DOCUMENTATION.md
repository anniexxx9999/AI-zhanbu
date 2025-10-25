# 🔮 AstroSoul 星盘数据API文档

## 📋 概述

AstroSoul 提供完整的占星术API服务，支持D1/D9/D10分盘、大运数据、兼容性分析等功能。所有API都支持Prokerala集成和模拟数据回退。

## 🚀 基础信息

- **Base URL**: `http://localhost:3001/api/astrology`
- **Content-Type**: `application/json`
- **认证**: 无需认证（开发环境）

## 📊 核心API端点

### 1. 基础星盘数据

#### 获取D1本命盘
```http
POST /api/astrology/chart
```

**请求体:**
```json
{
  "name": "张三",
  "date": "1990-05-15",
  "time": "14:30",
  "city": "北京",
  "latitude": 39.9042,
  "longitude": 116.4074,
  "timezone": "Asia/Shanghai"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "birthInfo": { ... },
    "planets": [
      {
        "name": "Sun",
        "symbol": "☉",
        "longitude": 45.5,
        "latitude": 0,
        "house": 1,
        "sign": "Taurus",
        "signSymbol": "♉",
        "degree": 15,
        "minute": 30,
        "second": 0,
        "retrograde": false,
        "speed": 1.0
      }
    ],
    "houses": [ ... ],
    "aspects": [ ... ],
    "lagna": 60,
    "lagnaDetails": { ... },
    "moonSign": "Cancer",
    "sunSign": "Taurus",
    "risingSign": "Gemini",
    "chartType": "D1_Rasi",
    "ayanamsa": "Lahiri",
    "timestamp": "2025-01-25T12:00:00.000Z"
  },
  "timestamp": "2025-01-25T12:00:00.000Z"
}
```

### 2. 分盘数据 (Varga Charts)

#### 获取D1本命盘 (Rasi)
```http
POST /api/astrology/varga/rasi
```

#### 获取D9九分盘 (Navamsa)
```http
POST /api/astrology/varga/navamsa
```

#### 获取D10十分盘 (Dasamsa)
```http
POST /api/astrology/varga/dasamsa
```

**请求体:** 同基础星盘数据

**响应:** 同基础星盘数据格式，但`chartType`字段会相应变化：
- D1: `"D1_Rasi"`
- D9: `"D9_Navamsa"`
- D10: `"D10_Dasamsa"`

### 3. 大运数据 (Vimshottari Dasha)

#### 获取大运信息
```http
POST /api/astrology/dasha
```

**请求体:** 同基础星盘数据

**响应:**
```json
{
  "success": true,
  "data": {
    "birthInfo": { ... },
    "currentDasha": {
      "planet": "Jupiter",
      "startDate": "2020-01-01",
      "endDate": "2026-01-01",
      "remainingYears": 1,
      "remainingMonths": 0,
      "remainingDays": 0
    },
    "nextDasha": {
      "planet": "Saturn",
      "startDate": "2026-01-01",
      "endDate": "2042-01-01",
      "duration": 16
    },
    "allPeriods": [
      {
        "planet": "Sun",
        "startDate": "1990-01-01",
        "endDate": "1996-01-01",
        "duration": 6,
        "level": "Mahā"
      }
    ],
    "timestamp": "2025-01-25T12:00:00.000Z"
  },
  "timestamp": "2025-01-25T12:00:00.000Z"
}
```

### 4. 完整星盘数据

#### 获取完整数据 (D1 + D9 + D10 + Dasha)
```http
POST /api/astrology/complete
```

**请求体:** 同基础星盘数据

**响应:**
```json
{
  "success": true,
  "data": {
    "birthInfo": { ... },
    "birthDetails": { ... },
    "charts": {
      "d1": { ... },
      "d9": { ... },
      "d10": { ... }
    },
    "dasha": { ... },
    "summary": {
      "risingSign": "Gemini",
      "moonSign": "Cancer",
      "sunSign": "Taurus",
      "currentDasha": { ... },
      "nextDasha": { ... }
    },
    "timestamp": "2025-01-25T12:00:00.000Z"
  },
  "timestamp": "2025-01-25T12:00:00.000Z"
}
```

### 5. 出生详情

#### 获取出生详情
```http
POST /api/astrology/birth-details
```

**请求体:** 同基础星盘数据

**响应:**
```json
{
  "success": true,
  "data": {
    "birthInfo": { ... },
    "location": {
      "name": "北京",
      "latitude": 39.9042,
      "longitude": 116.4074,
      "timezone": "Asia/Shanghai"
    },
    "birthTime": {
      "date": "1990-05-15",
      "time": "14:30",
      "timezone": "Asia/Shanghai",
      "utc": "1990-05-15T06:30:00.000Z"
    },
    "astronomical": {
      "sunrise": "05:30",
      "sunset": "19:30",
      "moonPhase": "Waxing Crescent",
      "moonSign": "Cancer"
    },
    "timestamp": "2025-01-25T12:00:00.000Z"
  },
  "timestamp": "2025-01-25T12:00:00.000Z"
}
```

## 🔧 其他API端点

### 宫位分析
```http
POST /api/astrology/houses
POST /api/astrology/houses/:houseNumber
```

### 行星位置
```http
POST /api/astrology/planets
```

### 兼容性分析
```http
POST /api/astrology/compatibility
```

### 灵魂伴侣分析
```http
POST /api/astrology/soulmate
```

### 补救措施
```http
POST /api/astrology/remedies
```

## 📝 数据结构说明

### 行星数据 (Planet)
```typescript
interface Planet {
  name: string;           // 行星名称
  symbol: string;         // 行星符号
  longitude: number;      // 经度
  latitude: number;       // 纬度
  house: number;          // 宫位 (1-12)
  sign: string;           // 星座
  signSymbol: string;     // 星座符号
  degree: number;         // 度数
  minute: number;        // 分
  second: number;         // 秒
  retrograde: boolean;    // 是否逆行
  speed: number;          // 速度
}
```

### 宫位数据 (House)
```typescript
interface House {
  number: number;         // 宫位编号 (1-12)
  name: string;           // 宫位名称 (中文)
  nameEn: string;         // 宫位名称 (英文)
  sanskrit: string;       // 梵文名称
  sign: string;           // 宫位星座
  signSymbol: string;     // 星座符号
  lord: string;           // 宫主星
  lordSymbol: string;     // 宫主星符号
  cuspLongitude: number;  // 宫位起点经度
  planets: Planet[];      // 宫位内行星
  rating: number;         // 评分 (1-5)
  strength: number;       // 强度
}
```

### 相位数据 (Aspect)
```typescript
interface Aspect {
  from: string;           // 起始行星
  to: string;             // 目标行星
  type: string;           // 相位类型
  orb: number;            // 容许度
  strength: number;       // 强度
  description: string;    // 描述
}
```

## 🎯 使用示例

### JavaScript/Node.js
```javascript
// 获取完整星盘数据
async function getCompleteChartData(birthInfo) {
  try {
    const response = await fetch('http://localhost:3001/api/astrology/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthInfo)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

// 使用示例
const birthInfo = {
  name: "张三",
  date: "1990-05-15",
  time: "14:30",
  city: "北京",
  latitude: 39.9042,
  longitude: 116.4074,
  timezone: "Asia/Shanghai"
};

getCompleteChartData(birthInfo).then(data => {
  console.log('完整星盘数据:', data);
});
```

### Python
```python
import requests
import json

def get_complete_chart_data(birth_info):
    url = "http://localhost:3001/api/astrology/complete"
    headers = {"Content-Type": "application/json"}
    
    response = requests.post(url, json=birth_info, headers=headers)
    return response.json()

# 使用示例
birth_info = {
    "name": "张三",
    "date": "1990-05-15",
    "time": "14:30",
    "city": "北京",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
}

data = get_complete_chart_data(birth_info)
print("完整星盘数据:", json.dumps(data, indent=2, ensure_ascii=False))
```

## 🔄 数据回退机制

系统采用多层回退机制确保服务可用性：

1. **Prokerala API** (主要数据源)
2. **VedAstro API** (备用数据源)
3. **Free Astrology API** (免费数据源)
4. **模拟数据** (最终回退)

## ⚠️ 注意事项

1. **时区处理**: 建议提供准确的时区信息
2. **经纬度**: 如果未提供，系统会尝试根据城市名解析
3. **API限制**: 当前使用模拟数据，生产环境需要配置Prokerala API密钥
4. **数据格式**: 所有角度数据以度为单位，时间格式为ISO 8601

## 🚀 快速开始

1. 确保后端服务运行在 `http://localhost:3001`
2. 发送POST请求到相应端点
3. 处理响应数据
4. 根据需要调用其他相关API

## 📞 技术支持

如有问题，请检查：
1. 后端服务是否正常运行
2. 请求格式是否正确
3. 网络连接是否正常
4. 查看控制台日志获取详细错误信息
