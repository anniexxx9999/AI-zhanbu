// backend/api/health.js
require('dotenv').config();

module.exports = (req, res) => {
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
};
