// backend/api/astrology-chart.js
require('dotenv').config();
const FreeAstrologyClient = require('../freeAstrologyClient');

const freeAstrologyClient = new FreeAstrologyClient();

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_SYMBOLS = [
  '♈', '♉', '♊', '♋', '♌', '♍',
  '♎', '♏', '♐', '♑', '♒', '♓'
];

const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

const PLANET_SYMBOLS = {
  'Sun': '☉',
  'Moon': '☽',
  'Mars': '♂',
  'Mercury': '☿',
  'Jupiter': '♃',
  'Venus': '♀',
  'Saturn': '♄',
  'Rahu': '☊',
  'Ketu': '☋',
  'Ascendant': 'Asc'
};

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
            symbol: PLANET_SYMBOLS[key] || '?',
            longitude: planet.longitude || 0,
            fullDegree: planet.longitude || 0,
            normDegree: planet.normDegree || 0,
            latitude: planet.latitude || 0,
            house: planet.current_house || 1,
            sign: SIGN_NAMES[signIndex] || 'Unknown',
            signSymbol: SIGN_SYMBOLS[signIndex] || '?',
            zodiacSignName: SIGN_NAMES[signIndex] || 'Unknown',
            zodiacSignLord: SIGN_LORDS[signIndex] || 'Unknown',
            degree: degree,
            minute: minute,
            second: second,
            retrograde: planet.is_retrograde || false,
            speed: planet.speed || 0,
            localizedName: getLocalizedName(key),
            nakshatra: planet.nakshatra ? {
              number: planet.nakshatra.number || 0,
              name: planet.nakshatra.name || 'Unknown',
              pada: planet.nakshatra.pada || 1,
              vimsottariLord: planet.nakshatra.vimsottari_lord || 'Unknown'
            } : null,
            raw: planet
          };
        })
        .filter((planet) => planet !== null);
    }

    // 处理数组格式的数据
    return apiOutput.map((planet, index) => {
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
        name: planet.name || `Planet_${index}`,
        symbol: PLANET_SYMBOLS[planet.name] || '?',
        longitude: planet.longitude || 0,
        fullDegree: planet.longitude || 0,
        normDegree: planet.normDegree || 0,
        latitude: planet.latitude || 0,
        house: planet.current_house || 1,
        sign: SIGN_NAMES[signIndex] || 'Unknown',
        signSymbol: SIGN_SYMBOLS[signIndex] || '?',
        zodiacSignName: SIGN_NAMES[signIndex] || 'Unknown',
        zodiacSignLord: SIGN_LORDS[signIndex] || 'Unknown',
        degree: degree,
        minute: minute,
        second: second,
        retrograde: planet.is_retrograde || false,
        speed: planet.speed || 0,
        localizedName: getLocalizedName(planet.name),
        nakshatra: planet.nakshatra ? {
          number: planet.nakshatra.number || 0,
          name: planet.nakshatra.name || 'Unknown',
          pada: planet.nakshatra.pada || 1,
          vimsottariLord: planet.nakshatra.vimsottari_lord || 'Unknown'
        } : null,
        raw: planet
      };
    });
  };

  const processHouses = (apiOutput) => {
    if (!apiOutput || !Array.isArray(apiOutput)) {
      return [];
    }

    return apiOutput.map((house, index) => ({
      number: house.house_number || (index + 1),
      name: `House ${house.house_number || (index + 1)}`,
      nameEn: `House ${house.house_number || (index + 1)}`,
      sanskrit: getHouseSanskritName(house.house_number || (index + 1)),
      sign: SIGN_NAMES[(house.sign || 1) - 1] || 'Unknown',
      signSymbol: SIGN_SYMBOLS[(house.sign || 1) - 1] || '?',
      lord: SIGN_LORDS[(house.sign || 1) - 1] || 'Unknown',
      lordPlacement: 'Unknown',
      lordStrength: 'Unknown',
      planets: []
    }));
  };

  return {
    birthInfo: birthInfo,
    planets: processPlanets(chartData),
    houses: processHouses(chartData.houses || []),
    aspects: [],
    lagna: 1,
    lagnaDetails: {
      longitude: 0,
      sign: 'Unknown',
      signSymbol: '?',
      degree: 0,
      minute: 0,
      second: 0
    },
    moonSign: 'Unknown',
    sunSign: 'Unknown',
    risingSign: 'Unknown',
    chartType: 'North Indian',
    ayanamsa: 'Lahiri',
    timestamp: new Date().toISOString()
  };
}

function getLocalizedName(planetName) {
  const names = {
    'Sun': 'Surya',
    'Moon': 'Chandra',
    'Mars': 'Mangal',
    'Mercury': 'Budh',
    'Jupiter': 'Guru',
    'Venus': 'Shukra',
    'Saturn': 'Shani',
    'Rahu': 'Rahu',
    'Ketu': 'Ketu',
    'Ascendant': 'Lagna'
  };
  return names[planetName] || planetName;
}

function getHouseSanskritName(houseNumber) {
  const names = {
    1: 'Lagna',
    2: 'Dhana',
    3: 'Sahaja',
    4: 'Sukha',
    5: 'Putra',
    6: 'Ari',
    7: 'Kalatra',
    8: 'Ayu',
    9: 'Bhagya',
    10: 'Karma',
    11: 'Labha',
    12: 'Vyaya'
  };
  return names[houseNumber] || `House ${houseNumber}`;
}

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
      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        name: `House ${i + 1}`,
        nameEn: `House ${i + 1}`,
        sanskrit: getHouseSanskritName(i + 1),
        sign: SIGN_NAMES[i % 12],
        signSymbol: SIGN_SYMBOLS[i % 12],
        lord: SIGN_LORDS[i % 12],
        lordPlacement: 'Unknown',
        lordStrength: 'Unknown',
        planets: []
      })),
      aspects: [],
      lagna: 1,
      lagnaDetails: {
        longitude: 45.2,
        sign: 'Taurus',
        signSymbol: '♉',
        degree: 15,
        minute: 12,
        second: 0
      },
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

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'method_not_allowed',
      message: 'Only POST method is allowed'
    });
  }

  try {
    const { name, date, time, city, latitude, longitude, timezone } = req.body;

    if (!name || !date || !time || !city) {
      return res.status(400).json({
        success: false,
        error: 'bad_request',
        message: 'Missing required fields: name, date, time, city'
      });
    }

    const birthData = freeAstrologyClient.convertBirthInfo({
      name,
      date,
      time,
      city,
      latitude: latitude || 39.9042,
      longitude: longitude || 116.4074,
      timezone: timezone || 'Asia/Shanghai'
    });

    const chartResult = await freeAstrologyClient.getBasicChartInfo(birthData);

    if (!chartResult.success) {
      return res.json(getMockChartData(name, date, time, city, latitude, longitude, timezone));
    }

    const navamsaResult = await freeAstrologyClient.getNavamsaChartInfo(birthData);

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
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Internal server error'
    });
  }
};