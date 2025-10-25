# 完整占星API使用指南

## 📋 概述

输入用户的出生日期和地点，系统返回完整的吠陀占星数据：
- **D1 (Rāśi)** - 本命盘
- **D9 (Navamsa)** - 九分盘（婚姻/精神）
- **D10 (Dasamsa)** - 十分盘（事业/职业）
- **Dasha** - Vimshottari 大运

---

## 🎯 快速开始

### 输入参数（统一格式）

```json
{
  "name": "用户姓名",
  "date": "1993-11-20",
  "time": "19:55",
  "city": "Beijing",
  "latitude": 39.9042,
  "longitude": 116.4074,
  "timezone": "Asia/Shanghai"
}
```

---

## 1️⃣ D1 Rāśi（本命盘）

### 端点
```
POST /api/astrology/chart
```

### 返回内容
- ✅ 9个行星位置（Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu）
- ✅ 12个宫位信息
- ✅ 相位关系
- ✅ 上升点 (Lagna)
- ✅ 太阳/月亮/上升星座
- ✅ Nakshatra (二十七宿)
- ✅ Yogas (瑜伽)
- ✅ Mangal Dosha

### 调用示例
```bash
curl -X POST "http://localhost:3001/api/astrology/chart" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "Beijing",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }'
```

---

## 2️⃣ D9 Navamsa（九分盘）

### 端点
```
POST /api/astrology/varga/navamsa
```

### 用途
- **婚姻与伴侣**: 查看配偶特征和婚姻质量
- **人生精神层面**: 内在品质和dharma
- **行星强度**: 判断行星在细分盘中的表现

### 关键分析点
- 7宫：配偶特征
- 上升：内在品质
- 金星位置：伴侣关系和谐度

### 调用示例
```bash
curl -X POST "http://localhost:3001/api/astrology/varga/navamsa" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "Beijing",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }'
```

---

## 3️⃣ D10 Dasamsa（十分盘）

### 端点
```
POST /api/astrology/varga/dasamsa
```

### 用途
- **事业与职业**: 职业方向和成就
- **社会地位**: 在职场和社会中的表现
- **成功程度**: 事业成就和认可度

### 关键分析点
- 10宫：事业成就和职业方向
- 10宫主：从事的行业类型
- 行星在10宫：职业相关活动

### 调用示例
```bash
curl -X POST "http://localhost:3001/api/astrology/varga/dasamsa" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "Beijing",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }'
```

---

## 4️⃣ Dasha（大运周期）

### 端点
```
POST /api/astrology/dasha
```

### 返回内容
- ✅ 当前大运信息
- ✅ 下一个大运预测
- ✅ 完整9个大运周期（120年）
- ✅ 每个大运的持续时间（6年）

### 调用示例
```bash
curl -X POST "http://localhost:3001/api/astrology/dasha" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "date": "1993-11-20",
    "time": "19:55",
    "city": "Beijing",
    "latitude": 39.9042,
    "longitude": 116.4074,
    "timezone": "Asia/Shanghai"
  }'
```

### 大运周期
| 大运 | 行星 | 持续时间 |
|------|------|----------|
| 1 | Sun ☉ | 6年 |
| 2 | Moon ☽ | 6年 |
| 3 | Mars ♂ | 6年 |
| 4 | Rahu ☊ | 6年 |
| 5 | Jupiter ♃ | 6年 |
| 6 | Saturn ♄ | 6年 |
| 7 | Mercury ☿ | 6年 |
| 8 | Ketu ☋ | 6年 |
| 9 | Venus ♀ | 6年 |

**总计**: 120年

---

## 🎯 完整调用流程

### 步骤1: 获取本命盘（D1）
```bash
POST /api/astrology/chart
```
**用途**: 了解基本的个性和生命轨迹

### 步骤2: 获取九分盘（D9）
```bash
POST /api/astrology/varga/navamsa
```
**用途**: 分析婚姻伴侣和精神层面

### 步骤3: 获取十分盘（D10）
```bash
POST /api/astrology/varga/dasamsa
```
**用途**: 预测事业方向和职业成功

### 步骤4: 获取大运（Dasha）
```bash
POST /api/astrology/dasha
```
**用途**: 了解人生不同阶段的运势

---

## 📊 数据源

- **API来源**: Prokerala v2
- **Ayanamsa**: Lahiri
- **计算系统**: 吠陀占星系统
- **语言支持**: 英文、梵文名称

---

## ✅ 返回数据完整性

### D1 本命盘
- ✅ 9个行星完整位置
- ✅ 12个宫位详细信息
- ✅ Rasi (星座) 及 Lord (宫主星)
- ✅ Nakshatra (二十七宿)
- ✅ Yoga (瑜伽配置)
- ✅ Mangal Dosha

### D9 九分盘
- ✅ 9个行星在Navamsa中的位置
- ✅ 12个Navamsa宫位
- ✅ 婚姻相关的行星配置

### D10 十分盘
- ✅ 9个行星在Dasamsa中的位置
- ✅ 12个Dasamsa宫位
- ✅ 事业相关的行星配置

### Dasha 大运
- ✅ 当前大运详细信息
- ✅ 下一个大运预测
- ✅ 完整120年周期

---

## 🌐 API基础信息

- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`
- **Method**: POST

---

## 🔧 错误处理

如果请求失败，返回格式：
```json
{
  "error": "Error type",
  "message": "Error details"
}
```

---

## 📝 注意事项

1. **时间格式**: 使用 24小时制 (HH:MM)
2. **日期格式**: YYYY-MM-DD
3. **经纬度**: 需要精确的坐标
4. **时区**: 必须是有效的时区标识符
5. **所有API都使用相同的输入格式**

---

**更新时间**: 2025-10-25  
**版本**: 1.0  
**状态**: ✅ 生产就绪
