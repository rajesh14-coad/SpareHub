# Database Cleanup Scripts

## cleanup-database.js

**⚠️ WARNING: This script will DELETE ALL DATA from the database!**

### Purpose
Removes all test/dummy data and resets the database to a clean state for production launch.

### What it does
- Deletes all users (test accounts)
- Removes all products
- Clears all requests
- Resets analytics counters
- Removes all notifications

### Usage

```bash
# Run from backend directory
node scripts/cleanup-database.js
```

### Safety
- 5-second countdown before execution
- Press Ctrl+C to cancel during countdown
- Logs all actions for verification

### After Running
The database will be completely empty and ready for real users to sign up and add products.
