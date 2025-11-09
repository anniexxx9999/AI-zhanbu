const axios = require('axios');

class FreeAstrologyClient {
  constructor() {
    this.baseURL = 'https://json.freeastrologyapi.com';
    this.apiKey = process.env.FREE_ASTROLOGY_API_KEY;
    
    if (!this.apiKey) {
      console.warn('FREE_ASTROLOGY_API_KEY not found in environment variables');
    }
  }

  // 转换timezone字符串为数字偏移量
  convertTimezoneToOffset(timezone) {
    // 常见时区的偏移量映射
    const timezoneMap = {
      'Asia/Shanghai': 8.0,
      'Asia/Kolkata': 5.5,
      'Asia/Dubai': 4.0,
      'Asia/Tokyo': 9.0,
      'America/New_York': -5.0,
      'America/Los_Angeles': -8.0,
      'Europe/London': 0.0,
      'Europe/Paris': 1.0,
      'Australia/Sydney': 10.0
    };

    if (timezoneMap[timezone]) {
      return timezoneMap[timezone];
    }

    // 如果timezone已经是数字字符串，直接转换
    const numTimezone = parseFloat(timezone);
    if (!isNaN(numTimezone)) {
      return numTimezone;
    }

    // 默认返回UTC+8（北京时间）
    console.warn(`Unknown timezone: ${timezone}, using default 8.0`);
    return 8.0;
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

      // 解析日期和时间
      const dateParts = birthData.date.split('-');
      const timeParts = birthData.time.split(':');
      
      // 转换timezone字符串为数字（例如 "Asia/Kolkata" -> 5.5）
      const timezoneOffset = this.convertTimezoneToOffset(birthData.timezone);

      const requestPayload = {
        year: parseInt(dateParts[0]),
        month: parseInt(dateParts[1]),
        date: parseInt(dateParts[2]),
        hours: parseInt(timeParts[0]) || 0,
        minutes: parseInt(timeParts[1]) || 0,
        seconds: parseInt(timeParts[2]) || 0,
        latitude: birthData.latitude || 39.9042,
        longitude: birthData.longitude || 116.4074,
        timezone: timezoneOffset,
        settings: {
          observation_point: 'topocentric',
          ayanamsha: 'lahiri',
          language: 'en'
        }
      };

      const response = await axios.post(`${this.baseURL}/planets/extended`, requestPayload, {
        headers: {
          'x-api-key': this.apiKey,
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

      // 解析日期和时间
      const dateParts = birthData.date.split('-');
      const timeParts = birthData.time.split(':');
      const timezoneOffset = this.convertTimezoneToOffset(birthData.timezone);

      const requestPayload = {
        year: parseInt(dateParts[0]),
        month: parseInt(dateParts[1]),
        date: parseInt(dateParts[2]),
        hours: parseInt(timeParts[0]) || 0,
        minutes: parseInt(timeParts[1]) || 0,
        seconds: parseInt(timeParts[2]) || 0,
        latitude: birthData.latitude || 39.9042,
        longitude: birthData.longitude || 116.4074,
        timezone: timezoneOffset,
        settings: {
          observation_point: 'topocentric',
          ayanamsha: 'lahiri',
          language: 'en'
        }
      };

      const response = await axios.post(`${this.baseURL}/navamsa-chart-info`, requestPayload, {
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      // API返回的数据结构是 { statusCode: 200, output: {...} }
      if (response.data && response.data.output) {
        return {
          success: true,
          data: response.data.output
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Free Astrology API Navamsa error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data).substring(0, 200));
      }
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }
}

module.exports = FreeAstrologyClient;