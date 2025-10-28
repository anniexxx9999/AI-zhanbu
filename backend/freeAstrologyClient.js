const axios = require('axios');

class FreeAstrologyClient {
  constructor() {
    this.baseURL = 'https://json.freeastrologyapi.com';
    this.apiKey = process.env.FREE_ASTROLOGY_API_KEY;
    
    if (!this.apiKey) {
      console.warn('FREE_ASTROLOGY_API_KEY not found in environment variables');
    }
  }

  // 转换出生信息为API格式
  convertBirthInfo(birthInfo) {
    const { name, date, time, city, latitude, longitude, timezone } = birthInfo;
    
    return {
      name: name || 'Unknown',
      date: date || '1993-11-20',
      time: time || '14:30',
      city: city || 'Beijing',
      latitude: latitude || 39.9042,
      longitude: longitude || 116.4074,
      timezone: timezone || 'Asia/Shanghai'
    };
  }

  // 获取基本占星图表信息
  async getBasicChartInfo(birthData) {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'API key not configured',
          data: null
        };
      }

      const response = await axios.post(`${this.baseURL}/planets/extended`, {
        year: parseInt(birthData.date.split('-')[0]),
        month: parseInt(birthData.date.split('-')[1]),
        day: parseInt(birthData.date.split('-')[2]),
        hour: parseInt(birthData.time.split(':')[0]),
        minute: parseInt(birthData.time.split(':')[1]),
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Free Astrology API error:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // 获取Navamsa图表信息
  async getNavamsaChartInfo(birthData) {
    try {
      if (!this.apiKey) {
        return {
          success: false,
          error: 'API key not configured',
          data: null
        };
      }

      const response = await axios.post(`${this.baseURL}/navamsa-chart-info`, {
        year: parseInt(birthData.date.split('-')[0]),
        month: parseInt(birthData.date.split('-')[1]),
        day: parseInt(birthData.date.split('-')[2]),
        hour: parseInt(birthData.time.split(':')[0]),
        minute: parseInt(birthData.time.split(':')[1]),
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Free Astrology API Navamsa error:', error.message);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
}

module.exports = FreeAstrologyClient;