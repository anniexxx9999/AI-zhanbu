# Prokerala API 需要添加的图表类型

## 当前状态
- ❌ D9 Navamsa 分盘数据未返回
- ❌ D10 Dasamsa 分盘数据未返回  
- ❌ Vimshottari Dasha 大运数据未返回

## 需要修改

### 1. ProkeralaClient 需要实现

```javascript
// backend/src/services/prokeralaClient.ts
async getVargaChart(params) {
    // 需要调用 Prokerala API v2 的分盘端点
    // URL: /v2/astrology/varga-chart
    // 参数: varga (1=D1, 9=D9, 10=D10)
}
```

### 2. 需要更新的API端点

查看 Prokerala API 文档:
- https://api.prokerala.com/v2/astrology/varga-chart
- https://api.prokerala.com/v2/astrology/dasha-periods

## 解决方案

目前需要使用 Prokerala API 的正确端点来获取:
1. D9 Navamsa chart
2. D10 Dasamsa chart  
3. Vimshottari Dasha periods
