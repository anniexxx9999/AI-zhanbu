# 🔮 Prokerala API 配置指南

## 📋 概述

Prokerala 是一个专业的占星术API服务，提供准确的吠陀占星计算。本指南将帮助您配置Prokerala API以获取真实的占星数据。

## 🚀 快速开始

### 1. 获取API凭证

1. 访问 [Prokerala API](https://api.prokerala.com)
2. 注册账户并登录
3. 在控制台中创建新的API应用
4. 获取 `CLIENT_ID` 和 `CLIENT_SECRET`

### 2. 配置环境变量

编辑 `/Users/xuan/Desktop/AI-zhanbu/backend/.env` 文件：

```bash
# Prokerala API Configuration
PROKERALA_CLIENT_ID=your_actual_client_id
PROKERALA_CLIENT_SECRET=your_actual_client_secret
PROKERALA_BASE_URL=https://api.prokerala.com
PROKERALA_DEFAULT_AYANAMSA=lahiri
```

### 3. 重启后端服务

```bash
cd /Users/xuan/Desktop/AI-zhanbu/backend
npm start
```

## 🔧 API认证流程

### OAuth2 Client Credentials 流程

Prokerala使用OAuth2 Client Credentials认证：

```http
POST /token HTTP/1.1
Host: api.prokerala.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>
```

**响应示例**：
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "astrology"
}
```

## 📊 支持的API端点

### 1. 出生图表 (Birth Chart)
```http
GET /v2/astrology/birth-chart
```

**参数**：
- `datetime`: 出生日期时间
- `latitude`: 纬度
- `longitude`: 经度
- `chart-type`: 图表类型 (rasi, navamsa, dasamsa)
- `ayanamsa`: 黄道偏移 (lahiri, raman, kp)

### 2. 行星位置 (Planet Positions)
```http
GET /v2/astrology/planet-position
```

### 3. 大运周期 (Dasha Periods)
```http
GET /v2/astrology/dasha-periods
```

### 4. 出生详情 (Birth Details)
```http
GET /v2/astrology/birth-details
```

## 🎯 使用示例

### JavaScript/Node.js
```javascript
const axios = require('axios');

class ProkeralaClient {
  constructor() {
    this.clientId = process.env.PROKERALA_CLIENT_ID;
    this.clientSecret = process.env.PROKERALA_CLIENT_SECRET;
    this.baseUrl = 'https://api.prokerala.com';
    this.accessToken = null;
  }

  async getAccessToken() {
    const response = await axios.post(`${this.baseUrl}/token`, {
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    this.accessToken = response.data.access_token;
    return this.accessToken;
  }

  async getBirthChart(params) {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    const response = await axios.get(`${this.baseUrl}/v2/astrology/birth-chart`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      params: {
        datetime: params.datetime,
        latitude: params.latitude,
        longitude: params.longitude,
        'chart-type': params.chartType,
        ayanamsa: params.ayanamsa || 'lahiri'
      }
    });

    return response.data;
  }
}
```

### Python
```python
import requests
import os

class ProkeralaClient:
    def __init__(self):
        self.client_id = os.getenv('PROKERALA_CLIENT_ID')
        self.client_secret = os.getenv('PROKERALA_CLIENT_SECRET')
        self.base_url = 'https://api.prokerala.com'
        self.access_token = None

    def get_access_token(self):
        response = requests.post(f'{self.base_url}/token', data={
            'grant_type': 'client_credentials',
            'client_id': self.client_id,
            'client_secret': self.client_secret
        })
        
        self.access_token = response.json()['access_token']
        return self.access_token

    def get_birth_chart(self, params):
        if not self.access_token:
            self.get_access_token()

        response = requests.get(f'{self.base_url}/v2/astrology/birth-chart', 
            headers={'Authorization': f'Bearer {self.access_token}'},
            params=params
        )
        
        return response.json()
```

## 🔄 集成到现有系统

### 1. 更新ProkeralaClient

系统已经包含了ProkeralaClient类，只需要配置环境变量即可：

```javascript
// 在 /Users/xuan/Desktop/AI-zhanbu/backend/dist/services/prokeralaClient.js
// 系统会自动读取环境变量
const clientId = process.env.PROKERALA_CLIENT_ID;
const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
```

### 2. 测试API连接

```bash
curl --noproxy localhost -X POST http://localhost:3001/api/astrology/chart \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试用户",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "北京",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }'
```

## 📈 数据质量提升

配置Prokerala API后，您将获得：

### 真实数据优势
- ✅ **天文精度**: 基于真实天文计算
- ✅ **专业分析**: 包含详细的吠陀占星分析
- ✅ **分盘系统**: 支持D1、D9、D10等多种分盘
- ✅ **大运数据**: 准确的Vimshottari大运计算
- ✅ **宫位分析**: 详细的12宫位分析

### 数据格式
```json
{
  "data": {
    "planets": [
      {
        "name": "Sun",
        "longitude": 268.43,
        "latitude": 0.0,
        "sign": "Scorpio",
        "house": 8,
        "retrograde": false,
        "speed": 1.0
      }
    ],
    "houses": [
      {
        "number": 1,
        "sign": "Aries",
        "longitude": 0.0,
        "lord": "Mars"
      }
    ],
    "dasha": {
      "current": {
        "planet": "Jupiter",
        "start": "2020-01-01",
        "end": "2026-01-01"
      }
    }
  }
}
```

## 💰 成本考虑

### 免费额度
- 每月5,000 credits
- 5 requests/minute
- 基础占星计算

### 付费计划
- 标准计划: $0.01/call
- 专业计划: 更高限额
- 企业计划: 定制方案

## 🔧 故障排除

### 常见问题

1. **认证失败**
   ```
   Error: Prokerala API credentials are not configured
   ```
   **解决方案**: 检查环境变量配置

2. **API限制**
   ```
   Error: Rate limit exceeded
   ```
   **解决方案**: 实现请求限流和缓存

3. **网络超时**
   ```
   Error: Request timeout
   ```
   **解决方案**: 增加超时时间，实现重试机制

### 调试步骤

1. 检查环境变量：
   ```bash
   echo $PROKERALA_CLIENT_ID
   echo $PROKERALA_CLIENT_SECRET
   ```

2. 测试API连接：
   ```bash
   curl -X POST https://api.prokerala.com/token \
     -d "grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET"
   ```

3. 查看日志：
   ```bash
   tail -f /Users/xuan/Desktop/AI-zhanbu/backend/server.log
   ```

## 📚 相关资源

- [Prokerala API文档](https://api.prokerala.com/docs)
- [OAuth2认证指南](https://oauth.net/2/)
- [吠陀占星学基础](https://en.wikipedia.org/wiki/Hindu_astrology)

## 🎯 下一步

1. **获取API凭证**: 注册Prokerala账户
2. **配置环境变量**: 更新.env文件
3. **重启服务**: 应用新配置
4. **测试连接**: 验证API工作正常
5. **优化性能**: 实现缓存和限流

配置完成后，您的AstroSoul系统将能够提供专业级的真实占星数据！🌟
