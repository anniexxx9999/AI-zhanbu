# Prokerala v2 D1 命盘完整响应

## API 端点
- **Kundli**: `/v2/astrology/kundli`
- **Planet Position**: `/v2/astrology/planet-position`

## 出生信息
- **日期**: 1993-11-20
- **时间**: 19:55 (北京，UTC+8)
- **经纬度**: 39.9042°N, 116.4074°E
- **Ayanamsa**: Lahiri

---

## 数据结构概览

```json
{
  "planetPositionRaw": {
    "planet_position": [
      // 9个行星 + Ascendant
    ]
  },
  "kundli": {
    "nakshatra_details": {...},
    "mangal_dosha": {...},
    "yoga_details": [...]
  }
}
```

---

## 🌟 行星位置 (planetPositionRaw.planet_position)

### 完整列表 (10个天体)

1. **Sun (太阳)** ☉
   - ID: 0
   - Longitude: 214.41°
   - Rasi: Vrischika (Scorpio) - ID 7
   - Lord: Mars (Kuja)
   - Degree: 4.41°
   - Position: 8
   - Retrograde: false

2. **Moon (月亮)** ☽
   - ID: 1
   - Longitude: 297.76°
   - Rasi: Makara (Capricorn) - ID 9
   - Lord: Saturn (Shani)
   - Degree: 27.76°
   - Position: 10
   - Retrograde: false

3. **Mercury (水星)** ☿
   - ID: 2
   - Longitude: 195.02°
   - Rasi: Tula (Libra) - ID 6
   - Lord: Venus (Shukra)
   - Degree: 15.02°
   - Position: 7
   - Retrograde: false

4. **Venus (金星)** ♀
   - ID: 3
   - Longitude: 200.53°
   - Rasi: Tula (Libra) - ID 6
   - Lord: Venus (Shukra)
   - Degree: 20.53°
   - Position: 7
   - Retrograde: false

5. **Mars (火星)** ♂
   - ID: 4
   - Longitude: 224.37°
   - Rasi: Vrischika (Scorpio) - ID 7
   - Lord: Mars (Kuja)
   - Degree: 14.37°
   - Position: 8
   - Retrograde: false

6. **Jupiter (木星)** ♃
   - ID: 5
   - Longitude: 188.36°
   - Rasi: Tula (Libra) - ID 6
   - Lord: Venus (Shukra)
   - Degree: 8.36°
   - Position: 7
   - Retrograde: false

7. **Saturn (土星)** ♄
   - ID: 6
   - Longitude: 300.33°
   - Rasi: Kumbha (Aquarius) - ID 10
   - Lord: Saturn (Shani)
   - Degree: 0.33°
   - Position: 10
   - Retrograde: false

8. **Rahu (罗睺)** ☊
   - ID: 7
   - Longitude: 219.52°
   - Rasi: Vrischika (Scorpio) - ID 7
   - Lord: Mars (Kuja)
   - Degree: 9.52°
   - Position: 8
   - Retrograde: true ⚠️

9. **Ketu (计都)** ☋
   - ID: 8
   - Longitude: 39.52°
   - Rasi: Vrishabha (Taurus) - ID 1
   - Lord: Venus (Shukra)
   - Degree: 9.52°
   - Position: 1
   - Retrograde: true ⚠️

10. **Ascendant (上升点)** 
    - ID: 100
    - Longitude: 80.18°
    - Rasi: Mithuna (Gemini) - ID 2
    - Lord: Mercury (Budha)
    - Degree: 20.18°
    - Position: 3

---

## 🔮 Kundli 详情

### 1. Nakshatra (二十七宿)

- **月宿**: Dhanishta (第22宿)
- **Pada**: 2
- **Lord**: Mars (Kuja)
- **Chandra Rasi**: Makara (Capricorn)
- **Soorya Rasi**: Vrischika (Scorpio)
- **Zodiac**: Scorpio

**Additional Info**:
- **Deity**: Vasus/Vasu
- **Ganam**: Asura
- **Symbol**: Drum Or Flute
- **Animal Sign**: Lion
- **Nadi**: Pitta
- **Color**: Silver Grey
- **Best Direction**: East
- **Syllables**: Ga, Gi, Gu, Ge
- **Birth Stone**: Coral
- **Gender**: Female
- **Planet**: Kuja
- **Enemy Yoni**: Elephant

### 2. Mangal Dosha (火星相位)

```json
{
  "has_dosha": false,
  "description": "The person is Not Manglik"
}
```

### 3. Yoga Details (瑜伽详情)

- Major Yogas: 5个
- Chandra Yogas: 1个
- Soorya Yogas: 1个
- Inauspicious Yogas: 1个

---

## 📊 完整JSON文件

完整数据已保存在:
- `prokerala_raw_data.json` (248行)
- 包含完整的 planetPositionRaw 和 kundli 数据

---

## ✅ 数据完整性验证

- ✅ 行星位置: 10个天体完整
- ✅ Rasi信息: 每个行星都有Rasi及Lord
- ✅ Kundli详情: Nakshatra, Dosha, Yoga完整
- ✅ 逆行状态: Rahu和Ketu标记为逆行
- ✅ 度数准确: 精确到小数点
- ✅ Vedic名称: 使用印度占星名称

**数据来源**: Prokerala API v2 ✅
**认证**: 使用Client Credentials ✅
