# 🔮 Prokerala API 完整配置指南

## 📋 当前状态

✅ **API连接**: 正常  
✅ **认证端点**: 可访问  
⚠️ **凭证配置**: 需要真实凭证  

## 🚀 配置步骤

### 1. 获取Prokerala API凭证

1. **访问官网**: https://api.prokerala.com
2. **注册账户**: 创建免费账户
3. **创建应用**: 在控制台中创建新的API应用
4. **获取凭证**: 复制 `CLIENT_ID` 和 `CLIENT_SECRET`

### 2. 更新环境变量

编辑 `/Users/xuan/Desktop/AI-zhanbu/backend/.env` 文件：

```bash
# 将以下占位符替换为真实凭证
PROKERALA_CLIENT_ID=your_actual_client_id_here
PROKERALA_CLIENT_SECRET=your_actual_client_secret_here
```

### 3. 重启后端服务

```bash
cd /Users/xuan/Desktop/AI-zhanbu/backend
npm start
```

## 🔧 API认证流程

### OAuth2 Client Credentials

```http
POST /token HTTP/1.1
Host: api.prokerala.com
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>
```

**成功响应**:
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
Authorization: Bearer <access_token>
```

**参数**:
- `datetime`: 出生日期时间 (ISO 8601格式)
- `latitude`: 纬度
- `longitude`: 经度  
- `chart-type`: 图表类型 (rasi, navamsa, dasamsa)
- `ayanamsa`: 黄道偏移 (lahiri, raman, kp)

### 2. 行星位置 (Planet Positions)
```http
GET /v2/astrology/planet-position
Authorization: Bearer <access_token>
```

### 3. 大运周期 (Dasha Periods)
```http
GET /v2/astrology/dasha-periods
Authorization: Bearer <access_token>
```

### 4. 出生详情 (Birth Details)
```http
GET /v2/astrology/birth-details
Authorization: Bearer <access_token>
```

## 🎯 使用示例

### 测试API连接

```bash
# 1. 获取访问令牌
curl -X POST https://api.prokerala.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"

# 2. 使用令牌调用API
curl -X GET "https://api.prokerala.com/v2/astrology/birth-chart?datetime=1993-11-20T19:55:00+08:00&latitude=39.9042&longitude=116.4074&chart-type=rasi&ayanamsa=lahiri" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### JavaScript集成

```javascript
class ProkeralaClient {
  constructor() {
    this.clientId = process.env.PROKERALA_CLIENT_ID;
    this.clientSecret = process.env.PROKERALA_CLIENT_SECRET;
    this.baseUrl = 'https://api.prokerala.com';
    this.accessToken = null;
  }

  async getAccessToken() {
    const response = await fetch(`${this.baseUrl}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`
    });
    
    const data = await response.json();
    this.accessToken = data.access_token;
    return this.accessToken;
  }

  async getBirthChart(params) {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    const queryParams = new URLSearchParams({
      datetime: params.datetime,
      latitude: params.latitude,
      longitude: params.longitude,
      'chart-type': params.chartType,
      ayanamsa: params.ayanamsa || 'lahiri'
    });

    const response = await fetch(`${this.baseUrl}/v2/astrology/birth-chart?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    return await response.json();
  }
}
```

## 🔄 系统集成

### 当前系统状态

系统已经包含完整的Prokerala集成：

1. **ProkeralaClient类**: `/backend/dist/services/prokeralaClient.js`
2. **API路由**: `/backend/dist/routes/astrology.js`
3. **服务层**: `/backend/dist/services/astrologyService.js`

### 数据流

```
用户请求 → 后端API → ProkeralaClient → Prokerala API → 真实数据
                ↓
            数据标准化 → 用户响应
```

### 回退机制

```
Prokerala API (主要) → VedAstro API (备用) → 模拟数据 (最终)
```

## 📈 数据质量提升

配置Prokerala后，您将获得：

### 真实数据优势
- ✅ **天文精度**: 基于真实天文计算
- ✅ **专业分析**: 详细的吠陀占星分析
- ✅ **分盘系统**: D1、D9、D10等多种分盘
- ✅ **大运数据**: 准确的Vimshottari大运
- ✅ **宫位分析**: 详细的12宫位分析

### 数据格式示例

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
        "speed": 1.0,
        "dignity": "debilitated"
      }
    ],
    "houses": [
      {
        "number": 1,
        "sign": "Aries",
        "longitude": 0.0,
        "lord": "Mars",
        "strength": "strong"
      }
    ],
    "dasha": {
      "current": {
        "planet": "Jupiter",
        "start": "2020-01-01",
        "end": "2026-01-01",
        "subPeriods": []
      }
    }
  }
}
```

## 💰 成本考虑

### 免费计划
- 每月5,000 credits
- 5 requests/minute
- 基础占星计算

### 付费计划
- 标准计划: $0.01/call
- 专业计划: 更高限额
- 企业计划: 定制方案

## 🔧 故障排除

### 常见错误

1. **认证失败**
   ```
   {"status":"error","errors":[{"title":"Authentication Error","detail":"Client authentication failed"}]}
   ```
   **解决方案**: 检查CLIENT_ID和CLIENT_SECRET

2. **API限制**
   ```
   {"status":"error","errors":[{"title":"Rate Limit Exceeded"}]}
   ```
   **解决方案**: 实现请求限流和缓存

3. **网络超时**
   ```
   Error: Request timeout
   ```
   **解决方案**: 增加超时时间，实现重试机制

### 调试步骤

1. **检查环境变量**:
   ```bash
   echo $PROKERALA_CLIENT_ID
   echo $PROKERALA_CLIENT_SECRET
   ```

2. **测试API连接**:
   ```bash
   curl -X POST https://api.prokerala.com/token \
     -d "grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET"
   ```

3. **查看系统日志**:
   ```bash
   tail -f /Users/xuan/Desktop/AI-zhanbu/backend/server.log
   ```

## 🎯 下一步行动

### 立即行动
1. **获取API凭证**: 注册Prokerala账户
2. **配置环境变量**: 更新.env文件
3. **重启服务**: 应用新配置
4. **测试连接**: 验证API工作正常

### 优化建议
1. **实现缓存**: 减少API调用次数
2. **错误处理**: 完善错误处理机制
3. **监控系统**: 添加API使用监控
4. **性能优化**: 优化响应时间

## 📚 相关资源

- [Prokerala API文档](https://api.prokerala.com/docs)
- [OAuth2认证指南](https://oauth.net/2/)
- [吠陀占星学基础](https://en.wikipedia.org/wiki/Hindu_astrology)
- [系统API文档](./ASTROSOUL_API_DOCUMENTATION.md)

## 🎉 配置完成后的效果

配置Prokerala API后，您的AstroSoul系统将能够：

1. **提供真实数据**: 基于真实天文计算的占星数据
2. **专业级分析**: 详细的吠陀占星分析
3. **完整功能**: 支持所有主要占星功能
4. **高可靠性**: 多层回退机制确保服务稳定

**开始配置，享受专业级占星服务！** 🌟
