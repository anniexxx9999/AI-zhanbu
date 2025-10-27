const axios = require('axios');

class FreeAstrologyClient {
  constructor() {
    this.baseURL = 'https://json.freeastrologyapi.com';
    this.apiKey = process.env.FREE_ASTROLOGY_API_KEY || 'YOUR_API_KEY_HERE';
  }

  async getNavamsaChartInfo(birthData) {
    try {
      const response = await axios.post(`${this.baseURL}/navamsa-chart-info`, {
        year: birthData.year,
        month: birthData.month,
        date: birthData.date,
        hours: birthData.hours,
        minutes: birthData.minutes,
        seconds: birthData.seconds || 0,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
        config: {
          observation_point: "topocentric",
          ayanamsha: "lahiri"
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Free Astrology API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  async getBasicChartInfo(birthData) {
    try {
      const response = await axios.post(`${this.baseURL}/planets/extended`, {
        year: birthData.year,
        month: birthData.month,
        date: birthData.date,
        hours: birthData.hours,
        minutes: birthData.minutes,
        seconds: birthData.seconds || 0,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
        config: {
          observation_point: "topocentric",
          ayanamsha: "lahiri",
          language: "en"
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Free Astrology API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  async getPlanetPositions(birthData) {
    try {
      const response = await axios.post(`${this.baseURL}/planet-positions`, {
        year: birthData.year,
        month: birthData.month,
        date: birthData.date,
        hours: birthData.hours,
        minutes: birthData.minutes,
        seconds: birthData.seconds || 0,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
        config: {
          observation_point: "topocentric",
          ayanamsha: "lahiri"
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Free Astrology API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status
      };
    }
  }

  // 转换出生信息格式
  convertBirthInfo(birthInfo) {
    const birthDate = new Date(birthInfo.date);
    const [hours, minutes] = birthInfo.time.split(':').map(Number);
    
    const timezone =
      typeof birthInfo.timezone === 'number'
        ? birthInfo.timezone
        : typeof birthInfo.timezone === 'string'
          ? parseFloat(birthInfo.timezone)
          : 8.0;

    return {
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      date: birthDate.getDate(),
      hours: hours,
      minutes: minutes,
      seconds: typeof birthInfo.seconds === 'number' ? birthInfo.seconds : 0,
      latitude: birthInfo.latitude || 39.9042,
      longitude: birthInfo.longitude || 116.4074,
      timezone: Number.isFinite(timezone) ? timezone : 8.0 // 默认中国时区
    };
  }
}

module.exports = FreeAstrologyClient;
