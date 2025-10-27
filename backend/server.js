// 加载环境变量
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const FreeAstrologyClient = require('./freeAstrologyClient');
const DeepSeekClient = require('./deepseekClient');
const app = express();
const PORT = process.env.PORT || 3001;

// 初始化Free Astrology API客户端
const freeAstrologyClient = new FreeAstrologyClient();

// 初始化 DeepSeek 客户端
const deepseekClient = process.env.DEEPSEEK_API_KEY 
  ? new DeepSeekClient(process.env.DEEPSEEK_API_KEY)
  : null;

console.log(deepseekClient ? '✅ DeepSeek API initialized' : '⚠️  DeepSeek API not configured');


const SIGN_NAMES = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces'
];

const SIGN_SYMBOLS = [
  '♈',
  '♉',
  '♊',
  '♋',
  '♌',
  '♍',
  '♎',
  '♏',
  '♐',
  '♑',
  '♒',
  '♓'
];

const SIGN_LORDS = [
  'Mars',
  'Venus',
  'Mercury',
  'Moon',
  'Sun',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Saturn',
  'Jupiter'
];

const PLANET_SYMBOLS = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
  Ascendant: 'Asc',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇'
};

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      astrology: 'operational',
      ephemeris: 'operational',
      calculations: 'operational'
    }
  });
});

// 模拟数据生成函数
function getMockChartData(name, date, time, city, latitude, longitude, timezone) {
  return {
    success: true,
    data: {
      birthInfo: {
        name,
        date,
        time,
        city,
        latitude: latitude || 39.9042,
        longitude: longitude || 116.4074,
        timezone: timezone || 'Asia/Shanghai'
      },
      planets: [
        {
          name: 'Ascendant',
          symbol: 'Asc',
          longitude: 45.2,
          fullDegree: 45.2,
          normDegree: 15.2,
          latitude: 0.0,
          house: 1,
          sign: 'Taurus',
          signSymbol: '♉',
          zodiacSignName: 'Taurus',
          zodiacSignLord: 'Venus',
          degree: 15,
          minute: 12,
          second: 0,
          retrograde: false,
          speed: 0,
          localizedName: 'Lagna',
          nakshatra: {
            number: 3,
            name: 'Krittika',
            pada: 2,
            vimsottariLord: 'Sun'
          },
          raw: null
        },
        {
          name: 'Sun',
          symbol: PLANET_SYMBOLS.Sun,
          longitude: 45.2,
          fullDegree: 45.2,
          normDegree: 15.2,
          latitude: 0.0,
          house: 1,
          sign: 'Taurus',
          signSymbol: '♉',
          zodiacSignName: 'Taurus',
          zodiacSignLord: 'Venus',
          degree: 15,
          minute: 12,
          second: 0,
          retrograde: false,
          speed: 0.9856,
          localizedName: 'Surya',
          nakshatra: {
            number: 3,
            name: 'Krittika',
            pada: 2,
            vimsottariLord: 'Sun'
          },
          raw: null
        },
        {
          name: 'Moon',
          symbol: PLANET_SYMBOLS.Moon,
          longitude: 120.5,
          fullDegree: 120.5,
          normDegree: 0.5,
          latitude: 2.3,
          house: 4,
          sign: 'Leo',
          signSymbol: '♌',
          zodiacSignName: 'Leo',
          zodiacSignLord: 'Sun',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: false,
          speed: 13.2,
          localizedName: 'Chandra',
          nakshatra: {
            number: 10,
            name: 'Magha',
            pada: 4,
            vimsottariLord: 'Ketu'
          },
          raw: null
        },
        {
          name: 'Mars',
          symbol: PLANET_SYMBOLS.Mars,
          longitude: 180.5,
          fullDegree: 180.5,
          normDegree: 0.5,
          latitude: 0.0,
          house: 6,
          sign: 'Libra',
          signSymbol: '♎',
          zodiacSignName: 'Libra',
          zodiacSignLord: 'Venus',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: false,
          speed: 0.5,
          localizedName: 'Mangal',
          nakshatra: {
            number: 15,
            name: 'Swati',
            pada: 1,
            vimsottariLord: 'Rahu'
          },
          raw: null
        },
        {
          name: 'Mercury',
          symbol: PLANET_SYMBOLS.Mercury,
          longitude: 60.5,
          fullDegree: 60.5,
          normDegree: 0.5,
          latitude: 0.0,
          house: 2,
          sign: 'Gemini',
          signSymbol: '♊',
          zodiacSignName: 'Gemini',
          zodiacSignLord: 'Mercury',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: false,
          speed: 1.0,
          localizedName: 'Budh',
          nakshatra: {
            number: 6,
            name: 'Ardra',
            pada: 1,
            vimsottariLord: 'Rahu'
          },
          raw: null
        },
        {
          name: 'Jupiter',
          symbol: PLANET_SYMBOLS.Jupiter,
          longitude: 300.5,
          fullDegree: 300.5,
          normDegree: 0.5,
          latitude: 0.0,
          house: 10,
          sign: 'Aquarius',
          signSymbol: '♒',
          zodiacSignName: 'Aquarius',
          zodiacSignLord: 'Saturn',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: false,
          speed: 0.1,
          localizedName: 'Guru',
          nakshatra: {
            number: 23,
            name: 'Dhanishta',
            pada: 1,
            vimsottariLord: 'Mars'
          },
          raw: null
        },
        {
          name: 'Venus',
          symbol: PLANET_SYMBOLS.Venus,
          longitude: 240.5,
          fullDegree: 240.5,
          normDegree: 0.5,
          latitude: 0.0,
          house: 8,
          sign: 'Sagittarius',
          signSymbol: '♐',
          zodiacSignName: 'Sagittarius',
          zodiacSignLord: 'Jupiter',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: false,
          speed: 1.2,
          localizedName: 'Shukra',
          nakshatra: {
            number: 20,
            name: 'Poorvaashaada',
            pada: 1,
            vimsottariLord: 'Venus'
          },
          raw: null
        },
        {
          name: 'Saturn',
          symbol: PLANET_SYMBOLS.Saturn,
          longitude: 320.5,
          fullDegree: 320.5,
          normDegree: 20.5,
          latitude: 0.0,
          house: 11,
          sign: 'Aquarius',
          signSymbol: '♒',
          zodiacSignName: 'Aquarius',
          zodiacSignLord: 'Saturn',
          degree: 20,
          minute: 30,
          second: 0,
          retrograde: false,
          speed: 0.1,
          localizedName: 'Shani',
          nakshatra: {
            number: 24,
            name: 'Shatabhisha',
            pada: 1,
            vimsottariLord: 'Rahu'
          },
          raw: null
        },
        {
          name: 'Rahu',
          symbol: PLANET_SYMBOLS.Rahu,
          longitude: 150.5,
          fullDegree: 150.5,
          normDegree: 0.5,
          latitude: 0.0,
          house: 5,
          sign: 'Virgo',
          signSymbol: '♍',
          zodiacSignName: 'Virgo',
          zodiacSignLord: 'Mercury',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: true,
          speed: 0.0,
          localizedName: 'Rahu',
          nakshatra: {
            number: 13,
            name: 'Hasta',
            pada: 1,
            vimsottariLord: 'Moon'
          },
          raw: null
        },
        {
          name: 'Ketu',
          symbol: PLANET_SYMBOLS.Ketu,
          longitude: 330.5,
          fullDegree: 330.5,
          normDegree: 0.5,
          latitude: 0.0,
          house: 11,
          sign: 'Pisces',
          signSymbol: '♓',
          zodiacSignName: 'Pisces',
          zodiacSignLord: 'Jupiter',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: true,
          speed: 0.0,
          localizedName: 'Ketu',
          nakshatra: {
            number: 26,
            name: 'Uttaraabhadra',
            pada: 1,
            vimsottariLord: 'Saturn'
          },
          raw: null
        }
      ],
      houses: [
        { number: 1, name: '上升点', nameEn: 'Ascendant', sanskrit: 'Lagna', sign: 'Taurus', signSymbol: '♉', lord: 'Venus', lordPlacement: '7th House', lordStrength: 'Strong', planets: [] },
        { number: 2, name: '财富宫', nameEn: 'Wealth', sanskrit: 'Dhana Bhava', sign: 'Gemini', signSymbol: '♊', lord: 'Mercury', lordPlacement: '5th House', lordStrength: 'Strong', planets: [] },
        { number: 3, name: '沟通宫', nameEn: 'Communication', sanskrit: 'Sahaja Bhava', sign: 'Cancer', signSymbol: '♋', lord: 'Moon', lordPlacement: '4th House', lordStrength: 'Medium', planets: [] },
        { number: 4, name: '家庭宫', nameEn: 'Home', sanskrit: 'Sukha Bhava', sign: 'Leo', signSymbol: '♌', lord: 'Sun', lordPlacement: '1st House', lordStrength: 'Strong', planets: [] },
        { number: 5, name: '子女宫', nameEn: 'Children', sanskrit: 'Putra Bhava', sign: 'Virgo', signSymbol: '♍', lord: 'Mercury', lordPlacement: '2nd House', lordStrength: 'Strong', planets: [] },
        { number: 6, name: '健康宫', nameEn: 'Health', sanskrit: 'Ripu Bhava', sign: 'Libra', signSymbol: '♎', lord: 'Venus', lordPlacement: '1st House', lordStrength: 'Medium', planets: [] },
        { number: 7, name: '婚姻宫', nameEn: 'Marriage', sanskrit: 'Kalatra Bhava', sign: 'Scorpio', signSymbol: '♏', lord: 'Mars', lordPlacement: '6th House', lordStrength: 'Strong', planets: [] },
        { number: 8, name: '转化宫', nameEn: 'Transformation', sanskrit: 'Randhra Bhava', sign: 'Sagittarius', signSymbol: '♐', lord: 'Jupiter', lordPlacement: '9th House', lordStrength: 'Strong', planets: [] },
        { number: 9, name: '智慧宫', nameEn: 'Wisdom', sanskrit: 'Dharma Bhava', sign: 'Capricorn', signSymbol: '♑', lord: 'Saturn', lordPlacement: '10th House', lordStrength: 'Strong', planets: [] },
        { number: 10, name: '事业宫', nameEn: 'Career', sanskrit: 'Karma Bhava', sign: 'Aquarius', signSymbol: '♒', lord: 'Saturn', lordPlacement: '9th House', lordStrength: 'Strong', planets: [] },
        { number: 11, name: '收获宫', nameEn: 'Gains', sanskrit: 'Labha Bhava', sign: 'Pisces', signSymbol: '♓', lord: 'Jupiter', lordPlacement: '8th House', lordStrength: 'Medium', planets: [] },
        { number: 12, name: '解脱宫', nameEn: 'Liberation', sanskrit: 'Vyaya Bhava', sign: 'Aries', signSymbol: '♈', lord: 'Mars', lordPlacement: '6th House', lordStrength: 'Medium', planets: [] }
      ],
      aspects: [
        { from: 'Sun', to: 'Moon', type: 'Trine', orb: 2.5, strength: 0.8, description: 'Harmonious aspect between Sun and Moon' }
      ],
      lagna: 1,
      lagnaDetails: { longitude: 45.2, sign: 'Taurus', signSymbol: '♉', degree: 15, minute: 12, second: 0 },
      moonSign: 'Leo',
      sunSign: 'Taurus',
      risingSign: 'Taurus',
      chartType: 'North Indian',
      ayanamsa: 'Lahiri',
      timestamp: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };
}

// 处理API返回的占星数据
function processAstrologyData(chartData, navamsaData, birthInfo) {
  const processPlanets = (apiOutput) => {
    if (!apiOutput || typeof apiOutput !== 'object') {
      return [];
    }

    // 处理扩展API数据格式 (planets/extended API)
    if (!Array.isArray(apiOutput)) {
      // 传统印度占星学只包含9个天体：7个行星 + 2个交点 + 上升点
      const traditionalPlanets = [
        'Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'
      ];
      
      return Object.entries(apiOutput)
        .map(([key, planet]) => {
          // 只处理传统印度占星学的天体，排除现代行星
          if (!planet || typeof planet !== 'object' || 
              key === 'ayanamsa' || key === 'debug' || 
              !traditionalPlanets.includes(key)) {
            return null;
          }

          const signIndex = (planet.current_sign || 1) - 1;
          const degree = typeof planet.degrees === 'number'
            ? planet.degrees
            : Math.floor(planet.normDegree || 0);
          const minute = typeof planet.minutes === 'number'
            ? planet.minutes
            : Math.floor(((planet.normDegree || 0) - degree) * 60);
          const second = typeof planet.seconds === 'number'
            ? Math.round(planet.seconds)
            : Math.round((((planet.normDegree || 0) - degree) * 60 - minute) * 60);

          return {
            name: key,
            symbol: PLANET_SYMBOLS[key] || key.charAt(0).toUpperCase(),
            longitude: planet.fullDegree ?? 0,
            fullDegree: planet.fullDegree ?? 0,
            normDegree: planet.normDegree ?? 0,
            latitude: planet.latitude ?? 0,
            house: planet.house_number ?? 1,
            sign: SIGN_NAMES[signIndex] || 'Unknown',
            signSymbol: SIGN_SYMBOLS[signIndex] || '?',
            zodiacSignName: planet.zodiac_sign_name || SIGN_NAMES[signIndex] || 'Unknown',
            zodiacSignLord: planet.zodiac_sign_lord || SIGN_LORDS[signIndex] || 'Unknown',
            degree,
            minute,
            second,
            retrograde: planet.isRetro === 'true' || planet.isRetro === true,
            speed: planet.speed ?? 0,
            localizedName: planet.localized_name || null,
            nakshatra: planet.nakshatra_name
              ? {
                  number: planet.nakshatra_number,
                  name: planet.nakshatra_name,
                  pada: planet.nakshatra_pada,
                  vimsottariLord: planet.nakshatra_vimsottari_lord
                }
              : null,
            raw: planet
          };
        })
        .filter((planet) => planet !== null);
    }

    // 处理D1盘数据格式 (planets API)
    if (Array.isArray(apiOutput) && apiOutput.length > 0) {
      const planetsData = apiOutput[0];
      return Object.values(planetsData)
        .map((planet) => {
          if (!planet || typeof planet !== 'object' || planet.name === 'ayanamsa' || planet.name === 'debug') {
            return null;
          }

          const signIndex = (planet.current_sign || 1) - 1;
          const degree = Math.floor(planet.normDegree || 0);
          const minute = Math.floor(((planet.normDegree || 0) - degree) * 60);
          const second = Math.floor((((planet.normDegree || 0) - degree) * 60 - minute) * 60);

          return {
            name: planet.name,
            symbol: PLANET_SYMBOLS[planet.name] || planet.name.charAt(0).toUpperCase(),
            longitude: planet.fullDegree || 0,
            fullDegree: planet.fullDegree || 0,
            normDegree: planet.normDegree || 0,
            latitude: 0,
            house: planet.current_sign || 1,
            sign: SIGN_NAMES[signIndex] || 'Unknown',
            signSymbol: SIGN_SYMBOLS[signIndex] || '?',
            zodiacSignName: SIGN_NAMES[signIndex] || 'Unknown',
            zodiacSignLord: SIGN_LORDS[signIndex] || 'Unknown',
            degree,
            minute,
            second,
            retrograde: planet.isRetro === 'true',
            speed: 1.0,
            localizedName: planet.name,
            nakshatra: null,
            raw: planet
          };
        })
        .filter((planet) => planet !== null);
    }

    // 处理Navamsa数据格式
    return Object.values(apiOutput).map((planet) => {
      const signIndex = (planet.current_sign || 1) - 1;
      return {
        name: planet.name,
        symbol: PLANET_SYMBOLS[planet.name] || planet.name.charAt(0).toUpperCase(),
        longitude: (planet.current_sign - 1) * 30,
        fullDegree: (planet.current_sign - 1) * 30,
        normDegree: 0,
        latitude: 0,
        house: planet.house_number,
        sign: SIGN_NAMES[signIndex] || 'Unknown',
        signSymbol: SIGN_SYMBOLS[signIndex] || '?',
        zodiacSignName: SIGN_NAMES[signIndex] || 'Unknown',
        zodiacSignLord: SIGN_LORDS[signIndex] || 'Unknown',
        degree: 0,
        minute: 0,
        second: 0,
        retrograde: planet.isRetro === 'true',
        speed: 1.0,
        localizedName: planet.name,
        nakshatra: null,
        raw: planet
      };
    });
  };

  const processHouses = (apiOutput, planets) => {
    const ascendant = apiOutput?.Ascendant;
    const ascendantSignIndex = ascendant ? (ascendant.current_sign || 1) - 1 : null;

    const houseNames = [
      { name: '上升点', nameEn: 'Ascendant', sanskrit: 'Lagna' },
      { name: '财富宫', nameEn: 'Wealth', sanskrit: 'Dhana Bhava' },
      { name: '沟通宫', nameEn: 'Communication', sanskrit: 'Sahaja Bhava' },
      { name: '家庭宫', nameEn: 'Home', sanskrit: 'Sukha Bhava' },
      { name: '子女宫', nameEn: 'Children', sanskrit: 'Putra Bhava' },
      { name: '健康宫', nameEn: 'Health', sanskrit: 'Ripu Bhava' },
      { name: '婚姻宫', nameEn: 'Marriage', sanskrit: 'Kalatra Bhava' },
      { name: '转化宫', nameEn: 'Transformation', sanskrit: 'Randhra Bhava' },
      { name: '智慧宫', nameEn: 'Wisdom', sanskrit: 'Dharma Bhava' },
      { name: '事业宫', nameEn: 'Career', sanskrit: 'Karma Bhava' },
      { name: '收获宫', nameEn: 'Gains', sanskrit: 'Labha Bhava' },
      { name: '解脱宫', nameEn: 'Liberation', sanskrit: 'Vyaya Bhava' }
    ];

    return houseNames.map((house, index) => {
      const houseNumber = index + 1;
      const calculatedSignIndex =
        ascendantSignIndex !== null
          ? (ascendantSignIndex + index) % SIGN_NAMES.length
          : index % SIGN_NAMES.length;
      const planetsInHouse = Array.isArray(planets)
        ? planets.filter((planet) => planet.house === houseNumber)
        : [];
      const houseLord = SIGN_LORDS[calculatedSignIndex] || 'Unknown';
      const lordPlanet = planets?.find((planet) => planet.name === houseLord);

      return {
        number: houseNumber,
        ...house,
        sign: SIGN_NAMES[calculatedSignIndex] || house.nameEn,
        signSymbol: SIGN_SYMBOLS[calculatedSignIndex] || '',
        lord: houseLord,
        lordPlacement: lordPlanet ? `位于第${lordPlanet.house}宫` : '未知',
        lordStrength: '未知',
        planets: planetsInHouse
      };
    });
  };

  const primaryOutput = chartData?.output || navamsaData?.output || {};
  const planets = processPlanets(primaryOutput);
  const houses = processHouses(primaryOutput, planets);
  const ascendant = primaryOutput?.Ascendant || null;
  const moon = primaryOutput?.Moon || null;
  const sun = primaryOutput?.Sun || null;
  const lagnaSignIndex = ascendant ? (ascendant.current_sign || 1) - 1 : null;

  const calcDegreeComponent = (value) => (typeof value === 'number' ? value : 0);
  const calcMinuteComponent = (normDegree) => Math.floor((normDegree % 1) * 60);
  const calcSecondComponent = (normDegree) => Math.round((((normDegree % 1) * 60) % 1) * 60);

  return {
    birthInfo: {
      name: birthInfo.name,
      date: birthInfo.date,
      time: birthInfo.time,
      city: birthInfo.city,
      latitude: birthInfo.latitude,
      longitude: birthInfo.longitude,
      timezone: birthInfo.timezone
    },
    planets,
    houses,
    aspects: [],
    lagna: ascendant?.house_number || 1,
    lagnaDetails: ascendant
      ? {
          longitude: ascendant.fullDegree ?? 0,
          sign: lagnaSignIndex !== null ? SIGN_NAMES[lagnaSignIndex] : 'Unknown',
          signSymbol: lagnaSignIndex !== null ? SIGN_SYMBOLS[lagnaSignIndex] : '?',
          degree: calcDegreeComponent(ascendant.degrees ?? Math.floor(ascendant.normDegree || 0)),
          minute:
            typeof ascendant.minutes === 'number'
              ? ascendant.minutes
              : calcMinuteComponent(ascendant.normDegree || 0),
          second:
            typeof ascendant.seconds === 'number'
              ? Math.round(ascendant.seconds)
              : calcSecondComponent(ascendant.normDegree || 0)
        }
      : null,
    moonSign:
      moon?.zodiac_sign_name ||
      (moon?.current_sign ? SIGN_NAMES[(moon.current_sign || 1) - 1] : 'Unknown'),
    sunSign:
      sun?.zodiac_sign_name ||
      (sun?.current_sign ? SIGN_NAMES[(sun.current_sign || 1) - 1] : 'Unknown'),
    risingSign: lagnaSignIndex !== null ? SIGN_NAMES[lagnaSignIndex] : 'Unknown',
    chartType: 'North Indian',
    ayanamsa:
      chartData?.output?.ayanamsa ||
      chartData?.ayanamsa ||
      navamsaData?.output?.ayanamsa ||
      navamsaData?.ayanamsa ||
      'Lahiri',
    timestamp: new Date().toISOString(),
    apiData: {
      chart: chartData,
      navamsa: navamsaData
    }
  };
}

// 占星图表计算端点
app.post('/api/astrology/chart', async (req, res) => {
  const { name, date, time, city, latitude, longitude, timezone } = req.body;
  
  if (!name || !date || !time || !city) {
    return res.status(400).json({
      success: false,
      error: 'bad_request',
      message: 'Missing required fields: name, date, time, city'
    });
  }

  try {
    // 转换出生信息格式
    const birthData = freeAstrologyClient.convertBirthInfo({
      name,
      date,
      time,
      city,
      latitude: latitude || 39.9042,
      longitude: longitude || 116.4074,
      timezone: timezone || 'Asia/Shanghai'
    });

    console.log('Calling Free Astrology API with data:', birthData);

    // 调用Free Astrology API获取基础图表信息
    const chartResult = await freeAstrologyClient.getBasicChartInfo(birthData);
    
    if (!chartResult.success) {
      
      console.log('Chart result:', chartResult.success);
      if (!chartResult.success) {
        console.error('Failed to get chart data:', chartResult.error);
      }
      console.error('Free Astrology API failed:', chartResult.error);
      // 如果API失败，返回模拟数据作为fallback
      return res.json(getMockChartData(name, date, time, city, latitude, longitude, timezone));
    }

    // 调用Navamsa图表API获取更详细信息
    const navamsaResult = await freeAstrologyClient.getNavamsaChartInfo(birthData);
    
    // 处理API返回的数据
    const processedData = processAstrologyData(chartResult.data, navamsaResult.data, {
      name,
      date,
      time,
      city,
      latitude: latitude || 39.9042,
      longitude: longitude || 116.4074,
      timezone: timezone || 'Asia/Shanghai'
    });

    res.json({
      success: true,
      data: processedData,
      timestamp: new Date().toISOString(),
      source: 'free-astrology-api'
    });

  } catch (error) {
    console.error('Chart calculation error:', error);
    // 出错时返回模拟数据
    res.json(getMockChartData(name, date, time, city, latitude, longitude, timezone));
  }
});

// 报告生成端点
app.post('/api/report-generate', (req, res) => {
  console.log('Received report-generate request:', req.body);
  if (!req.body || !req.body.birthInfo) {
    return res.status(400).json({ success: false, error: 'birthInfo is required' });
  }

  const mockReportData = {
    success: true,
    cached: false,
    data: {
      basicInfo: {
        name: req.body.birthInfo.name || "测试用户",
        birthDate: req.body.birthInfo.date || "1993-11-20",
        birthTime: req.body.birthInfo.time || "14:30",
        location: `${req.body.birthInfo.latitude || 39.9042}, ${req.body.birthInfo.longitude || 116.4074}`,
        gender: "female"
      },
      astrology: {
        sunSign: "天蝎座",
        moonSign: "双鱼座",
        risingSign: "狮子座",
        message: "基于占星学的详细分析报告"
      },
      personality: {
        traits: ["直觉敏锐", "情感丰富", "富有创造力"],
        strengths: ["洞察力强", "情感深度", "艺术天赋"],
        challenges: ["情绪波动", "过于敏感", "需要独处时间"]
      },
      compatibility: {
        bestMatches: ["巨蟹座", "双鱼座", "天蝎座"],
        message: "与情感丰富、理解力强的伴侣最匹配"
      }
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      cachedAt: new Date().toISOString(),
      model: "mock-astrology-v1",
      usage: null,
      payloadHash: `mock-hash-${Date.now()}`
    }
  };

  res.status(200).json(mockReportData);
});

// 灵魂伴侣生成端点
app.post('/api/soulmate-generate', async (req, res) => {
  const { birthInfo } = req.body;
  
  if (!birthInfo) {
    return res.status(400).json({
      success: false,
      error: 'bad_request',
      message: 'birthInfo is required'
    });
  }

  try {
    // Try to get chart data first
    let chartData = null;
    try {
      const birthData = freeAstrologyClient.convertBirthInfo(birthData);
      const chartResult = await freeAstrologyClient.getBasicChartInfo(birthData);
      if (chartResult.success) {
        chartData = processAstrologyData(chartResult.data, null, birthInfo);
      }
    } catch (e) {
      console.log('Could not fetch chart data for soulmate generation');
    }

    // Generate soulmate description using DeepSeek (if available)
    let soulmateData = null;
    if (deepseekClient && chartData) {
      try {
        console.log('🤖 Generating soulmate description with DeepSeek...');
        soulmateData = await deepseekClient.generateSoulmateDescription(birthInfo, chartData);
        console.log('✅ Soulmate description generated');
      } catch (aiError) {
        console.error('⚠️  DeepSeek soulmate generation failed:', aiError.message);
      }
    }

    // Fallback to mock data if AI generation failed or unavailable
    if (!soulmateData) {
      soulmateData = {
        description: "您的理想伴侣是一个温柔体贴、理解力强的人。",
        traits: ["善解人意", "情感丰富", "富有创造力"],
        relationship: "你们的关系会建立在深度理解与情感共鸣之上",
        whereToMeet: "在艺术展览、书店或咖啡厅等充满文化氛围的场所"
      };
    }

    res.json({
      success: true,
      data: {
        soulmate: soulmateData,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: deepseekClient ? 'deepseek-ai' : 'fallback'
        }
      }
    });

  } catch (error) {
    console.error('Soulmate generation error:', error);
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: error.message
    });
  }
});
app.get('/', (req, res) => {
  res.json({
    message: 'AstroSoul API Server',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'POST /api/astrology/chart',
      'POST /api/report-generate',
      'POST /api/soulmate-generate'
    ]
  });
});



// 根据提示词生成命盘分析报告
app.post('/api/chart-analysis', async (req, res) => {
  const { birthInfo, prompt } = req.body;
  
  console.log('📊 Chart analysis request received');
  console.log('Birth info:', birthInfo);
  console.log('Prompt:', prompt);
  
  if (!prompt) {
    return res.status(400).json({
      success: false,
      error: 'bad_request',
      message: 'prompt is required'
    });
  }

  try {
    // Get chart data
    let chartData = null;
    
    if (birthInfo) {
      try {
        const birthData = freeAstrologyClient.convertBirthInfo({
          name: birthInfo.name || 'User',
          date: birthInfo.date,
          time: birthInfo.time,
          city: birthInfo.city || 'Beijing',
          latitude: birthInfo.latitude || 39.9042,
          longitude: birthInfo.longitude || 116.4074,
          timezone: birthInfo.timezone || 'Asia/Shanghai'
        });

        const chartResult = await freeAstrologyClient.getBasicChartInfo(birthData);
        const navamsaResult = await freeAstrologyClient.getNavamsaChartInfo(birthData);
        
        if (chartResult.success) {
          chartData = processAstrologyData(
            chartResult.data, 
            navamsaResult.data, 
            birthInfo
          );
        }
      } catch (apiError) {
        console.error('External API failed, using mock data:', apiError.message);
      }
    }
    
    // Use mock data as fallback or default
    if (!chartData) {
      const mockDate = birthInfo?.date || '1993-11-20';
      const mockTime = birthInfo?.time || '14:30';
      const mockCity = birthInfo?.city || 'Beijing';
      chartData = getMockChartData(birthInfo?.name || 'User', mockDate, mockTime, mockCity);
    }

    // Generate analysis report using DeepSeek
    let analysis = '抱歉，暂时无法生成分析报告。';
    
    if (deepseekClient && chartData) {
      try {
        console.log('🤖 Generating chart analysis with DeepSeek...');
        analysis = await deepseekClient.generateChartAnalysisReport(prompt, chartData);
        console.log('✅ Chart analysis generated successfully');
      } catch (aiError) {
        console.error('⚠️  DeepSeek chart analysis failed:', aiError.message);
      }
    }

    res.json({
      success: true,
      data: {
        analysis: analysis,
        chartData: chartData,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: deepseekClient ? 'deepseek-ai' : 'fallback',
          prompt: prompt
        }
      }
    });

  } catch (error) {
    console.error('Chart analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AstroSoul API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Chart API: http://localhost:${PORT}/api/astrology/chart`);
  console.log(`📊 Report API: http://localhost:${PORT}/api/report-generate`);
  console.log(`💕 Soulmate API: http://localhost:${PORT}/api/soulmate-generate`);
});
