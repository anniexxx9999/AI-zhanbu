# 调用的接口说明

## 当前使用的接口

### 主API: Prokerala API ✅

**状态**: 已配置并使用中

**凭证配置**:
- Client ID: 56cf2183-780f-44de-9e97-d36367463cef
- Base URL: https://api.prokerala.com
- Ayanamsa: Lahiri

**调用日志**:
```
🔮 使用Prokerala API获取星盘数据...
✅ Prokerala API返回成功
```

---

## 完整调用流程

### 1. 前端 → 后端
```
POST http://localhost:3001/api/astrology/chart
```

### 2. 后端 → Prokerala API
```
API: Prokerala Vedic Astrology API
获取数据: 行星位置、宫位、Kundli等
```

### 3. 数据返回
```
后端 → 前端 → Dashboard展示
```

---

## 备用接口

系统中还配置了以下备用接口:

1. **VedAstro API** - 备用计算引擎
2. **FreeAstrology API** - 免费备用选项
3. **Mock Data** - 模拟数据回退

**当前状态**: 使用 Prokerala 作为主API ✅

---

**测试时间**: 2025-10-25 10:40
**状态**: 接口调用成功 ✅
