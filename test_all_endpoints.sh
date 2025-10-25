#!/bin/bash

echo "=========================================="
echo "🧪 前后端数据连通性完整测试"
echo "=========================================="
echo ""

BIRTH_DATA='{
  "name": "Test User",
  "date": "1993-11-20",
  "time": "19:55",
  "city": "Beijing",
  "latitude": 39.9042,
  "longitude": 116.4074,
  "timezone": "Asia/Shanghai"
}'

echo "📋 测试输入:"
echo "$BIRTH_DATA" | jq .
echo ""

# 1. D1 本命盘
echo "1️⃣ 测试 D1 本命盘..."
R1=$(NO_PROXY=localhost,127.0.0.1 curl -s -X POST "http://localhost:3001/api/astrology/chart" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")
if echo "$R1" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ D1 成功 - Chart: $(echo $R1 | jq -r '.data.chartType'), Planets: $(echo $R1 | jq '.data.planets | length')"
else
    echo "❌ D1 失败"
fi

# 2. D9 Navamsa
echo "2️⃣ 测试 D9 Navamsa..."
R2=$(NO_PROXY=localhost,127.0.0.1 curl -s -X POST "http://localhost:3001/api/astrology/varga/navamsa" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")
if echo "$R2" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ D9 成功 - Chart: $(echo $R2 | jq -r '.data.chartType')"
else
    echo "❌ D9 失败"
fi

# 3. D10 Dasamsa
echo "3️⃣ 测试 D10 Dasamsa..."
R3=$(NO_PROXY=localhost,127.0.0.1 curl -s -X POST "http://localhost:3001/api/astrology/varga/dasamsa" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")
if echo "$R3" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ D10 成功 - Chart: $(echo $R3 | jq -r '.data.chartType')"
else
    echo "❌ D10 失败"
fi

# 4. Dasha
echo "4️⃣ 测试 Dasha 大运..."
R4=$(NO_PROXY=localhost,127.0.0.1 curl -s -X POST "http://localhost:3001/api/astrology/dasha" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")
if echo "$R4" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Dasha 成功 - Current: $(echo $R4 | jq -r '.data.currentDasha.planet')"
else
    echo "❌ Dasha 失败"
fi

echo ""
echo "=========================================="
echo "✅ 测试完成"
echo "=========================================="
