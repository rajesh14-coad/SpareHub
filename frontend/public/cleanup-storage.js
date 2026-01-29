// Production Data Cleanup Script
// Run this in browser console to clear all test data

console.log('🧹 Starting PurzaSetu Production Cleanup...\n');

// List all localStorage keys to remove
const keysToRemove = [
  'purzasetu-user',
  'purzasetu-guest',
  'purzasetu-products',
  'purzasetu-requests',
  'purzasetu-completed-orders',
  'purzasetu-ratings',
  'purzasetu-notifications',
  'purzasetu-all-users',
  'purzasetu-pending-shopkeepers',
  'purzasetu-reports',
  'purzasetu-registration-open',
  'purzasetu-favorites'
];

let removedCount = 0;

keysToRemove.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`✅ Removed: ${key}`);
    removedCount++;
  }
});

// Clear sessionStorage as well
sessionStorage.clear();
console.log('✅ Cleared sessionStorage');

console.log(`\n✨ Cleanup Complete!`);
console.log(`📊 Removed ${removedCount} localStorage items`);
console.log(`🚀 PurzaSetu is now ready for production!`);
console.log(`\n⚠️  Please refresh the page to see the clean state.`);
