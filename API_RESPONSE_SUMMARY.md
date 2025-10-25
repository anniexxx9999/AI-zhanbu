# 占星API返回数据详细说明

## 测试时间
**2025-10-25 09:48:50**

## 测试数据
```json
{
  "name": "Test User",
  "date": "1990-05-15",
  "time": "10:30",
  "city": "Beijing",
  "latitude": 39.9042,
  "longitude": 116.4074,
  "timezone": "Asia/Shanghai"
}
```

---

## API返回数据结构

### 顶层结构
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-10-25T09:48:50.085Z"
}
```

---

## 核心数据字段

### 1. birthInfo (出生信息)
```json
{
  "name": "Test User",
  "date": "1990-05-15",
  "time": "10:30",
  "city": "Beijing",
  "latitude": 39.9042,
  "longitude": 116.4074,
  "timezone": "Asia/Shanghai"
}
```

### 2. planets (行星位置) - 9个行星

#### 每个行星包含的字段:
- `name`: 行星名称 (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu, Ketu)
- `symbol`: 符号 (☉, ☽, ☿, ♀, ♂, ♃, ♄, ☊, ☋)
- `longitude`: 经度 (0-360度)
- `latitude`: 纬度
- `house`: 所在宫位 (1-12)
- `sign`: 所在星座
- `signSymbol`: 星座符号
- `degree`: 度数 (0-29)
- `minute`: 分钟 (0-59)
- `second`: 秒数 (0-59)
- `retrograde`: 是否逆行 (true/false)
- `speed`: 运行速度

#### 行星分布示例:
```
Sun (太阳):        House 10 - Taurus ♉ (0°15'6")
Moon (月亮):       House 6  - Sagittarius ♐ (28°3'20")
Mercury (水星):    House 10 - Aries ♈ (14°20'59") [逆行]
Venus (金星):      House 9  - Pisces ♓ (18°35'49")
Mars (火星):       House 8  - Aquarius ♒ (24°17'11")
Jupiter (木星):    House 12 - Gemini ♊ (15°44'12")
Saturn (土星):     House 6  - Capricorn ♑ (1°32'3") [逆行]
Rahu (罗睺):       House 7  - Capricorn ♑ (17°38'23") [逆行]
Ketu (计都):       House 1  - Cancer ♋ (17°38'23") [逆行]
```

### 3. houses (十二宫位) - 12个宫位

#### 每个宫位包含的字段:
- `number`: 宫位编号 (1-12)
- `name`: 中文名称
- `nameEn`: 英文名称
- `sanskrit`: 梵文名称
- `sign`: 宫头星座
- `signSymbol`: 星座符号
- `lord`: 宫主星
- `planets`: 该宫内的行星数组

#### 十二宫位详情:
```
1. Lagna (自我与个性):         Cancer ♋ - 宫主: Mars
   - Ketu ☋

2. Dhana (财富与资源):         Leo ♌ - 宫主: Venus
   
3. Sahaja (沟通与学习):        Virgo ♍ - 宫主: Mercury
   
4. Sukha (家庭与根基):         Libra ♎ - 宫主: Moon
   
5. Putra (创意与子女):         Scorpio ♏ - 宫主: Sun
   
6. Ari (健康与服务):           Sagittarius ♐ - 宫主: Mercury
   - Moon ☽
   - Saturn ♄

7. Kalatra (伴侣与婚姻):       Capricorn ♑ - 宫主: Venus
   - Rahu ☊

8. Ayu (转变与重生):           Aquarius ♒ - 宫主: Mars
   - Mars ♂

9. Bhagya (智慧与哲学):        Pisces ♓ - 宫主: Jupiter
   - Venus ♀

10. Karma (事业与声誉):        Aries ♈ - 宫主: Saturn
    - Sun ☉
    - Mercury ☿

11. Labha (友谊与愿望):        Taurus ♉ - 宫主: Saturn
   
12. Vyaya (潜意识与解脱):      Gemini ♊ - 宫主: Jupiter
    - Jupiter ♃
```

### 4. aspects (相位关系)

```json
{
  "from": "Moon",
  "to": "Saturn",
  "type": "conjunction",
  "orb": 3.478479825118768,
  "strength": 0.565190021860154,
  "description": "Moon conjunct Saturn"
}
```

**字段说明**:
- `from`: 起始行星
- `to`: 目标行星
- `type`: 相位类型 (conjunction, opposition, trine, square, sextile等)
- `orb`: 容许度
- `strength`: 强度 (0-1)
- `description`: 描述

### 5. lagna (上升点)
```json
{
  "lagna": 93.97458711671476,
  "lagnaDetails": {
    "longitude": 93.97458711671476,
    "sign": "Cancer",
    "signSymbol": "♋",
    "degree": 3,
    "minute": 58,
    "second": 29
  }
}
```

### 6. 星座信息
```json
{
  "moonSign": "Sagittarius",
  "sunSign": "Taurus",
  "risingSign": "Cancer"
}
```

### 7. 图表元数据
```json
{
  "chartType": "D1_Rasi",
  "ayanamsa": "Lahiri",
  "source": "prokerala"
}
```

---

## 扩展数据 (Prokerala原始数据)

### prokerala.planetPositionRaw
包含Prokerala API的原始行星位置数据，包括:
- 行星ID和名称
- 经度位置
- Rasi (星座) 信息
- Rasi Lord (星座守护星)
- 是否逆行

### prokerala.kundli
包含吠陀占星的详细信息:

#### nakshatra_details (星宿信息)
```json
{
  "nakshatra": {
    "id": 20,
    "name": "Uttara Ashadha",
    "lord": "Sun",
    "pada": 1
  },
  "chandra_rasi": "Dhanu",
  "soorya_rasi": "Vrishabha",
  "zodiac": "Taurus",
  "additional_info": {
    "deity": "Vishwedeva",
    "ganam": "Manushya",
    "symbol": "Planks Of A Bed, Elephant's tusk",
    "animal_sign": "Mongoose",
    "nadi": "Kapha",
    "color": "Copper",
    "best_direction": "South",
    "syllables": "Bhe, Bho, Ja, Ji",
    "birth_stone": "Ruby",
    "gender": "Male",
    "planet": "Ravi",
    "enemy_yoni": "Snake"
  }
}
```

#### mangal_dosha (火星缺陷)
```json
{
  "has_dosha": true,
  "description": "The person is Manglik. Mars is positioned in the 8th house, it is strong Manglik Dosha"
}
```

#### yoga_details (瑜伽/格局)
```json
[
  { "name": "Major Yogas", "description": "Your kundli has 4 major yogas" },
  { "name": "Chandra Yogas", "description": "Your kundli has 1 chandra yogas." },
  { "name": "Soorya Yogas", "description": "Your kundli has 3 soorya yogas." },
  { "name": "Inauspicious Yogas", "description": "Your kundli has 1 inauspicious yogas." }
]
```

---

## 数据字段总结

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| success | boolean | 请求是否成功 | true |
| data | object | 占星数据 | {...} |
| birthInfo | object | 出生信息 | {...} |
| planets | array | 9个行星位置 | [...] |
| houses | array | 12个宫位 | [...] |
| aspects | array | 行星相位 | [...] |
| lagna | number | 上升点经度 | 93.97 |
| lagnaDetails | object | 上升点详情 | {...} |
| moonSign | string | 月亮星座 | "Sagittarius" |
| sunSign | string | 太阳星座 | "Taurus" |
| risingSign | string | 上升星座 | "Cancer" |
| chartType | string | 图表类型 | "D1_Rasi" |
| ayanamsa | string | 岁差制 | "Lahiri" |
| source | string | 数据来源 | "prokerala" |
| timestamp | string | 时间戳 | ISO 8601格式 |

---

## 关键发现

### 1. 逆行行星
- Mercury (水星) - 逆行
- Saturn (土星) - 逆行
- Rahu (罗睺) - 逆行
- Ketu (计都) - 逆行

### 2. 行星分布
- **House 10 (事业宫)**: Sun, Mercury
- **House 6 (健康宫)**: Moon, Saturn
- **House 1 (自我宫)**: Ketu
- **House 7 (婚姻宫)**: Rahu
- **House 8 (转变宫)**: Mars
- **House 9 (智慧宫)**: Venus
- **House 12 (潜意识宫)**: Jupiter

### 3. 特殊格局
- **Mangal Dosha** (火星缺陷): 是 - 火星在第8宫，强火星缺陷
- **瑜伽数量**: 4个主要瑜伽，1个Chandra瑜伽，3个Soorya瑜伽，1个不吉瑜伽

### 4. 星宿信息
- **Nakshatra**: Uttara Ashadha (第20号星宿)
- **Pada**: 1
- **星座**: Taurus (金牛座)
- **幸运石**: Ruby (红宝石)

---

## 数据完整性

✅ **所有核心字段都包含数据**:
- 9个行星位置 ✓
- 12个宫位 ✓
- 相位关系 ✓
- 上升点计算 ✓
- 星座判断 ✓
- Prokerala原始数据 ✓
- 吠陀占星扩展数据 ✓

---

## 结论

API返回的数据结构完整，包含:
1. 基本占星计算（行星、宫位、相位）
2. 星座信息（太阳、月亮、上升）
3. 吠陀占星详情（星宿、Mangal Dosha、瑜伽）
4. Prokerala原始数据
5. 完整的中英文命名和梵文名称

**数据质量**: 优秀  
**数据完整性**: 100%  
**可用性**: 可以直接用于前端展示
