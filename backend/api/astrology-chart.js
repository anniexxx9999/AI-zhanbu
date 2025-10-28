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
  Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃',
  Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋', Ascendant: 'Asc',
  Uranus: '♅', Neptune: '♆', Pluto: '♇'
};

// 处理API返回的占星数据
function processAstrologyData(chartData, navamsaData, birthInfo) {
  const processPlanets = (apiOutput) => {
    if (!apiOutput || typeof apiOutput !== 'object') {
      return [];
    }

    // 传统印度占星学只包含9个天体：7个行星 + 2个交点 + 上升点
    const traditionalPlanets = [
      'Ascendant', 'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'
    ];
    
    if (!Array.isArray(apiOutput)) {
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

    return [];
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

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      console.error('Free Astrology API failed:', chartResult.error);
      return res.status(500).json({
        success: false,
        error: 'api_error',
        message: 'Failed to fetch astrology data'
      });
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
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Internal server error'
    });
  }
};
