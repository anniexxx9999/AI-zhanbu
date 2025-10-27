# Dashboard 页面数据来源分析

## API 接口
- **接口地址**: `/astrology/chart` (POST)
- **调用位置**: `frontend/src/services/api.ts`
- **返回数据结构**: 见 `free_astrology_api_sample_data.json`

## 数据来源分类

### ✅ 来自 API 的数据 (动态数据)

1. **risingSign** (上升星座)
   - 用途: Core Trinity - Lagna 卡片
   - API 字段: `chartData.risingSign`
   
2. **moonSign** (月亮星座)
   - 用途: Core Trinity - Moon 卡片
   - API 字段: `chartData.moonSign`
   
3. **sunSign** (太阳星座)
   - 用途: Core Trinity - Sun 卡片
   - API 字段: `chartData.sunSign`

4. **houses** (12宫位数据)
   - 用途: 12 Life Arenas 模块
   - API 字段: `chartData.houses[]`
   - 每个宫位包含:
     - number, name, nameEn, sanskrit
     - sign, signSymbol
     - lord, lordPlacement, lordStrength
     - planets[]

5. **planets** (行星位置数据)
   - 用途: Planetary Insights 模块
   - API 字段: `chartData.planets[]`
   - 包含所有行星的详细位置信息

6. **aspects** (相位数据)
   - API 字段: `chartData.aspects[]`

### ❌ 已移除的静态数据 (现在是占位符)

1. **coreTrinity** - 现在是 `{ loading: true }`
2. **lifeEnergy** - 现在是 `{ loading: true }`
3. **lifeArenas** - 现在是 `[]`
4. **dashaTimeline** - 现在是 `[]`
5. **currentDasha** - 现在是 `{ loading: true }`
6. **cosmicToolkit** - 现在是 `{ loading: true }`

## 数据显示映射

### Core Trinity 模块
- Lagna: `chartData.risingSign`
- Moon: `chartData.moonSign`
- Sun: `chartData.sunSign`
- ⚠️ 其他文字描述 (mask, desc, need, fuel) 现在是 "—" 占位符

### 12 Life Arenas 模块
- 完全来自: `chartData.houses`
- emoji 和 rating 现在是固定值 (🏠 和 3)
- ⚠️ 专业解读内容 (professionalAnalysis) 已移除

### Planetary Insights 模块
- 数据源: `chartData.planets`
- ⚠️ 当前代码中未找到 planetInsights 变量的定义

### Life Energy, Dasha Timeline, Cosmic Toolkit
- ⚠️ 这些模块的数据现在是占位符，显示 "—" 或空数组

## 建议

1. **Core Trinity** 的描述文字需要从 API 返回，或者在客户端根据星座生成
2. **Life Energy** 数据需要 API 提供行星强弱分析
3. **Dasha Timeline** 需要 API 提供大运周期数据
4. **Cosmic Toolkit** 需要 API 提供个性化建议数据
5. 需要检查 **Planetary Insights** 模块是否正确使用 API 数据
