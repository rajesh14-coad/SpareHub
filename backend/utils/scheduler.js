const cron = require('node-cron');
const Request = require('../models/Request');

// Run every hour to mark expired requests
const scheduleRequestCleanup = () => {
  // Cron expression: '0 * * * *' means run at minute 0 of every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🔄 Running request expiry cleanup...');
      await Request.markExpiredRequests();
      console.log('✅ Request cleanup completed');
    } catch (error) {
      console.error('❌ Error during request cleanup:', error);
    }
  });

  console.log('⏰ Request cleanup scheduler initialized (runs every hour)');
};

module.exports = { scheduleRequestCleanup };
