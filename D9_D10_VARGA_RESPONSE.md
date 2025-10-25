# D9 (Navamsa) 和 D10 (Dasamsa) 分盘数据

**出生信息**: 1993-11-20 19:55 北京  
**状态**: ✅ 成功返回

---

## 🔮 D9 Navamsa (九分盘)

### 图表类型
- **名称**: Navamsa Chart (九分盘)
- **Chart Type**: `D9_Navamsa`
- **分度**: 每个星座再分为9等份（3°20' per division）

### D9 用途
- **婚姻与伴侣**: 主要看D9的7宫和Venus
- **人生精神层面**: 内在品质和dharma
- **行星强度**: 判断行星在D9中的表现
- **配偶特征**: 从D9上升和7宫看伴侣

### API端点
```
POST /api/astrology/varga/navamsa
```

### 主要数据
- ✅ 9个行星位置
- ✅ 12个宫位信息
- ✅ 相位关系
- ✅ 上升点 (Lagna)
- ✅ Navamsa特有的分析

---

## ⚡ D10 Dasamsa (十分盘)

### 图表类型
- **名称**: Dasamsa Chart (十分盘)
- **Chart Type**: `D10_Dasamsa`
- **分度**: 每个星座再分为10等份（3° per division）

### D10 用途
- **事业与职业**: 主要看D10的10宫
- **社会地位**: 在职场和社会中的表现
- **成功程度**: 事业成就和认可度
- **职业方向**: 适合的职业领域

### API端点
```
POST /api/astrology/varga/dasamsa
```

### 主要数据
- ✅ 9个行星位置
- ✅ 12个宫位信息
- ✅ 相位关系
- ✅ 上升点 (Lagna)
- ✅ Dasamsa特有的职业分析

---

## 📊 D9 vs D10 对比

| 分盘 | 分度 | 主要用途 | 关键宫位 |
|------|------|----------|----------|
| **D9** | 3°20' | 婚姻、精神、内在品质 | 7宫(伴侣)、9宫(Dharma) |
| **D10** | 3° | 事业、职业、社会地位 | 10宫(事业)、6宫(工作) |

---

## 🎯 实际应用

### D9 Navamsa分析重点
1. **7宫**: 配偶特征和婚姻质量
2. **上升**: 内在品质和精神追求
3. **金星位置**: 伴侣关系的和谐度
4. **行星强度**: 在D9中的表现力

### D10 Dasamsa分析重点
1. **10宫**: 事业成就和职业方向
2. **10宫主**: 从事的行业类型
3. **行星在10宫**: 职业相关活动
4. **10宫行星**: 影响事业的因素

---

## 📝 API调用示例

### D9 Navamsa
```bash
curl -X POST "http://localhost:3001/api/astrology/varga/navamsa" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "Beijing",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }'
```

### D10 Dasamsa
```bash
curl -X POST "http://localhost:3001/api/astrology/varga/dasamsa" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "Beijing",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }'
```

---

## ✅ 数据文件

- `d9_navamsa_response.json` (465行)
- `d10_dasamsa_response.json` (465行)

---

## 🌟 完整占星数据总结

现在可以获取:
- ✅ D1 Rāśi (本命盘)
- ✅ D9 Navamsa (九分盘)
- ✅ D10 Dasamsa (十分盘)
- ✅ Dasha (大运)

**数据来源**: Prokerala API v2 + 系统整合 ✅
