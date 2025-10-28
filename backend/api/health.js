module.exports = (req, res) => {
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
};
