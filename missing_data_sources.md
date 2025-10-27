# 缺失数据的来源分析

## 当前状态：这些数据**不在 API 返回中**

### 1. 各星座的个性描述文字 ❌

**当前 API 返回**:
- 只返回星座名称 (risingSign, moonSign, sunSign)
- 没有返回描述性文字 (mask, desc, need, fuel)

**需要的字段**:
```javascript
{
  lagna: {
    sign: "Pisces",
    mask: "你给世界的第一印象是...",  // ❌ 缺失
    desc: "自信、温暖..."               // ❌ 缺失
  },
  moon: {
    need: "在内心深处，你真正需要的是...",  // ❌ 缺失
    desc: "情感的深度连接..."               // ❌ 缺失
  },
  sun: {
    fuel: "驱动你生命前行的燃料是...",  // ❌ 缺失
    desc: "勇气、独立..."               // ❌ 缺失
  }
}
```

**来源选择**:
1. 前端静态生成（12星座 × 描述 = 12组描述）
2. AI 生成（基于星座特征动态生成）
3. 后端扩展 API 返回

---

### 2. 行星强弱分析（Life Energy）❌

**当前 API 返回**:
- 行星位置信息完整
- 但**没有行星强度/力量评分**

**需要的字段**:
```javascript
{
  strongest: [
    { planet: 'Jupiter', power: '智慧与扩张力', score: 95, desc: '...' },
    { planet: 'Venus', power: '美感与关系力', score: 88, desc: '...' }
  ],
  weakest: { 
    planet: 'Mars', 
    lesson: '行动力与勇气', 
    score: 45, 
    desc: '...' 
  }
}
```

**计算规则**（需要实现）:
1. Shadbala 算法（印度占星学的行星力量计算）
2. 查看行星落宫位置（1/4/7/10宫为强）
3. 查看行星相位（与吉星相位为正）
4. 查看行星主宰宫位好坏

**来源选择**:
1. 后端计算后返回
2. 前端根据已有数据计算
3. 第三方占星库（如 Swiss Ephemeris + Vedastra.js）

---

### 3. 大运周期数据（Dasha Timeline）❌

**当前 API 返回**:
- 没有 Dasha 相关信息

**需要的字段**:
```javascript
{
  majorPeriods: [
    { planet: 'Venus', start: 2012, end: 2032, color: '#FF69B4' },
    { planet: 'Sun', start: 2032, end: 2038, color: '#F59E0B' }
  ],
  currentDasha: {
    major: { planet: 'Venus', period: '2012-2032', theme: '...' },
    minor: { planet: 'Mercury', period: '2023-2025', focus: '...' }
  }
}
```

**计算方法**（需要实现）:
1. Vimshottari Dasha 算法
2. 需要出生时间精确到分钟
3. 需要 Moon 的 Nakshatra（月亮星座）
4. 通过 Nakshatra 确定起始 Mahadasha

**来源选择**:
1. 使用 Vedastra.js 库计算
2. 后端集成 Vedic astrology 计算库
3. 手动实现 Dasha 算法

---

### 4. 个性化建议（Cosmic Toolkit）❌

**当前 API 返回**:
- 没有个性化建议数据

**需要的字段**:
```javascript
{
  colors: ['黄色', '金色', '橙色'],      // 推荐颜色
  gem: '黄宝石',                          // 推荐宝石
  gemPlanet: 'Jupiter',                   // 宝石对应的行星
  mantra: 'Om Brihaspataye Namaha',      // 个人咒语
  activities: ['与家人共度时光', '...'],  // 推荐活动
  luckyDay: '周四',                       // 幸运日
  element: '火'                           // 主元素
}
```

**计算规则**（需要实现）:
1. 根据**最强行星**推荐宝石和颜色
2. 根据**星座元素**推荐活动
3. 根据**行星主宰日**推荐幸运日

**来源选择**:
1. 前端根据已有数据推理生成
2. 后端返回规则表
3. AI 动态生成个性化建议

---

## 实施建议

### 方案 A: 前端生成（快速）

**优点**: 不需要改后端，快速上线
**缺点**: 逻辑在前端，数据质量一般

```javascript
// 前端根据星座生成描述
const signDescriptions = {
  Pisces: {
    lagna: { mask: "...", desc: "..." },
    moon: { need: "...", desc: "..." }
  }
};
```

### 方案 B: 后端扩展（推荐）

**优点**: 数据质量高，逻辑集中
**缺点**: 需要修改后端 API

**需要的库**:
- vedastra.js - Vedic astrology 计算
- astro-calc - 行星计算
- shadbala - 行星力量计算

### 方案 C: 混合方案

**行星强弱/大运**: 使用后端计算（数据敏感）
**描述文字/建议**: 前端生成（简单规则）

---

## 立即行动

### 最简单的实现（前端静态数据）:

1. **星座描述**: 创建 12 个星座的描述 JSON 文件
2. **行星强弱**: 简单规则（庙旺强弱宫位）
3. **大运**: 暂时隐藏或使用模拟数据
4. **建议**: 根据星座元素生成基础建议

这样可以在不改后端的情况下让页面有内容显示。
