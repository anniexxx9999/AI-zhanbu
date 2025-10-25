const fs = require('fs');

// 梵文星座到英文的映射
const RASI_TO_EN = {
  'mesha': 'Aries',
  'vrishabha': 'Taurus',
  'mithuna': 'Gemini',
  'karka': 'Cancer',
  'simha': 'Leo',
  'kanya': 'Virgo',
  'tula': 'Libra',
  'vrischika': 'Scorpio',
  'dhanu': 'Sagittarius',
  'makara': 'Capricorn',
  'kumbha': 'Aquarius',
  'meena': 'Pisces'
};

const EN_TO_RASI = Object.fromEntries(
  Object.entries(RASI_TO_EN).map(([k, v]) => [v, k])
);

// 传统吠陀星座与宫主星对应表（梵文版）
const LORD_BY_RASI = {
  'mesha': 'Mars',      // ♈ 白羊
  'vrishabha': 'Venus', // ♉ 金牛
  'mithuna': 'Mercury', // ♊ 双子
  'karka': 'Moon',      // ♋ 巨蟹
  'simha': 'Sun',       // ♌ 狮子
  'kanya': 'Mercury',   // ♍ 处女
  'tula': 'Venus',      // ♎ 天秤
  'vrischika': 'Mars',  // ♏ 天蝎
  'dhanu': 'Jupiter',   // ♐ 射手
  'makara': 'Saturn',   // ♑ 摩羯
  'kumbha': 'Saturn',   // ♒ 水瓶
  'meena': 'Jupiter'    // ♓ 双鱼
};

// 友好关系
const FRIENDS = {
  'Sun': ['Moon', 'Mars', 'Jupiter'],
  'Moon': ['Sun', 'Mercury'],
  'Mars': ['Sun', 'Moon', 'Jupiter'],
  'Mercury': ['Sun', 'Venus'],
  'Jupiter': ['Sun', 'Moon', 'Mars'],
  'Venus': ['Mercury', 'Saturn'],
  'Saturn': ['Mercury', 'Venus']
};

// 敌对关系
const ENEMIES = {
  'Sun': ['Venus', 'Saturn'],
  'Moon': [],
  'Mars': ['Mercury'],
  'Mercury': ['Moon'],
  'Jupiter': ['Venus', 'Mercury'],
  'Venus': ['Sun', 'Moon'],
  'Saturn': ['Sun', 'Moon']
};

// 旺位（Exaltation）
const EXALT = {
  'Sun': 'mesha',      // 白羊
  'Moon': 'vrishabha', // 金牛
  'Mars': 'makara',    // 摩羯
  'Mercury': 'kanya',  // 处女
  'Jupiter': 'karka',  // 巨蟹
  'Venus': 'meena',    // 双鱼
  'Saturn': 'tula'     // 天秤
};

// 陷位（Debilitation）
const DEBIL = {
  'Sun': 'tula',       // 天秤
  'Moon': 'vrischika', // 天蝎
  'Mars': 'karka',     // 巨蟹
  'Mercury': 'meena',  // 双鱼
  'Jupiter': 'makara', // 摩羯
  'Venus': 'kanya',    // 处女
  'Saturn': 'mesha'    // 白羊
};

function judgeStrength(planet, signId) {
  const rasi = EN_TO_RASI[signId] || signId.toLowerCase();
  const lordOfSign = LORD_BY_RASI[rasi];
  
  // 自守（Own House）
  if (lordOfSign === planet) {
    return { base: 'Own', label: '自守' };
  }
  
  // 旺（Exalted）
  if (EXALT[planet] === rasi) {
    return { base: 'Own', exalt: true, label: '旺' };
  }
  
  // 陷（Debilitated）
  if (DEBIL[planet] === rasi) {
    return { base: 'Enemy', debil: true, label: '陷' };
  }
  
  // 友境（Friend Sign）
  if (FRIENDS[planet]?.includes(lordOfSign)) {
    return { base: 'Friend', label: '友境' };
  }
  
  // 敌境（Enemy Sign）
  if (ENEMIES[planet]?.includes(lordOfSign)) {
    return { base: 'Enemy', label: '敌境' };
  }
  
  // 中性
  return { base: 'Neutral', label: '中性' };
}

function getStrengthDescription(strength) {
  let desc = strength.label;
  if (strength.exalt) {
    desc += ' ✨';
  }
  if (strength.debil) {
    desc += ' ⚠️';
  }
  return desc;
}

// 读取文件
const data = JSON.parse(fs.readFileSync('api_response_1993.json', 'utf8'));

// 建立行星位置映射
const planetPositions = {};
data.data.planets.forEach(planet => {
  planetPositions[planet.name] = {
    house: planet.house,
    sign: planet.sign,
    rasi: EN_TO_RASI[planet.sign]
  };
});

// 修复每个宫位
data.data.houses.forEach(house => {
  // 1. 获取宫头星座的梵文名称
  const rasi = EN_TO_RASI[house.sign];
  
  // 2. 查找正确的宫主星
  const correctLord = LORD_BY_RASI[rasi];
  house.lord = correctLord;
  
  // 3. 获取宫主星位置
  const lordPos = planetPositions[correctLord];
  if (lordPos) {
    house.lordPlacement = `House ${lordPos.house} (${lordPos.sign})`;
    
    // 4. 判断宫主星强度
    const strength = judgeStrength(correctLord, lordPos.sign);
    house.lordStrength = getStrengthDescription(strength);
    house.lordStrengthDetail = strength;
  } else {
    house.lordPlacement = 'Not found';
    house.lordStrength = 'Unknown';
  }
});

// 保存修复后的数据
fs.writeFileSync('api_response_1993_fixed.json', JSON.stringify(data, null, 2), 'utf8');
console.log('✅ 修复完成！已保存到: api_response_1993_fixed.json');
console.log('\n修复摘要:\n');

// 显示修复后的宫位信息
data.data.houses.forEach(house => {
  const rasi = EN_TO_RASI[house.sign];
  console.log(`House ${house.number}: ${house.sign} (${rasi})`);
  console.log(`  Lord: ${house.lord}`);
  console.log(`  Placement: ${house.lordPlacement}`);
  console.log(`  Strength: ${house.lordStrength}`);
  if (house.lordStrengthDetail?.exalt) {
    console.log(`  ⭐ Exalted!`);
  }
  if (house.lordStrengthDetail?.debil) {
    console.log(`  ⚠️  Debilitated!`);
  }
  console.log('');
});
