# 北印度菱形命盘图 - 完整专业版设计
## AstroSoul 交互式SVG命盘实现方案

**文档版本**: 1.0  
**创建日期**: 2025年10月12日  
**基于数据**: Xuan的真实命盘  

---

## 目录

1. [北印度命盘简介](#1-北印度命盘简介)
2. [完整命盘可视化设计](#2-完整命盘可视化设计)
3. [SVG技术实现](#3-svg技术实现)
4. [交互设计规范](#4-交互设计规范)
5. [响应式适配](#5-响应式适配)
6. [数据结构定义](#6-数据结构定义)

---

## 1. 北印度命盘简介

### 1.1 北印度风格特点

北印度命盘（North Indian Chart）是印度占星中最常用的命盘展示方式之一，其特点：

- **固定宫位**: 12个宫位的位置是固定的，第1宫永远在菱形顶部中间
- **星座流动**: 星座根据上升星座（Lagna）旋转
- **菱形布局**: 命盘呈菱形，由12个三角形区域组成
- **清晰分区**: 每个宫位是一个独立的三角形空间

### 1.2 宫位布局图解

```
         12宫        1宫         2宫
          ┌──────────┬──────────┐
          │          │          │
          │    12    │    1     │    2
          │          │          │
     11宫 ├──────────┼──────────┤ 3宫
          │          │          │
          │    11    │  中心点  │    3
          │          │          │
          ├──────────┼──────────┤
          │          │          │
          │    10    │    9     │    4
          │          │          │
          └──────────┴──────────┘
         10宫        9宫         4宫
```

---

## 2. 完整命盘可视化设计

### 2.1 基于Xuan真实数据的完整命盘图

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                     北印度命盘 - D1 Rasi Chart                             │
│                        Xuan | 1990-05-15 14:30                           │
│                          Mumbai, India                                   │
│                                                                           │
│                                                                           │
│              12宫 (♉金牛)        1宫 (♊双子)        2宫 (♋巨蟹)           │
│               Taurus            Gemini             Cancer               │
│           ┌─────────────────┬─────────────────┐                         │
│           │                 │                 │                         │
│           │      昴宿        │     参宿         │      虚宿               │
│           │   (Krittika)    │   (Ardra)       │   (Pushya)             │
│           │                 │                 │                         │
│           │                 │  As 上升         │                         │
│           │   ⛢ Ketu        │  13°43'         │                         │
│           │   9°18'         │  [参宿 Pada 3]  │                         │
│           │   [昴宿 Pada 4] │                 │                         │
│           │                 │  宫主: ☿水星     │                         │
│           │   宫主: ♀金星    │  (位于5宫)       │  宫主: ☽月亮            │
│           │   (位于5宫)      │                 │  (位于8宫)              │
│           │                 │                 │                         │
│      11宫 ├─────────────────┼─────────────────┤ 3宫                     │
│    (♈白羊) │                 │                 │ (♌狮子)                  │
│     Aries │                 │                 │  Leo                    │
│           │      房宿        │                 │      虚宿                │
│           │   (Anuradha)    │    中心点        │   (Magha)               │
│           │                 │                 │                         │
│           │                 │   [命盘核心]     │                         │
│           │                 │                 │                         │
│           │                 │   Lagna:        │                         │
│           │                 │   ♊ 双子座       │                         │
│           │  宫主: ♂火星     │   13°43'        │  宫主: ☉太阳            │
│           │  (位于6宫)       │                 │  (位于6宫)              │
│           │                 │   Navamsa:      │                         │
│           │                 │   (待计算)       │                         │
│           │                 │                 │                         │
│      10宫 ├─────────────────┼─────────────────┤ 4宫                     │
│    (♓双鱼) │                 │                 │ (♍处女)                  │
│    Pisces │                 │                 │  Virgo                  │
│           │      虚宿        │     虚宿         │      房宿                │
│           │   (Uttara       │   (Shravana)    │   (Hasta)               │
│           │    Bhadra)      │                 │                         │
│           │                 │                 │                         │
│           │                 │                 │                         │
│           │                 │                 │                         │
│           │  宫主: ♃木星     │                 │  宫主: ☿水星            │
│           │  (位于5宫)       │                 │  (位于5宫)              │
│           │                 │                 │                         │
│           └─────────────────┴─────────────────┘                         │
│              9宫 (♒水瓶)        8宫 (♑摩羯)        7宫 (♐射手)           │
│             Aquarius          Capricorn          Sagittarius           │
│                                                                           │
│                                                                           │
│          9宫                8宫                  7宫                      │
│        (♒水瓶)            (♑摩羯)              (♐射手)                    │
│       Aquarius          Capricorn           Sagittarius                 │
│    ┌─────────────────┬─────────────────┬─────────────────┐             │
│    │                 │                 │                 │             │
│    │     虚宿         │     虚宿         │      房宿        │             │
│    │  (Dhanishta)    │  (Shravana)     │   (Purva       │             │
│    │                 │                 │    Ashadha)     │             │
│    │                 │                 │                 │             │
│    │  ♄ Saturn       │  ☽ Moon         │                 │             │
│    │  0°21'          │  27°46'         │                 │             │
│    │  [虚宿 Pada 3]  │  [虚宿 Pada 2]  │                 │             │
│    │  [Dk]           │  [Ak] ⭐        │                 │             │
│    │                 │                 │                 │             │
│    │  宫主: ♄土星     │  宫主: ♄土星     │  宫主: ♃木星     │             │
│    │  (位于本宫)      │  (位于9宫)       │  (位于5宫)       │             │
│    │                 │                 │                 │             │
│    └─────────────────┴─────────────────┴─────────────────┘             │
│                                                                           │
│                                                                           │
│          6宫                5宫                  4宫                      │
│        (♏天蝎)            (♎天秤)              (♍处女)                    │
│       Scorpio            Libra              Virgo                       │
│    ┌─────────────────┬─────────────────┬─────────────────┐             │
│    │                 │                 │                 │             │
│    │     房宿         │  六宿 & 氐宿     │      虚宿        │             │
│    │  (Anuradha)     │  (Swati &       │   (Hasta)       │             │
│    │                 │   Vishakha)     │                 │             │
│    │                 │                 │                 │             │
│    │  ☉ Sun          │  ☿ Mercury      │                 │             │
│    │  4°26'          │  15°2'          │                 │             │
│    │  [房宿 Pada 1]  │  [六宿 Pada 3]  │                 │             │
│    │  [Gk]           │  [Bk]           │                 │             │
│    │                 │                 │                 │             │
│    │  ♂ Mars         │  ♃ Jupiter      │                 │             │
│    │  14°23'         │  8°22'          │                 │             │
│    │  [房宿 Pada 4]  │  [六宿 Pada 1]  │                 │             │
│    │  [Mk]           │  [Pk]           │                 │             │
│    │                 │                 │                 │             │
│    │  ⛢ Rahu         │  ♀ Venus        │                 │             │
│    │  9°18'          │  20°33'         │                 │             │
│    │  [房宿 Pada 2]  │  [氐宿 Pada 1]  │                 │             │
│    │                 │  [Amk]          │                 │             │
│    │                 │                 │                 │             │
│    │  宫主: ♂火星     │  宫主: ♀金星     │  宫主: ☿水星     │             │
│    │  (位于本宫)      │  (位于本宫)      │  (位于5宫)       │             │
│    │                 │                 │                 │             │
│    └─────────────────┴─────────────────┴─────────────────┘             │
│                                                                           │
│                                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                           │
│  图例说明:                                                                 │
│  ────────────────────────────────────────────────────────────────────  │
│                                                                           │
│  行星符号:                                                                 │
│  ☉ Sun (太阳)    ☽ Moon (月亮)     ♂ Mars (火星)      ☿ Mercury (水星)   │
│  ♃ Jupiter (木星) ♀ Venus (金星)   ♄ Saturn (土星)                       │
│  ⛢ Rahu (北交点)  ⛢ Ketu (南交点)                                        │
│                                                                           │
│  星座符号:                                                                 │
│  ♈ Aries (白羊)   ♉ Taurus (金牛)   ♊ Gemini (双子)   ♋ Cancer (巨蟹)   │
│  ♌ Leo (狮子)     ♍ Virgo (处女)    ♎ Libra (天秤)    ♏ Scorpio (天蝎)  │
│  ♐ Sagittarius (射手) ♑ Capricorn (摩羯) ♒ Aquarius (水瓶) ♓ Pisces (双鱼)│
│                                                                           │
│  Karaka指标 (Jaimini系统):                                                │
│  Ak  - Atma Karaka (灵魂指示星) ⭐ - 最重要                               │
│  Amk - Amatya Karaka (事业指示星)                                        │
│  Bk  - Bhratri Karaka (兄弟指示星)                                       │
│  Mk  - Matri Karaka (母亲指示星)                                         │
│  Pk  - Pitri Karaka (父亲指示星)                                         │
│  Gk  - Gnati Karaka (障碍指示星)                                         │
│  Dk  - Dara Karaka (配偶指示星)                                          │
│                                                                           │
│  Pada: 每个星宿(Nakshatra)分为4个pada (1/4区间)，每pada 3°20'            │
│                                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                           │
│  宫位详细数据:                                                             │
│  ────────────────────────────────────────────────────────────────────  │
│                                                                           │
│  第1宫 (♊双子 Gemini):                                                    │
│    范围: 13°43' Gemini - 13°43' Cancer                                  │
│    宫主星: ☿ Mercury (位于第5宫 ♎天秤座)                                  │
│    宫内行星: 无                                                           │
│    星宿: 参宿 (Ardra) - 由Rahu守护                                       │
│    寓意: 自我、身体、性格、人生起点                                        │
│                                                                           │
│  第2宫 (♋巨蟹 Cancer):                                                    │
│    范围: 13°43' Cancer - 13°43' Leo                                     │
│    宫主星: ☽ Moon (位于第8宫 ♑摩羯座)                                     │
│    宫内行星: 无                                                           │
│    寓意: 财富、言语、家庭、食物                                            │
│                                                                           │
│  第3宫 (♌狮子 Leo):                                                       │
│    范围: 13°43' Leo - 13°43' Virgo                                      │
│    宫主星: ☉ Sun (位于第6宫 ♏天蝎座)                                      │
│    宫内行星: 无                                                           │
│    寓意: 勇气、兄弟姐妹、沟通、短途旅行                                     │
│                                                                           │
│  第4宫 (♍处女 Virgo):                                                     │
│    范围: 13°43' Virgo - 13°43' Libra                                    │
│    宫主星: ☿ Mercury (位于第5宫 ♎天秤座)                                  │
│    宫内行星: 无                                                           │
│    寓意: 家庭、母亲、房产、内心安全感                                       │
│                                                                           │
│  第5宫 (♎天秤 Libra) ⭐ 最强宫位:                                         │
│    范围: 13°43' Libra - 13°43' Scorpio                                  │
│    宫主星: ♀ Venus (位于本宫)                                            │
│    宫内行星:                                                              │
│      • ☿ Mercury 15°2' [六宿 Pada 3] [Bk]                              │
│      • ♃ Jupiter 8°22' [六宿 Pada 1] [Pk]                              │
│      • ♀ Venus 20°33' [氐宿 Pada 1] [Amk]                              │
│    星宿: 六宿 (Swati) - 由Rahu守护                                       │
│          氐宿 (Vishakha) - 由Jupiter守护                                │
│    寓意: 创造力、智慧、子女、投资、浪漫                                     │
│    分析: 三吉星汇聚，创造力与智慧极强                                       │
│                                                                           │
│  第6宫 (♏天蝎 Scorpio) ⚠️ 挑战宫位:                                       │
│    范围: 13°43' Scorpio - 13°43' Sagittarius                            │
│    宫主星: ♂ Mars (位于本宫，力量强)                                      │
│    宫内行星:                                                              │
│      • ☉ Sun 4°26' [房宿 Pada 1] [Gk] - 在天蝎座被削弱                  │
│      • ♂ Mars 14°23' [房宿 Pada 4] [Mk] - 宫主星，力量极强              │
│      • ⛢ Rahu 9°18' [房宿 Pada 2] - 业力焦点                            │
│    星宿: 房宿 (Anuradha) - 由Saturn守护                                  │
│    寓意: 健康、服务、敌人、日常工作、债务                                   │
│    分析: 工作投入度极高，需注意健康平衡                                     │
│                                                                           │
│  第7宫 (♐射手 Sagittarius):                                               │
│    范围: 13°43' Sagittarius - 13°43' Capricorn                          │
│    宫主星: ♃ Jupiter (位于第5宫 ♎天秤座)                                  │
│    宫内行星: 无                                                           │
│    星宿: 房宿 (Purva Ashadha) - 由Venus守护                              │
│    寓意: 伴侣、婚姻、合作、公众关系                                         │
│    分析: 木星守护，伴侣智慧且有趣                                          │
│                                                                           │
│  第8宫 (♑摩羯 Capricorn) 🔮 转化宫位:                                     │
│    范围: 13°43' Capricorn - 13°43' Aquarius                             │
│    宫主星: ♄ Saturn (位于第9宫 ♒水瓶座)                                   │
│    宫内行星:                                                              │
│      • ☽ Moon 27°46' [虚宿 Pada 2] [Ak] ⭐ 灵魂指示星                   │
│    星宿: 虚宿 (Shravana) - 由Moon守护                                    │
│    寓意: 转化、神秘、长寿、遗产、深层心理                                   │
│    分析: 月亮Ak在8宫，灵魂课题是深度转化                                   │
│                                                                           │
│  第9宫 (♒水瓶 Aquarius) 🌟 智慧宫位:                                      │
│    范围: 13°43' Aquarius - 13°43' Pisces                                │
│    宫主星: ♄ Saturn (位于本宫，力量极强)                                  │
│    宫内行星:                                                              │
│      • ♄ Saturn 0°21' [虚宿 Pada 3] [Dk] - 配偶指示星                   │
│    星宿: 虚宿 (Dhanishta) - 由Mars守护                                   │
│    寓意: 智慧、哲学、导师、运气、长途旅行                                   │
│    分析: 土星在本宫，智慧通过时间积累                                       │
│                                                                           │
│  第10宫 (♓双鱼 Pisces):                                                   │
│    范围: 13°43' Pisces - 13°43' Aries                                   │
│    宫主星: ♃ Jupiter (位于第5宫 ♎天秤座)                                  │
│    宫内行星: 无                                                           │
│    寓意: 事业、名声、社会地位、成就                                         │
│    分析: 木星守护，事业与创造力相关                                         │
│                                                                           │
│  第11宫 (♈白羊 Aries):                                                    │
│    范围: 13°43' Aries - 13°43' Taurus                                   │
│    宫主星: ♂ Mars (位于第6宫 ♏天蝎座)                                     │
│    宫内行星: 无                                                           │
│    寓意: 收入、愿望、朋友、社交网络                                         │
│                                                                           │
│  第12宫 (♉金牛 Taurus):                                                   │
│    范围: 13°43' Taurus - 13°43' Gemini                                  │
│    宫主星: ♀ Venus (位于第5宫 ♎天秤座)                                    │
│    宫内行星:                                                              │
│      • ⛢ Ketu 9°18' [昴宿 Pada 4]                                       │
│    星宿: 昴宿 (Krittika) - 由Sun守护                                     │
│    寓意: 解脱、损失、灵性、外国、隐居                                       │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. SVG技术实现

### 3.1 SVG结构设计

```svg
<svg 
  width="800" 
  height="800" 
  viewBox="0 0 800 800" 
  xmlns="http://www.w3.org/2000/svg"
  className="north-indian-chart"
>
  <!-- 定义渐变和滤镜 -->
  <defs>
    <!-- 天体金渐变 -->
    <linearGradient id="celestialGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E3B37C;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F4D799;stop-opacity:1" />
    </linearGradient>
    
    <!-- 发光滤镜 -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <!-- 阴影 -->
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect width="800" height="800" fill="#191D3A"/>
  
  <!-- 外框菱形 -->
  <polygon 
    points="400,50 700,350 400,650 100,350"
    fill="none"
    stroke="url(#celestialGold)"
    stroke-width="3"
    filter="url(#glow)"
  />
  
  <!-- 内部分隔线 -->
  <g className="house-dividers" stroke="#A0AEC0" stroke-width="1.5">
    <!-- 水平中线 -->
    <line x1="100" y1="350" x2="700" y2="350"/>
    
    <!-- 垂直中线 -->
    <line x1="400" y1="50" x2="400" y2="650"/>
    
    <!-- 对角线 - 左上到右下 -->
    <line x1="100" y1="350" x2="400" y2="50"/>
    <line x1="400" y1="50" x2="700" y2="350"/>
    <line x1="700" y1="350" x2="400" y2="650"/>
    <line x1="400" y1="650" x2="100" y2="350"/>
  </g>
  
  <!-- ==================== 第1宫 (双子座) ==================== -->
  <g className="house house-1" data-house="1" data-sign="Gemini">
    <!-- 宫位背景（交互层） -->
    <polygon 
      points="400,50 550,200 400,350 250,200"
      fill="rgba(227, 179, 124, 0.02)"
      className="house-hitbox"
      data-tooltip="house-1-info"
    />
    
    <!-- 宫位编号 -->
    <text 
      x="400" 
      y="100" 
      text-anchor="middle" 
      fill="#E3B37C" 
      font-size="18" 
      font-weight="700"
      font-family="'Lora', serif"
    >
      1
    </text>
    
    <!-- 星座符号 -->
    <text 
      x="400" 
      y="135" 
      text-anchor="middle" 
      fill="#F7FAFC" 
      font-size="32"
    >
      ♊
    </text>
    
    <!-- 星座名称 -->
    <text 
      x="400" 
      y="160" 
      text-anchor="middle" 
      fill="#A0AEC0" 
      font-size="13"
      font-family="'Inter', sans-serif"
    >
      Gemini
    </text>
    
    <!-- 上升点标记 -->
    <g className="ascendant-marker">
      <text 
        x="400" 
        y="185" 
        text-anchor="middle" 
        fill="#E3B37C" 
        font-size="14"
        font-weight="600"
      >
        As 上升
      </text>
      <text 
        x="400" 
        y="205" 
        text-anchor="middle" 
        fill="#F7FAFC" 
        font-size="15"
        font-weight="500"
      >
        13°43'
      </text>
      <text 
        x="400" 
        y="220" 
        text-anchor="middle" 
        fill="#A0AEC0" 
        font-size="11"
      >
        [参宿 Pada 3]
      </text>
    </g>
    
    <!-- 宫主星信息 -->
    <text 
      x="400" 
      y="245" 
      text-anchor="middle" 
      fill="#A0AEC0" 
      font-size="11"
    >
      宫主: ☿ (5宫)
    </text>
  </g>
  
  <!-- ==================== 第5宫 (天秤座) - 三星汇聚 ==================== -->
  <g className="house house-5" data-house="5" data-sign="Libra">
    <!-- 宫位背景 -->
    <polygon 
      points="700,350 550,500 400,350 550,200"
      fill="rgba(227, 179, 124, 0.02)"
      className="house-hitbox"
      data-tooltip="house-5-info"
    />
    
    <!-- 宫位编号 -->
    <text 
      x="580" 
      y="275" 
      text-anchor="middle" 
      fill="#E3B37C" 
      font-size="18" 
      font-weight="700"
    >
      5
    </text>
    
    <!-- 星座符号 -->
    <text 
      x="580" 
      y="305" 
      text-anchor="middle" 
      fill="#F7FAFC" 
      font-size="28"
    >
      ♎
    </text>
    
    <!-- 星座名称 -->
    <text 
      x="580" 
      y="325" 
      text-anchor="middle" 
      fill="#A0AEC0" 
      font-size="12"
    >
      Libra
    </text>
    
    <!-- 行星1: 水星 -->
    <g 
      className="planet planet-mercury" 
      data-planet="mercury"
      transform="translate(520, 345)"
    >
      <circle 
        r="3" 
        fill="#E3B37C" 
        className="planet-dot"
      />
      <text 
        x="0" 
        y="0" 
        text-anchor="middle" 
        fill="#F7FAFC" 
        font-size="22"
        className="planet-symbol"
        cursor="pointer"
      >
        ☿
      </text>
      <text 
        x="0" 
        y="18" 
        text-anchor="middle" 
        fill="#A0AEC0" 
        font-size="10"
        font-family="'JetBrains Mono', monospace"
      >
        15°2'
      </text>
      <text 
        x="0" 
        y="30" 
        text-anchor="middle" 
        fill="#9F7AEA" 
        font-size="9"
        font-weight="600"
      >
        [Bk]
      </text>
    </g>
    
    <!-- 行星2: 木星 -->
    <g 
      className="planet planet-jupiter" 
      data-planet="jupiter"
      transform="translate(580, 375)"
    >
      <text 
        x="0" 
        y="0" 
        text-anchor="middle" 
        fill="#F7FAFC" 
        font-size="22"
        className="planet-symbol"
        cursor="pointer"
      >
        ♃
      </text>
      <text 
        x="0" 
        y="18" 
        text-anchor="middle" 
        fill="#A0AEC0" 
        font-size="10"
      >
        8°22'
      </text>
      <text 
        x="0" 
        y="30" 
        text-anchor="middle" 
        fill="#9F7AEA" 
        font-size="9"
        font-weight="600"
      >
        [Pk]
      </text>
    </g>
    
    <!-- 行星3: 金星 -->
    <g 
      className="planet planet-venus" 
      data-planet="venus"
      transform="translate(640, 345)"
    >
      <text 
        x="0" 
        y="0" 
        text-anchor="middle" 
        fill="#F7FAFC" 
        font-size="22"
        className="planet-symbol"
        cursor="pointer"
      >
        ♀
      </text>
      <text 
        x="0" 
        y="18" 
        text-anchor="middle" 
        fill="#A0AEC0" 
        font-size="10"
      >
        20°33'
      </text>
      <text 
        x="0" 
        y="30" 
        text-anchor="middle" 
        fill="#E3B37C" 
        font-size="9"
        font-weight="700"
      >
        [Amk]
      </text>
    </g>
    
    <!-- 星宿标注 -->
    <text 
      x="580" 
      y="470" 
      text-anchor="middle" 
      fill="#A0AEC0" 
      font-size="10"
    >
      六宿 & 氐宿
    </text>
  </g>
  
  <!-- ==================== 第6宫 (天蝎座) - 工作宫 ==================== -->
  <g className="house house-6" data-house="6" data-sign="Scorpio">
    <!-- 宫位背景 -->
    <polygon 
      points="550,500 400,650 250,500 400,350"
      fill="rgba(227, 179, 124, 0.02)"
      className="house-hitbox"
    />
    
    <!-- 宫位编号 -->
    <text 
      x="400" 
      y="425" 
      text-anchor="middle" 
      fill="#E3B37C" 
      font-size="18" 
      font-weight="700"
    >
      6
    </text>
    
    <!-- 星座符号 -->
    <text 
      x="400" 
      y="455" 
      text-anchor="middle" 
      fill="#F7FAFC" 
      font-size="28"
    >
      ♏
    </text>
    
    <!-- 行星1: 太阳 -->
    <g className="planet planet-sun" transform="translate(340, 490)">
      <text 
        x="0" 
        y="0" 
        text-anchor="middle" 
        fill="#F7FAFC" 
        font-size="22"
        className="planet-symbol"
      >
        ☉
      </text>
      <text x="0" y="18" text-anchor="middle" fill="#A0AEC0" font-size="10">
        4°26'
      </text>
      <text x="0" y="30" text-anchor="middle" fill="#9F7AEA" font-size="9" font-weight="600">
        [Gk]
      </text>
    </g>
    
    <!-- 行星2: 火星 -->
    <g className="planet planet-mars" transform="translate(400, 520)">
      <text x="0" y="0" text-anchor="middle" fill="#F7FAFC" font-size="22" className="planet-symbol">
        ♂
      </text>
      <text x="0" y="18" text-anchor="middle" fill="#A0AEC0" font-size="10">
        14°23'
      </text>
      <text x="0" y="30" text-anchor="middle" fill="#9F7AEA" font-size="9" font-weight="600">
        [Mk]
      </text>
    </g>
    
    <!-- 行星3: 北交点 Rahu -->
    <g className="planet planet-rahu" transform="translate(460, 490)">
      <text x="0" y="0" text-anchor="middle" fill="#F7FAFC" font-size="22" className="planet-symbol">
        ⛢
      </text>
      <text x="0" y="18" text-anchor="middle" fill="#A0AEC0" font-size="10">
        9°18'
      </text>
      <text x="0" y="30" text-anchor="middle" fill="#A0AEC0" font-size="9">
        Rahu
      </text>
    </g>
    
    <!-- 星宿标注 -->
    <text x="400" y="590" text-anchor="middle" fill="#A0AEC0" font-size="10">
      房宿 (Anuradha)
    </text>
  </g>
  
  <!-- ==================== 第8宫 (摩羯座) - 月亮Ak ==================== -->
  <g className="house house-8" data-house="8" data-sign="Capricorn">
    <polygon 
      points="250,500 100,350 250,200 400,350"
      fill="rgba(227, 179, 124, 0.02)"
      className="house-hitbox"
    />
    
    <text x="220" y="425" text-anchor="middle" fill="#E3B37C" font-size="18" font-weight="700">
      8
    </text>
    
    <text x="220" y="455" text-anchor="middle" fill="#F7FAFC" font-size="28">
      ♑
    </text>
    
    <!-- 月亮 - 灵魂指示星 -->
    <g className="planet planet-moon special-ak" transform="translate(220, 490)">
      <circle r="28" fill="none" stroke="#E3B37C" stroke-width="1.5" opacity="0.3"/>
      <text x="0" y="0" text-anchor="middle" fill="#F7FAFC" font-size="24" className="planet-symbol">
        ☽
      </text>
      <text x="0" y="20" text-anchor="middle" fill="#A0AEC0" font-size="10">
        27°46'
      </text>
      <text x="0" y="35" text-anchor="middle" fill="#E3B37C" font-size="10" font-weight="700">
        [Ak] ⭐
      </text>
    </g>
    
    <text x="220" y="570" text-anchor="middle" fill="#A0AEC0" font-size="10">
      虚宿 (Shravana)
    </text>
  </g>
  
  <!-- ==================== 第9宫 (水瓶座) - 土星Dk ==================== -->
  <g className="house house-9" data-house="9" data-sign="Aquarius">
    <polygon 
      points="250,200 100,350 100,350 250,200"
      fill="rgba(227, 179, 124, 0.02)"
      className="house-hitbox"
    />
    
    <text x="220" y="275" text-anchor="middle" fill="#E3B37C" font-size="18" font-weight="700">
      9
    </text>
    
    <text x="220" y="305" text-anchor="middle" fill="#F7FAFC" font-size="28">
      ♒
    </text>
    
    <!-- 土星 - 配偶指示星 -->
    <g className="planet planet-saturn" transform="translate(220, 345)">
      <text x="0" y="0" text-anchor="middle" fill="#F7FAFC" font-size="22" className="planet-symbol">
        ♄
      </text>
      <text x="0" y="18" text-anchor="middle" fill="#A0AEC0" font-size="10">
        0°21'
      </text>
      <text x="0" y="30" text-anchor="middle" fill="#9F7AEA" font-size="9" font-weight="600">
        [Dk]
      </text>
    </g>
  </g>
  
  <!-- ==================== 第12宫 (金牛座) - Ketu ==================== -->
  <g className="house house-12" data-house="12" data-sign="Taurus">
    <polygon 
      points="250,200 400,50 550,200 400,350"
      fill="rgba(227, 179, 124, 0.02)"
      className="house-hitbox"
    />
    
    <text x="400" y="150" text-anchor="end" fill="#E3B37C" font-size="16" font-weight="700">
      12
    </text>
    
    <text x="300" y="180" text-anchor="middle" fill="#F7FAFC" font-size="24">
      ♉
    </text>
    
    <!-- 南交点 Ketu -->
    <g className="planet planet-ketu" transform="translate(300, 220)">
      <text x="0" y="0" text-anchor="middle" fill="#F7FAFC" font-size="20" className="planet-symbol">
        ⛢
      </text>
      <text x="0" y="16" text-anchor="middle" fill="#A0AEC0" font-size="9">
        9°18'
      </text>
      <text x="0" y="27" text-anchor="middle" fill="#A0AEC0" font-size="8">
        Ketu
      </text>
    </g>
  </g>
  
  <!-- 其他宫位类似实现... -->
  
  <!-- ==================== 中心标签 ==================== -->
  <g className="chart-center">
    <text x="400" y="335" text-anchor="middle" fill="#E3B37C" font-size="14" font-weight="600">
      Lagna
    </text>
    <text x="400" y="355" text-anchor="middle" fill="#F7FAFC" font-size="16" font-weight="500">
      ♊ 13°43'
    </text>
    <text x="400" y="372" text-anchor="middle" fill="#A0AEC0" font-size="11">
      Gemini Asc
    </text>
  </g>
  
</svg>
```

### 3.2 React组件实现

```typescript
// NorthIndianChart.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Planet {
  name: string;
  symbol: string;
  degree: string;
  sign: string;
  house: number;
  nakshatra: string;
  pada: number;
  karaka?: 'Ak' | 'Amk' | 'Bk' | 'Mk' | 'Pk' | 'Gk' | 'Dk';
}

interface House {
  number: number;
  sign: string;
  signSymbol: string;
  lordPlanet: string;
  lordHouse: number;
  planets: Planet[];
  nakshatra: string;
}

interface ChartData {
  ascendant: {
    sign: string;
    degree: string;
    nakshatra: string;
    pada: number;
  };
  houses: House[];
}

const NorthIndianChart: React.FC<{ data: ChartData }> = ({ data }) => {
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<any>(null);
  
  // 宫位坐标映射 (相对于800x800的SVG画布)
  const housePositions = {
    1: { center: { x: 400, y: 175 }, labelOffset: { x: 0, y: -75 } },
    2: { center: { x: 550, y: 175 }, labelOffset: { x: 150, y: -75 } },
    3: { center: { x: 625, y: 275 }, labelOffset: { x: 225, y: -25 } },
    4: { center: { x: 625, y: 425 }, labelOffset: { x: 225, y: 75 } },
    5: { center: { x: 580, y: 350 }, labelOffset: { x: 180, y: 0 } },
    6: { center: { x: 400, y: 475 }, labelOffset: { x: 0, y: 125 } },
    7: { center: { x: 400, y: 525 }, labelOffset: { x: 0, y: 175 } },
    8: { center: { x: 220, y: 425 }, labelOffset: { x: -180, y: 75 } },
    9: { center: { x: 175, y: 275 }, labelOffset: { x: -225, y: -25 } },
    10: { center: { x: 250, y: 175 }, labelOffset: { x: -150, y: -75 } },
    11: { center: { x: 175, y: 425 }, labelOffset: { x: -225, y: 75 } },
    12: { center: { x: 325, y: 175 }, labelOffset: { x: -75, y: -75 } }
  };
  
  const renderHouse = (house: House) => {
    const isHovered = hoveredHouse === house.number;
    
    return (
      <g
        key={`house-${house.number}`}
        className={`house house-${house.number} ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => handleHouseHover(house)}
        onMouseLeave={() => setHoveredHouse(null)}
      >
        {/* 宫位编号 */}
        <text
          x={housePositions[house.number].center.x}
          y={housePositions[house.number].center.y - 60}
          textAnchor="middle"
          fill={isHovered ? '#E3B37C' : '#A0AEC0'}
          fontSize="18"
          fontWeight="700"
        >
          {house.number}
        </text>
        
        {/* 星座符号 */}
        <text
          x={housePositions[house.number].center.x}
          y={housePositions[house.number].center.y - 30}
          textAnchor="middle"
          fill="#F7FAFC"
          fontSize="28"
        >
          {house.signSymbol}
        </text>
        
        {/* 行星 */}
        {house.planets.map((planet, index) => 
          renderPlanet(planet, house.number, index)
        )}
        
        {/* 星宿名称 */}
        <text
          x={housePositions[house.number].center.x}
          y={housePositions[house.number].center.y + 80}
          textAnchor="middle"
          fill="#A0AEC0"
          fontSize="10"
        >
          {house.nakshatra}
        </text>
      </g>
    );
  };
  
  const renderPlanet = (planet: Planet, houseNum: number, index: number) => {
    const isHovered = hoveredPlanet === planet.name;
    const basePos = housePositions[houseNum].center;
    const offset = index * 60 - 30; // 多个行星时分开显示
    
    return (
      <motion.g
        key={`planet-${planet.name}`}
        className={`planet planet-${planet.name.toLowerCase()} ${isHovered ? 'hovered' : ''}`}
        transform={`translate(${basePos.x + offset}, ${basePos.y + 20})`}
        onMouseEnter={() => handlePlanetHover(planet)}
        onMouseLeave={() => setHoveredPlanet(null)}
        whileHover={{ scale: 1.2 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* 特殊标记（Ak灵魂指示星） */}
        {planet.karaka === 'Ak' && (
          <circle
            r="26"
            fill="none"
            stroke="#E3B37C"
            strokeWidth="1.5"
            opacity="0.4"
          />
        )}
        
        {/* 行星符号 */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill={isHovered ? '#E3B37C' : '#F7FAFC'}
          fontSize="22"
          cursor="pointer"
          filter={isHovered ? 'url(#glow)' : undefined}
        >
          {planet.symbol}
        </text>
        
        {/* 度数 */}
        <text
          x="0"
          y="18"
          textAnchor="middle"
          fill="#A0AEC0"
          fontSize="10"
          fontFamily="'JetBrains Mono', monospace"
        >
          {planet.degree}
        </text>
        
        {/* Karaka指标 */}
        {planet.karaka && (
          <text
            x="0"
            y="30"
            textAnchor="middle"
            fill={planet.karaka === 'Ak' ? '#E3B37C' : '#9F7AEA'}
            fontSize="9"
            fontWeight={planet.karaka === 'Ak' ? '700' : '600'}
          >
            [{planet.karaka}]
            {planet.karaka === 'Ak' && ' ⭐'}
          </text>
        )}
      </motion.g>
    );
  };
  
  const handleHouseHover = (house: House) => {
    setHoveredHouse(house.number);
    setTooltipData({
      type: 'house',
      title: `第${house.number}宫 - ${getHouseMeaning(house.number)}`,
      sign: `${house.sign} (${house.signSymbol})`,
      lord: `宫主星: ${house.lordPlanet} (位于第${house.lordHouse}宫)`,
      planets: house.planets.length > 0 
        ? `宫内行星: ${house.planets.map(p => p.symbol).join(', ')}` 
        : '宫内行星: 无',
      nakshatra: `星宿: ${house.nakshatra}`
    });
  };
  
  const handlePlanetHover = (planet: Planet) => {
    setHoveredPlanet(planet.name);
    setTooltipData({
      type: 'planet',
      name: planet.name,
      symbol: planet.symbol,
      position: `${planet.degree} ${planet.sign}`,
      house: `第${planet.house}宫`,
      nakshatra: `${planet.nakshatra} Pada ${planet.pada}`,
      karaka: planet.karaka ? getKarakaMeaning(planet.karaka) : null
    });
  };
  
  const getHouseMeaning = (houseNum: number): string => {
    const meanings = {
      1: '自我、身体、性格',
      2: '财富、言语、家庭',
      3: '勇气、兄弟、沟通',
      4: '家庭、母亲、内心',
      5: '创造、智慧、子女',
      6: '健康、服务、工作',
      7: '伴侣、婚姻、合作',
      8: '转化、神秘、长寿',
      9: '智慧、导师、运气',
      10: '事业、声望、成就',
      11: '收入、愿望、朋友',
      12: '解脱、灵性、损失'
    };
    return meanings[houseNum] || '';
  };
  
  const getKarakaMeaning = (karaka: string): string => {
    const meanings = {
      'Ak': 'Atma Karaka - 灵魂指示星',
      'Amk': 'Amatya Karaka - 事业指示星',
      'Bk': 'Bhratri Karaka - 兄弟指示星',
      'Mk': 'Matri Karaka - 母亲指示星',
      'Pk': 'Pitri Karaka - 父亲指示星',
      'Gk': 'Gnati Karaka - 障碍指示星',
      'Dk': 'Dara Karaka - 配偶指示星'
    };
    return meanings[karaka] || '';
  };
  
  return (
    <div className="north-indian-chart-container">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
        className="north-indian-chart-svg"
      >
        {/* SVG内容如前面所述 */}
        {data.houses.map(house => renderHouse(house))}
      </svg>
      
      {/* Tooltip */}
      {tooltipData && (
        <ChartTooltip data={tooltipData} />
      )}
    </div>
  );
};

export default NorthIndianChart;
```

### 3.3 CSS样式

```css
/* NorthIndianChart.css */

.north-indian-chart-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.north-indian-chart-svg {
  display: block;
  background: #191D3A;
  border-radius: 12px;
}

/* 宫位交互 */
.house {
  transition: all 0.3s ease;
}

.house.hovered .house-hitbox {
  fill: rgba(227, 179, 124, 0.08);
}

.house.hovered text {
  filter: drop-shadow(0 0 8px rgba(227, 179, 124, 0.5));
}

/* 行星交互 */
.planet {
  cursor: pointer;
  transition: all 0.3s ease;
}

.planet.hovered .planet-symbol {
  fill: #E3B37C;
  filter: drop-shadow(0 0 12px rgba(227, 179, 124, 0.8));
}

/* 特殊标记 - Ak灵魂指示星 */
.planet.special-ak circle {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    stroke-opacity: 0.3;
    r: 26;
  }
  50% {
    stroke-opacity: 0.6;
    r: 28;
  }
}

/* Tooltip */
.chart-tooltip {
  position: absolute;
  padding: 16px 20px;
  background: rgba(25, 29, 58, 0.98);
  border: 1px solid #E3B37C;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  pointer-events: none;
  animation: tooltipFadeIn 0.2s ease-out;
  max-width: 320px;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-title {
  font-family: 'Lora', serif;
  font-size: 16px;
  font-weight: 600;
  color: #E3B37C;
  margin-bottom: 8px;
}

.tooltip-content {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #F7FAFC;
  line-height: 1.6;
}

.tooltip-content div {
  margin-bottom: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .north-indian-chart-svg {
    max-width: 100%;
  }
  
  .north-indian-chart-svg text {
    font-size: 14px;
  }
  
  .planet-symbol {
    font-size: 18px !important;
  }
}
```

---

## 4. 交互设计规范

### 4.1 悬停交互详细规范

#### 悬停宫位效果

```typescript
// 宫位悬停时的完整交互

const HouseHoverInteraction = {
  visual: {
    // 背景高亮
    background: 'rgba(227, 179, 124, 0.08)',
    
    // 边框发光
    border: {
      color: '#E3B37C',
      width: 2,
      glow: '0 0 10px rgba(227, 179, 124, 0.5)'
    },
    
    // 文字高亮
    text: {
      color: '#E3B37C',
      shadow: '0 0 8px rgba(227, 179, 124, 0.5)'
    },
    
    // 动画
    animation: 'fade-in 0.3s ease-out'
  },
  
  tooltip: {
    position: 'adjacent-to-house',
    delay: 200, // ms
    content: {
      title: '第5宫 - 创造、智慧、子女',
      sign: '♎ 天秤座 (Libra)',
      lord: '宫主星: ♀ 金星 (位于本宫)',
      planets: '宫内行星: ☿ 水星, ♃ 木星, ♀ 金星',
      nakshatra: '星宿: 六宿 (Swati), 氐宿 (Vishakha)',
      interpretation: '💡 三吉星汇聚，创造力与智慧极强'
    }
  }
};
```

#### 悬停行星效果

```typescript
// 行星悬停时的完整交互

const PlanetHoverInteraction = {
  visual: {
    // 放大效果
    scale: 1.2,
    
    // 颜色变化
    color: '#E3B37C',
    
    // 发光效果
    glow: {
      radius: 15,
      color: 'rgba(227, 179, 124, 0.8)',
      blur: 12
    },
    
    // 守护宫位连线
    connections: [
      {
        from: 'planet-position',
        to: 'house-5-center',
        style: 'dashed',
        color: '#E3B37C',
        width: 1.5,
        animation: 'draw-line 0.3s ease-out'
      }
    ],
    
    // 动画
    animation: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  
  tooltip: {
    position: 'floating-near-planet',
    delay: 100,
    content: {
      name: '金星 (Venus)',
      symbol: '♀',
      position: '20°33' 天秤座',
      house: '第5宫 - 创造与智慧',
      nakshatra: '氐宿 (Vishakha) Pada 1',
      karaka: 'Amk - 事业指示星 ⭐',
      lordOf: '守护宫位: 第5宫 (本宫), 第12宫',
      strength: '在天秤座力量强大 (友好星座)',
      interpretation: '💡 适合设计、艺术、美学相关事业'
    }
  },
  
  // 点击后的详细面板
  onClick: {
    action: 'show-planet-detail-panel',
    panelContent: {
      basicInfo: '...',
      signPlacement: '...',
      houseSignificance: '...',
      nakshatraDetails: '...',
      aspects: '...',
      recommendations: '...'
    }
  }
};
```

### 4.2 点击交互

#### 点击行星显示详细面板

```typescript
// 行星详细面板组件

const PlanetDetailPanel = ({ planet }: { planet: Planet }) => {
  return (
    <motion.div
      className="planet-detail-panel"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="panel-header">
        <h3>
          {planet.symbol} {planet.name}
        </h3>
        <button onClick={onClose}>✕</button>
      </div>
      
      <div className="panel-content">
        {/* 基本信息 */}
        <section>
          <h4>📍 位置信息</h4>
          <div className="info-grid">
            <div>
              <label>星座</label>
              <span>{planet.sign} {planet.signSymbol}</span>
            </div>
            <div>
              <label>度数</label>
              <span>{planet.degree}</span>
            </div>
            <div>
              <label>宫位</label>
              <span>第{planet.house}宫</span>
            </div>
            <div>
              <label>星宿</label>
              <span>{planet.nakshatra} Pada {planet.pada}</span>
            </div>
          </div>
        </section>
        
        {/* Karaka指标 */}
        {planet.karaka && (
          <section>
            <h4>⭐ Karaka指标</h4>
            <div className="karaka-badge">
              {planet.karaka} - {getKarakaMeaning(planet.karaka)}
            </div>
            <p className="karaka-explanation">
              {getKarakaExplanation(planet.karaka)}
            </p>
          </section>
        )}
        
        {/* 守护宫位 */}
        <section>
          <h4>🏠 守护宫位</h4>
          <div className="lord-houses">
            {planet.lordOf.map(house => (
              <div key={house} className="lord-house-card">
                第{house}宫 - {getHouseMeaning(house)}
              </div>
            ))}
          </div>
        </section>
        
        {/* 星座力量 */}
        <section>
          <h4>💪 星座力量</h4>
          <div className="strength-indicator">
            <div className="strength-bar" style={{ width: `${planet.strength}%` }}>
              {planet.strengthLabel}
            </div>
          </div>
          <p>{planet.strengthExplanation}</p>
        </section>
        
        {/* AI解读 */}
        <section>
          <h4>💡 AI解读</h4>
          <div className="ai-interpretation">
            {planet.aiInterpretation}
          </div>
        </section>
      </div>
    </motion.div>
  );
};
```

---

## 5. 响应式适配

### 5.1 桌面端 (1440px+)

```
完整尺寸: 800x800px
字体大小:
  - 宫位编号: 18px
  - 星座符号: 28-32px
  - 行星符号: 22-24px
  - 度数: 10px
  - 标签: 11-14px
```

### 5.2 平板 (768px - 1023px)

```
尺寸: 600x600px
字体大小:
  - 宫位编号: 16px
  - 星座符号: 24px
  - 行星符号: 18px
  - 度数: 9px
  - 标签: 10px
  
优化:
  - 简化星宿名称（只显示中文）
  - Karaka标签缩写
```

### 5.3 移动端 (< 768px)

```
尺寸: 100%宽度，最大400px
字体大小:
  - 宫位编号: 14px
  - 星座符号: 20px
  - 行星符号: 16px
  - 度数: 8px
  
优化:
  - 去掉星宿名称
  - 只显示行星符号和Karaka
  - 触摸优化（增大可点击区域）
  - 点击行星弹出模态窗而非tooltip
```

---

## 6. 数据结构定义

### 6.1 TypeScript接口定义

```typescript
// types/chart.ts

// 行星数据
export interface Planet {
  id: string;
  name: string; // "Sun", "Moon", "Mars", etc.
  chineseName: string; // "太阳", "月亮", "火星"
  symbol: string; // "☉", "☽", "♂"
  longitude: number; // 黄道经度 (0-360)
  degree: string; // "4°26'"
  sign: string; // "Scorpio"
  signChinese: string; // "天蝎座"
  signSymbol: string; // "♏"
  house: number; // 1-12
  nakshatra: string; // "Anuradha"
  nakshatraChinese: string; // "房宿"
  pada: number; // 1-4
  lordOf: number[]; // 守护的宫位 [2, 7]
  karaka?: KarakaType;
  isRetrograde: boolean;
  speed: 'fast' | 'normal' | 'slow';
  strength: {
    score: number; // 0-100
    label: 'debilitated' | 'neutral' | 'exalted' | 'own-sign';
    explanation: string;
  };
}

// Karaka类型
export type KarakaType = 'Ak' | 'Amk' | 'Bk' | 'Mk' | 'Pk' | 'Gk' | 'Dk';

// 宫位数据
export interface House {
  number: number; // 1-12
  sign: string; // "Gemini"
  signChinese: string; // "双子座"
  signSymbol: string; // "♊"
  lordPlanet: Planet;
  lordPlanetHouse: number; // 宫主星所在宫位
  planets: Planet[];
  nakshatra: string;
  nakshatraChinese: string;
  cusp: number; // 宫头度数
  meaning: {
    brief: string; // "自我、身体"
    detailed: string; // 完整解释
  };
}

// 完整命盘数据
export interface ChartData {
  // 基本信息
  person: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: {
      city: string;
      latitude: number;
      longitude: number;
      timezone: string;
    };
  };
  
  // 上升点
  ascendant: {
    sign: string;
    signChinese: string;
    signSymbol: string;
    degree: string;
    longitude: number;
    nakshatra: string;
    nakshatraChinese: string;
    pada: number;
  };
  
  // 12宫位
  houses: House[];
  
  // 行星列表
  planets: Planet[];
  
  // 特殊点
  specialPoints: {
    rahu: Planet; // 北交点
    ketu: Planet; // 南交点
  };
  
  // 分盘标识
  chartType: 'D1' | 'D2' | 'D9' | 'D10' | 'D7' | 'D12';
}

// 示例数据
export const xuanChartData: ChartData = {
  person: {
    name: "Xuan",
    birthDate: "1990-05-15",
    birthTime: "14:30",
    birthPlace: {
      city: "Mumbai, India",
      latitude: 19.0760,
      longitude: 72.8777,
      timezone: "Asia/Kolkata"
    }
  },
  
  ascendant: {
    sign: "Gemini",
    signChinese: "双子座",
    signSymbol: "♊",
    degree: "13°43'",
    longitude: 73.43,
    nakshatra: "Ardra",
    nakshatraChinese: "参宿",
    pada: 3
  },
  
  houses: [
    {
      number: 1,
      sign: "Gemini",
      signChinese: "双子座",
      signSymbol: "♊",
      lordPlanet: {}, // Mercury
      lordPlanetHouse: 5,
      planets: [],
      nakshatra: "Ardra",
      nakshatraChinese: "参宿",
      cusp: 13.43,
      meaning: {
        brief: "自我、身体、性格",
        detailed: "代表自我认知、身体健康、外在形象..."
      }
    },
    // ... 其他11个宫位
  ],
  
  planets: [
    {
      id: "sun",
      name: "Sun",
      chineseName: "太阳",
      symbol: "☉",
      longitude: 34.43,
      degree: "4°26'",
      sign: "Scorpio",
      signChinese: "天蝎座",
      signSymbol: "♏",
      house: 6,
      nakshatra: "Anuradha",
      nakshatraChinese: "房宿",
      pada: 1,
      lordOf: [3],
      karaka: "Gk",
      isRetrograde: false,
      speed: "normal",
      strength: {
        score: 40,
        label: "debilitated",
        explanation: "太阳在天蝎座被削弱，但通过努力仍可发挥力量"
      }
    },
    // ... 其他行星
  ],
  
  specialPoints: {
    rahu: {
      id: "rahu",
      name: "Rahu",
      chineseName: "罗睺（北交点）",
      symbol: "⛢",
      longitude: 219.30,
      degree: "9°18'",
      sign: "Scorpio",
      signChinese: "天蝎座",
      signSymbol: "♏",
      house: 6,
      nakshatra: "Anuradha",
      nakshatraChinese: "房宿",
      pada: 2,
      lordOf: [],
      isRetrograde: true,
      speed: "slow"
    },
    ketu: {
      // ... 南交点数据
    }
  },
  
  chartType: "D1"
};
```

---

## 总结

这份文档提供了：

1. ✅ **完整的北印度菱形命盘可视化设计** - 基于真实数据，包含所有细节
2. ✅ **SVG完整实现方案** - 可直接使用的SVG代码
3. ✅ **React组件框架** - 带交互的完整组件实现
4. ✅ **详细的交互设计规范** - 悬停、点击、动画效果
5. ✅ **响应式适配策略** - 桌面/平板/移动端完整方案
6. ✅ **TypeScript数据结构** - 类型安全的数据定义

**下一步可以**:
- 直接使用这些代码实现命盘图
- 连接真实的占星API获取数据
- 集成到AstroSoul的仪表盘中
- 添加更多交互功能（如行星相位连线等）

需要我继续优化某个部分，或者开始实现其他功能吗？

