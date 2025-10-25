// 测试正确的时区处理
console.log('🕐 正确的时区处理测试');
console.log('========================');

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

// 正确的时区处理逻辑
function correctTimezoneHandling(birthInfo) {
    const birthDate = new Date(birthInfo.date);
    const [hours, minutes] = birthInfo.time.split(':').map(Number);
    const datetimeString = `${birthInfo.date} ${birthInfo.time}`;
    
    let timezoneOffsetHours;
    
    // 1. 优先使用字符串时区
    if (typeof birthInfo.timezone === 'string' && birthInfo.timezone.trim()) {
        // 使用moment-timezone正确处理时区
        const moment = require('moment-timezone');
        const tzMoment = moment.tz(datetimeString, birthInfo.timezone);
        
        if (tzMoment.isValid()) {
            timezoneOffsetHours = tzMoment.utcOffset() / 60;
            console.log(`\n✅ 时区转换成功:`);
            console.log(`   本地时间: ${tzMoment.format('YYYY-MM-DD HH:mm:ss')}`);
            console.log(`   UTC时间: ${tzMoment.utc().format('YYYY-MM-DD HH:mm:ss')}`);
            console.log(`   时区偏移: ${tzMoment.utcOffset()} 分钟 (${tzMoment.utcOffset() / 60} 小时)`);
        } else {
            console.log(`\n❌ 时区转换失败，使用回退方案`);
            timezoneOffsetHours = undefined;
        }
    }
    
    // 2. 回退到经纬度计算
    if (timezoneOffsetHours === undefined) {
        if (typeof birthInfo.longitude === 'number' && Number.isFinite(birthInfo.longitude)) {
            timezoneOffsetHours = Math.round(birthInfo.longitude / 15);
            console.log(`\n🔄 使用经纬度计算时区: ${timezoneOffsetHours} 小时`);
        } else {
            timezoneOffsetHours = 8; // 北京时区默认值
            console.log(`\n🔄 使用默认时区: ${timezoneOffsetHours} 小时`);
        }
    }
    
    return {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        date: birthDate.getDate(),
        hours: hours,
        minutes: minutes,
        seconds: 0,
        latitude: birthInfo.latitude,
        longitude: birthInfo.longitude,
        timezone: timezoneOffsetHours,
        settings: {
            observation_point: "topocentric",
            ayanamsha: "lahiri"
        }
    };
}

// 测试正确的时区处理
const correctRequest = correctTimezoneHandling(birthInfo);

console.log(`\n📡 正确的API请求格式:`);
console.log(JSON.stringify(correctRequest, null, 2));

// 验证时区计算
console.log(`\n🔍 时区验证:`);
console.log(`   北京经度: ${birthInfo.longitude}°E`);
console.log(`   计算时区: ${Math.round(birthInfo.longitude / 15)} (应该是8)`);
console.log(`   实际时区: UTC+8 (中国标准时间)`);
console.log(`   时区匹配: ${Math.round(birthInfo.longitude / 15) === 8 ? '✅ 正确' : '❌ 错误'}`);

console.log(`\n🎯 修复建议:`);
console.log(`   1. 确保时区转换正确`);
console.log(`   2. 验证经纬度坐标`);
console.log(`   3. 检查API调用的时间格式`);
console.log(`   4. 重新测试占星计算结果`);

console.log(`\n📝 测试结论:`);
console.log(`   时区处理: ${correctRequest.timezone === 8 ? '✅ 正确' : '❌ 需要修复'}`);
console.log(`   经纬度: ${correctRequest.latitude === 39.9042 && correctRequest.longitude === 116.4074 ? '✅ 正确' : '❌ 错误'}`);
console.log(`   时间格式: ${correctRequest.hours === 19 && correctRequest.minutes === 55 ? '✅ 正确' : '❌ 错误'}`);
