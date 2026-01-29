// Analytics Utility Functions

/**
 * Format large numbers to k/M notation
 * @param {number} count - The number to format
 * @returns {string} Formatted string (e.g., "1.5k", "2.3M")
 */
export const formatCount = (count) => {
  if (!count || count === 0) return '0';

  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
};

/**
 * Check if visitor is unique for a shop (session-based)
 * @param {string} shopId - The shop ID
 * @returns {boolean} True if unique visitor
 */
export const isUniqueVisitor = (shopId) => {
  const key = `visited_shop_${shopId}`;
  const hasVisited = sessionStorage.getItem(key);

  if (!hasVisited) {
    sessionStorage.setItem(key, Date.now().toString());
    return true;
  }
  return false;
};

/**
 * Check if product view is unique (session-based)
 * @param {string} productId - The product ID
 * @returns {boolean} True if unique view
 */
export const isUniqueProductView = (productId) => {
  const key = `viewed_product_${productId}`;
  const hasViewed = sessionStorage.getItem(key);

  if (!hasViewed) {
    sessionStorage.setItem(key, Date.now().toString());
    return true;
  }
  return false;
};

/**
 * Filter analytics data by time range
 * @param {Array} history - Array of timestamps
 * @param {string} timeRange - 'today', 'week', or 'month'
 * @returns {Array} Filtered data
 */
export const filterByTimeRange = (history, timeRange) => {
  if (!history || !Array.isArray(history)) return [];

  const now = new Date();
  let startDate;

  switch (timeRange) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    default:
      return history;
  }

  return history.filter(timestamp => new Date(timestamp) >= startDate);
};

/**
 * Generate chart data from visit history
 * @param {Array} history - Array of timestamps
 * @param {string} timeRange - 'today', 'week', or 'month'
 * @returns {Array} Chart data points
 */
export const generateChartData = (history, timeRange) => {
  const filtered = filterByTimeRange(history, timeRange);

  // Group by date
  const grouped = {};
  filtered.forEach(timestamp => {
    const date = new Date(timestamp).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + 1;
  });

  // Convert to chart format
  return Object.entries(grouped).map(([date, count]) => ({
    date,
    visits: count
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Debounce function to prevent spam
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 1000) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
