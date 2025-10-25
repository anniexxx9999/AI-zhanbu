#!/bin/bash

echo "🔮 获取完整占星数据..."
echo "出生信息: 1993-11-20 19:55 中国北京"
echo ""

# API调用
RESPONSE=$(NO_PROXY=localhost,127.0.0.1 curl -s -X POST "http://localhost:3001/api/astrology/chart" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "Beijing",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }')

echo "✅ API调用成功"
echo ""
echo "📊 返回数据摘要:"
echo "$RESPONSE" | jq '{
  success: .success,
  chartType: .data.chartType,
  sunSign: .data.sunSign,
  moonSign: .data.moonSign,
  risingSign: .data.risingSign,
  planets: [.data.planets[] | {name: .name, sign: .sign, house: .house}],
  houses_count: (.data.houses | length)
}'

echo ""
echo "💾 保存完整数据到文件..."
echo "$RESPONSE" > complete_api_response_beijing_1993.json
echo "✅ 已保存到: complete_api_response_beijing_1993.json"
wc -l complete_api_response_beijing_1993.json
