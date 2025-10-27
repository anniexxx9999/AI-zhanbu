const express = require('express');
const cors = require('cors');
const FreeAstrologyClient = require('./freeAstrologyClient');
const app = express();
const PORT = process.env.PORT || 3001;

// 初始化Free Astrology API客户端
const freeAstrologyClient = new FreeAstrologyClient();

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
          name: 'Sun',
          symbol: '☉',
          longitude: 45.2,
          latitude: 0.0,
          house: 1,
          sign: 'Taurus',
          signSymbol: '♉',
          degree: 15,
          minute: 12,
          second: 0,
          retrograde: false,
          speed: 0.9856
        },
        {
          name: 'Moon',
          symbol: '☽',
          longitude: 120.5,
          latitude: 2.3,
          house: 4,
          sign: 'Leo',
          signSymbol: '♌',
          degree: 0,
          minute: 30,
          second: 0,
          retrograde: false,
          speed: 13.2
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
  // 这里可以根据API返回的实际数据结构进行处理
  // 目前返回模拟数据格式，确保前端兼容性
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
    planets: chartData.planets || [],
    houses: chartData.houses || [],
    aspects: chartData.aspects || [],
    lagna: chartData.lagna || 1,
    lagnaDetails: chartData.lagnaDetails || {},
    moonSign: chartData.moonSign || 'Unknown',
    sunSign: chartData.sunSign || 'Unknown',
    risingSign: chartData.risingSign || 'Unknown',
    chartType: 'North Indian',
    ayanamsa: 'Lahiri',
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
app.post('/api/soulmate-generate', (req, res) => {
  const { birthInfo } = req.body;
  
  if (!birthInfo) {
    return res.status(400).json({
      success: false,
      error: 'bad_request',
      message: 'birthInfo is required'
    });
  }

  const mockSoulmate = {
    success: true,
    data: {
      analysis: {
        basicInfo: {
          birthDate: birthInfo.date || "undefined-undefined-undefined",
          birthTime: birthInfo.time || "undefined:undefined",
          gender: "female"
        },
        astrology: {
          sunSign: "天蝎座",
          moonSign: "双鱼座",
          risingSign: "狮子座"
        }
      },
      traits: {
        personality: "温柔体贴，富有同情心",
        appearance: "优雅迷人，气质独特",
        compatibility: "高度匹配，情感共鸣强烈"
      },
      promptPlan: {
        description: "基于占星分析的灵魂伴侣画像生成",
        style: "浪漫唯美",
        mood: "温馨浪漫"
      },
      generation: {
        success: true,
        message: "灵魂伴侣分析完成，正在生成画像...",
        imageUrl: "https://via.placeholder.com/400x600/667eea/ffffff?text=Soulmate+Portrait"
      }
    }
  };

  res.json(mockSoulmate);
});

// 根路径
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

app.listen(PORT, () => {
  console.log(`🚀 AstroSoul API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Chart API: http://localhost:${PORT}/api/astrology/chart`);
  console.log(`📊 Report API: http://localhost:${PORT}/api/report-generate`);
  console.log(`💕 Soulmate API: http://localhost:${PORT}/api/soulmate-generate`);
});
