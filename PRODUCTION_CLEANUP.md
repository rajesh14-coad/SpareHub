# Production Data Cleanup Guide

## 🧹 Complete Data Wipe Instructions

Follow these steps to ensure 100% clean environment for production launch.

---

## Step 1: Clear Browser Storage

### Option A: Using Browser Console (Recommended)
1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Copy and paste the cleanup script from `public/cleanup-storage.js`
4. Press Enter to execute
5. Refresh the page (Ctrl+R or Cmd+R)

### Option B: Manual Cleanup
1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click on **Local Storage** → `http://localhost:5173`
4. Click "Clear All" or delete each key individually
5. Click on **Session Storage** and clear it as well
6. Refresh the page

---

## Step 2: Verify Clean State

After clearing storage, verify the following:

### ✅ Admin Panel
- Shows **0 Users**
- Shows **0 Products**
- Shows **0 Requests**
- No dummy charts or fake stats

### ✅ Customer Home
- Shows "No products available yet" empty state
- No test products visible

### ✅ Shopkeeper Dashboard
- Shows "Add your first product" prompt
- Inventory is empty
- Business Insights shows empty graphs

### ✅ Chat/Messages
- No conversations visible
- Shows "No messages" empty state

### ✅ Notifications
- No notifications visible
- Notification badge shows 0

---

## Step 3: Test Fresh User Flow

1. **Logout** if currently logged in
2. **Sign up** as a new customer
3. Verify you see a completely fresh interface
4. **Sign up** as a new shopkeeper
5. Verify dashboard is empty with "Add Product" prompts

---

## Step 4: Production Environment Check

Ensure the following production flags are set:

```bash
# Backend .env
NODE_ENV=production
```

### Remove any testing/demo badges:
- No "Testing" or "Demo" labels in UI
- No development-only features visible

---

## Automated Cleanup (Optional)

If you want to automate the cleanup process, you can add this to your app initialization:

```javascript
// Only run in development or when explicitly triggered
if (window.location.search.includes('cleanup=true')) {
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
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  sessionStorage.clear();
  
  alert('✅ All data cleared! Refresh the page.');
}
```

Then visit: `http://localhost:5173/?cleanup=true`

---

## Final Verification Checklist

- [ ] Browser localStorage is empty
- [ ] Browser sessionStorage is empty
- [ ] Admin Panel shows 0 users/products
- [ ] Customer Home shows empty state
- [ ] Shopkeeper Dashboard shows empty state
- [ ] No dummy conversations in Chat
- [ ] No test notifications
- [ ] Business Insights shows empty graphs
- [ ] New user signup works correctly
- [ ] Fresh interface with no leftover data

---

## 🚀 Ready for Production!

Once all checks pass, your PurzaSetu instance is 100% clean and ready for real customers!
