// 加载环境变量
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const FreeAstrologyClient = require('./freeAstrologyClient');
const { generateAstrologyAnalysis } = require('./services/astrologyAnalysisService');
const JimengAIService = require('./services/jimengAIService');
const AITextService = require('./services/aiTextService');
const { buildSpouseReportPrompt, formatReportContent } = require('./services/spouseReportService');
const { generateCacheKey, getCache, setCache } = require('./services/reportCache');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 初始化Free Astrology API客户端
const freeAstrologyClient = new FreeAstrologyClient();

// 初始化即梦AI服务
const jimengAIService = new JimengAIService();

// 初始化AI文本生成服务
const aiTextService = new AITextService();

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

          // 处理retrograde字段（API返回的是isRetro字符串 "true"/"false"）
          const isRetrograde = planet.isRetro === 'true' || planet.isRetro === true || planet.is_retrograde === true;

          // 处理Nakshatra数据（API返回的是扁平结构）
          const nakshatra = (planet.nakshatra_number || planet.nakshatra) ? {
            number: planet.nakshatra_number || planet.nakshatra?.number || 0,
            name: planet.nakshatra_name || planet.nakshatra?.name || 'Unknown',
            pada: planet.nakshatra_pada || planet.nakshatra?.pada || 1,
            vimsottariLord: planet.nakshatra_vimsottari_lord || planet.nakshatra?.vimsottari_lord || 'Unknown'
          } : null;

          return {
            name: key,
            symbol: PLANET_SYMBOLS[key] || '?',
            longitude: planet.fullDegree || planet.longitude || 0,
            fullDegree: planet.fullDegree || planet.longitude || 0,
            normDegree: planet.normDegree || 0,
            latitude: planet.latitude || 0,
            house: planet.house_number || planet.current_house || 1,
            sign: planet.zodiac_sign_name || SIGN_NAMES[signIndex] || 'Unknown',
            signSymbol: SIGN_SYMBOLS[signIndex] || '?',
            zodiacSignName: planet.zodiac_sign_name || SIGN_NAMES[signIndex] || 'Unknown',
            zodiacSignLord: planet.zodiac_sign_lord || SIGN_LORDS[signIndex] || 'Unknown',
            degree: degree,
            minute: minute,
            second: second,
            retrograde: isRetrograde,
            speed: planet.speed || 0,
            localizedName: planet.localized_name || getLocalizedName(key),
            nakshatra: nakshatra,
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

  const planets = processPlanets(chartData);
  const houses = processHouses(chartData.houses || []);
  
  // 从planets中提取星座信息
  const sunPlanet = planets.find(p => p.name === 'Sun');
  const moonPlanet = planets.find(p => p.name === 'Moon');
  const ascPlanet = planets.find(p => p.name === 'Ascendant');
  
  return {
    birthInfo: birthInfo,
    planets: planets,
    houses: houses,
    aspects: [],
    lagna: 1,
    lagnaDetails: {
      longitude: ascPlanet?.longitude || 0,
      sign: ascPlanet?.sign || 'Unknown',
      signSymbol: ascPlanet?.signSymbol || '?',
      degree: ascPlanet?.degree || 0,
      minute: ascPlanet?.minute || 0,
      second: ascPlanet?.second || 0
    },
    moonSign: moonPlanet?.sign || 'Unknown',
    sunSign: sunPlanet?.sign || 'Unknown',
    risingSign: ascPlanet?.sign || 'Unknown',
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
    1: 'Lagna', 2: 'Dhana', 3: 'Sahaja', 4: 'Sukha',
    5: 'Putra', 6: 'Ari', 7: 'Kalatra', 8: 'Ayu',
    9: 'Bhagya', 10: 'Karma', 11: 'Labha', 12: 'Vyaya'
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

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0',
    services: {
      astrology: 'operational',
      ephemeris: 'operational',
      calculations: 'operational'
    }
  });
});

// 占星图表计算端点
app.post('/api/astrology/chart', async (req, res) => {
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
    
    let processedData;
    let dataSource = 'free-astrology-api';
    
    if (!chartResult.success) {
      // 使用mock数据
      const mockResponse = getMockChartData(name, date, time, city, latitude, longitude, timezone);
      processedData = mockResponse.data;
      dataSource = 'mock-data';
    } else {
      const navamsaResult = await freeAstrologyClient.getNavamsaChartInfo(birthData);
      
      // API返回的数据结构是 { statusCode: 200, output: {...} }
      // 需要提取output部分
      const chartOutput = chartResult.data.output || chartResult.data;
      const navamsaOutput = navamsaResult.data?.output || navamsaResult.data || {};
      
      // 从planets数据中提取houses信息（基于上升点计算）
      const ascPlanet = chartOutput.Ascendant || chartOutput.ascendant;
      const ascSign = ascPlanet ? (ascPlanet.current_sign || 1) : 1;
      
      // 生成12个宫位（基于上升星座）
      const houses = Array.from({ length: 12 }, (_, i) => {
        const houseSign = ((ascSign - 1 + i) % 12) + 1;
        return {
          house_number: i + 1,
          sign: houseSign
        };
      });
      
      processedData = processAstrologyData(
        { ...chartOutput, houses: houses },
        navamsaOutput,
        {
          name,
          date,
          time,
          city,
          latitude: latitude || 39.9042,
          longitude: longitude || 116.4074,
          timezone: timezone || 'Asia/Shanghai'
        }
      );
    }

    // 生成高级分析数据（无论是真实数据还是mock数据）
    let analysisData = null;
    try {
      analysisData = generateAstrologyAnalysis(processedData, {
        name,
        date,
        time,
        city,
        latitude: latitude || 39.9042,
        longitude: longitude || 116.4074,
        timezone: timezone || 'Asia/Shanghai'
      });
      console.log('✅ Analysis data generated successfully');
    } catch (analysisError) {
      console.error('❌ Failed to generate analysis data:', analysisError.message);
      console.error('Error stack:', analysisError.stack);
      // 继续返回基础数据，即使分析失败
    }

    res.json({
      success: true,
      data: {
        ...processedData,
        analysis: analysisData // 添加分析数据
      },
      timestamp: new Date().toISOString(),
      source: dataSource
    });

  } catch (error) {
    console.error('Chart calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: 'Internal server error'
    });
  }
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: 'AstroSoul Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      chart: '/api/astrology/chart',
      aiImage: '/api/ai/generate-image'
    }
  });
});

// 即梦AI文生图端点（火山方舟Ark API）
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const { prompt, width = 1024, height = 1024, size = null, watermark = true } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: prompt'
      });
    }

    // 使用新的同步API
    const result = await jimengAIService.generateImage(prompt, {
      width,
      height,
      size,
      response_format: 'url',
      watermark
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to generate image',
        details: result.details
      });
    }

    if (result.imageUrl) {
      return res.json({
        success: true,
        imageUrl: result.imageUrl,
        imageUrls: result.imageUrls || [result.imageUrl],
        taskId: result.taskId || 'immediate'
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'No image URL returned'
      });
    }
  } catch (error) {
    console.error('AI image generation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// 配偶报告生成端点
app.post('/api/report/spouse', async (req, res) => {
  try {
    const { chartData, birthInfo } = req.body;

    // 验证输入
    if (!chartData) {
      return res.status(400).json({
        success: false,
        error: 'chartData is required'
      });
    }

    if (!birthInfo) {
      return res.status(400).json({
        success: false,
        error: 'birthInfo is required'
      });
    }

    console.log('📝 开始生成配偶报告:', {
      name: birthInfo?.name || '未知',
      date: birthInfo?.date || '未知',
      hasChartData: !!chartData,
      hasPlanets: !!chartData?.planets,
      hasHouses: !!chartData?.houses
    });

    // 检查缓存（安全处理）
    let cacheKey = null;
    let cachedReport = null;
    try {
      cacheKey = generateCacheKey(chartData, birthInfo);
      if (cacheKey && !cacheKey.startsWith('error_')) {
        cachedReport = getCache(cacheKey);
      }
    } catch (cacheError) {
      console.warn('⚠️ 缓存检查失败，继续生成新报告:', cacheError.message);
    }
    
    if (cachedReport) {
      console.log('✅ 使用缓存报告');
      return res.json({
        success: true,
        data: cachedReport,
        source: 'cache',
        metadata: {
          generatedAt: new Date().toISOString(),
          cached: true
        }
      });
    }

    // 构建AI提示词（优化后的简洁版本）
    let prompt;
    try {
      prompt = buildSpouseReportPrompt(chartData, birthInfo);
    } catch (promptError) {
      console.error('❌ 构建prompt失败:', promptError);
      return res.status(500).json({
        success: false,
        error: 'Failed to build prompt: ' + promptError.message
      });
    }

    // 系统提示词（简化）
    const systemPrompt = `你是印度占星大师，用温暖、诗意、赋能的语言解读命盘。专业而温暖，避免宿命论。`;

    const startTime = Date.now();
    
    // 调用AI生成报告（优化：减少token数，提高速度）
    const aiResult = await aiTextService.generateText(prompt, {
      systemPrompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 2000  // 从3000减少到2000，加快生成速度
    });
    
    const generationTime = Date.now() - startTime;
    console.log(`⏱️ 报告生成耗时: ${generationTime}ms`);

    if (!aiResult.success) {
      console.error('❌ AI生成报告失败:', aiResult.error);
      
      // 如果AI失败，返回基于模板的报告（使用实际数据）
      return res.json({
        success: true,
        data: generateFallbackReport(chartData, birthInfo),
        source: 'template',
        error: aiResult.error
      });
    }

    // 格式化报告内容
    const formattedReport = formatReportContent(aiResult.content);

    // 提取关键数据用于前端展示
    const keyData = extractKeyData(chartData, birthInfo);

    const reportData = {
      ...formattedReport,
      keyData: keyData,
      birthInfo: birthInfo
    };

    // 保存到缓存（安全处理）
    try {
      if (cacheKey && !cacheKey.startsWith('error_')) {
        setCache(cacheKey, reportData);
      }
    } catch (cacheError) {
      console.warn('⚠️ 保存缓存失败:', cacheError.message);
    }

    console.log('✅ 报告生成成功');

    res.json({
      success: true,
      data: reportData,
      source: 'ai',
      metadata: {
        generatedAt: new Date().toISOString(),
        provider: aiTextService.provider,
        generationTime: generationTime
      }
    });

  } catch (error) {
    console.error('❌ 报告生成错误:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

/**
 * 提取关键数据用于前端展示
 */
function extractKeyData(chartData, birthInfo) {
  const seventhHouse = chartData.houses?.find(h => h.number === 7);
  const venusPlanet = chartData.planets?.find(p => p.name === 'Venus');
  const jupiterPlanet = chartData.planets?.find(p => p.name === 'Jupiter');
  const sunPlanet = chartData.planets?.find(p => p.name === 'Sun');
  const moonPlanet = chartData.planets?.find(p => p.name === 'Moon');
  const ascPlanet = chartData.planets?.find(p => p.name === 'Ascendant');
  
  return {
    risingSign: ascPlanet?.sign || chartData.risingSign,
    sunSign: sunPlanet?.sign || chartData.sunSign,
    moonSign: moonPlanet?.sign || chartData.moonSign,
    seventhHouse: {
      sign: seventhHouse?.sign,
      lord: seventhHouse?.lord,
      planets: chartData.planets?.filter(p => p.house === 7).map(p => ({
        name: p.name,
        sign: p.sign
      })) || []
    },
    venus: venusPlanet ? {
      sign: venusPlanet.sign,
      house: venusPlanet.house,
      nakshatra: venusPlanet.nakshatra?.name || venusPlanet.nakshatra
    } : null,
    jupiter: jupiterPlanet ? {
      sign: jupiterPlanet.sign,
      house: jupiterPlanet.house
    } : null
  };
}

/**
 * 生成fallback报告（当AI失败时使用）
 */
function generateFallbackReport(chartData, birthInfo) {
  const keyData = extractKeyData(chartData, birthInfo);
  
  return {
    fullContent: `基于您的星盘数据生成的配偶分析报告。\n\n您的第7宫位于${keyData.seventhHouse?.sign || '未知'}，这预示着您的配偶特质...`,
    sections: {
      introduction: '欢迎您，亲爱的求知者...',
      personality: '基于您的第7宫配置...',
      appearance: '根据金星和星宿的影响...',
      meeting: '第7宫主星的位置暗示...',
      relationship: '您的关系模式...',
      conclusion: '愿您找到理想的伴侣...'
    },
    keyData: keyData,
    metadata: {
      wordCount: 0,
      generatedAt: new Date().toISOString()
    }
  };
}

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 AstroSoul Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;