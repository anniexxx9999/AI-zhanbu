# Free Astrology API 配置指南

## 1. 获取API密钥

1. 访问 [Free Astrology API](https://json.freeastrologyapi.com/)
2. 注册账户并获取API密钥
3. 将API密钥替换到配置中

## 2. 配置环境变量

在 `backend/` 目录下创建 `.env` 文件：

```bash
# Free Astrology API Configuration
FREE_ASTROLOGY_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 3. 重启后端服务

```bash
cd backend
node server.js
```

## 4. API端点

- `POST /api/astrology/chart` - 获取占星图表数据
- `POST /api/report-generate` - 生成占星报告
- `POST /api/soulmate-generate` - 生成灵魂伴侣分析
- `GET /api/health` - 健康检查

## 5. 测试API

```bash
curl -X POST http://localhost:3001/api/astrology/chart \
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

## 6. 注意事项

- 如果没有配置API密钥，系统会自动使用模拟数据
- API调用失败时会自动回退到模拟数据
- 确保网络连接正常，API需要访问外部服务
