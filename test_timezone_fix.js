const moment = require('moment-timezone');

console.log('🕐 时区处理测试 - 1993-11-20 19:55 北京');
console.log('=====================================');

// 测试数据
const birthInfo = {
    name: "测试用户",
    date: "1993-11-20",
    time: "19:55",
    city: "北京",
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: "Asia/Shanghai"
};

console.log('\n📋 输入信息:');
console.log(`   日期: ${birthInfo.date}`);
console.log(`   时间: ${birthInfo.time}`);
console.log(`   城市: ${birthInfo.city}`);
console.log(`   时区: ${birthInfo.timezone}`);
console.log(`   经纬度: ${birthInfo.latitude}, ${birthInfo.longitude}`);

// 测试时区转换
const datetimeString = `${birthInfo.date} ${birthInfo.time}`;
console.log(`\n🕐 原始时间字符串: ${datetimeString}`);

// 方法1: 使用moment-timezone
const tzMoment = moment.tz(datetimeString, birthInfo.timezone);
console.log(`\n📅 Moment时区转换:`);
console.log(`   本地时间: ${tzMoment.format('YYYY-MM-DD HH:mm:ss')}`);
console.log(`   UTC时间: ${tzMoment.utc().format('YYYY-MM-DD HH:mm:ss')}`);
console.log(`   时区偏移: ${tzMoment.utcOffset()} 分钟 (${tzMoment.utcOffset() / 60} 小时)`);

// 方法2: 使用JavaScript Date
const jsDate = new Date(`${birthInfo.date}T${birthInfo.time}+08:00`);
console.log(`\n📅 JavaScript Date (+08:00):`);
console.log(`   本地时间: ${jsDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
console.log(`   UTC时间: ${jsDate.toISOString()}`);

// 方法3: 使用UTC时间
const utcDate = new Date(`${birthInfo.date}T${birthInfo.time}`);
console.log(`\n📅 JavaScript Date (无时区):`);
console.log(`   本地时间: ${utcDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
console.log(`   UTC时间: ${utcDate.toISOString()}`);

// 计算正确的UTC时间
const correctUtc = moment.tz(datetimeString, 'Asia/Shanghai').utc();
console.log(`\n✅ 正确的UTC时间: ${correctUtc.format('YYYY-MM-DD HH:mm:ss')}`);

// 测试API调用格式
const apiRequest = {
    year: 1993,
    month: 11,
    date: 20,
    hours: 19,
    minutes: 55,
    seconds: 0,
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: 8, // 北京时区 +8
    settings: {
        observation_point: "topocentric",
        ayanamsha: "lahiri"
    }
};

console.log(`\n📡 API请求格式:`);
console.log(JSON.stringify(apiRequest, null, 2));

// 验证经纬度
console.log(`\n🌍 地理位置验证:`);
console.log(`   北京坐标: 39.9042°N, 116.4074°E`);
console.log(`   时区计算: ${Math.round(116.4074 / 15)} (应该是8)`);
console.log(`   实际时区: UTC+8 (中国标准时间)`);

console.log(`\n🔍 问题分析:`);
console.log(`   1. 时区处理: ${tzMoment.utcOffset() / 60 === 8 ? '✅ 正确' : '❌ 错误'}`);
console.log(`   2. 经纬度: ${birthInfo.latitude === 39.9042 && birthInfo.longitude === 116.4074 ? '✅ 正确' : '❌ 错误'}`);
console.log(`   3. 时间格式: ${datetimeString === '1993-11-20 19:55' ? '✅ 正确' : '❌ 错误'}`);

console.log(`\n🎯 建议修复:`);
console.log(`   1. 确保使用正确的时区转换`);
console.log(`   2. 验证经纬度坐标`);
console.log(`   3. 检查API调用的时间格式`);
