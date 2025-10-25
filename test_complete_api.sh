#!/bin/bash

echo "======================================"
echo "完整占星API测试"
echo "======================================"
echo ""

# 测试数据
BIRTH_DATA='{
  "name": "Test User",
  "date": "1993-11-20",
  "time": "19:55",
  "city": "Beijing",
  "latitude": 39.9042,
  "longitude": 116.4074,
  "timezone": "Asia/Shanghai"
}'

echo "📋 测试输入数据:"
echo "$BIRTH_DATA" | jq .
echo ""

# 1. 测试 D1 本命盘
echo "1️⃣ 测试 D1 本命盘..."
RESPONSE1=$(curl -s -X POST "http://localhost:3001/api/astrology/chart" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")

if echo "$RESPONSE1" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ D1 成功"
    echo "$RESPONSE1" | jq '{success, chartType: .data.chartType, planets_count: (.data.planets | length), houses_count: (.data.houses | length)}'
else
    echo "❌ D1 失败"
fi
echo ""

# 2. 测试 D9 Navamsa
echo "2️⃣ 测试 D9 Navamsa..."
RESPONSE2=$(curl -s -X POST "http://localhost:3001/api/astrology/varga/navamsa" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")

if echo "$RESPONSE2" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ D9 成功"
    echo "$RESPONSE2" | jq '{success, chartType: .data.chartType, planets_count: (.data.planets | length)}'
else
    echo "❌ D9 失败"
fi
echo ""

# 3. 测试 D10 Dasamsa
echo "3️⃣ 测试 D10 Dasamsa..."
RESPONSE3=$(curl -s -X POST "http://localhost:3001/api/astrology/varga/dasamsa" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")

if echo "$RESPONSE3" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ D10 成功"
    echo "$RESPONSE3" | jq '{success, chartType: .data.chartType, planets_count: (.data.planets | length)}'
else
    echo "❌ D10 失败"
fi
echo ""

# 4. 测试 Dasha
echo "4️⃣ 测试 Dasha 大运..."
RESPONSE4=$(curl -s -X POST "http://localhost:3001/api/astrology/dasha" \
  -H "Content-Type: application/json" \
  -d "$BIRTH_DATA")

if echo "$RESPONSE4" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Dasha 成功"
    echo "$RESPONSE4" | jq '{success, currentDasha: .data.currentDasha.planet, periods_count: (.data.allPeriods | length)}'
else
    echo "❌ Dasha 失败"
fi
echo ""

echo "======================================"
echo "测试完成"
echo "======================================"
