# Quick Start Guide: Request Feature

## 🚀 Getting Started in 3 Minutes

### Prerequisites
- ✅ Backend running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:5173`
- ✅ MongoDB running locally
- ⚠️ Cloudinary configured (see CLOUDINARY_SETUP.md)

---

## For Customers: How to Request a Part

### Step 1: Open the App
1. Navigate to Customer Home page
2. Make sure you're logged in (not as guest)

### Step 2: Set Your Location
1. Click the location button (top-right)
2. Select your State, District, and Area
3. Click "Confirm"

### Step 3: Create a Request
1. Click the **floating Request button** (bottom-right, purple with ⚡ icon)
2. Fill in the form:
   - **Part Name:** e.g., "Front Bumper"
   - **Vehicle Model:** e.g., "Toyota Innova 2018"
   - **Category:** Select from dropdown
   - **Condition:** New, Used, or Reconditioned
   - **Description:** (Optional) Add details
   - **Reference Photo:** (Optional) Upload image
   - **Budget Range:** Set min and max price
3. Click **"Submit Request"**

### Step 4: Track Your Request
1. Go to **"Requests"** tab
2. See all your requests with status:
   - 🟡 **Pending** - Waiting for offers
   - 🔵 **Offers Received** - Shopkeepers responded
   - 🟢 **Closed** - Part found
   - 🔴 **Expired** - 7 days passed

### Step 5: View Offers
1. Click **"View Offers"** on any request
2. Compare prices and photos
3. Click **"Contact Shopkeeper"** to proceed
4. Mark as **"Found"** when done

---

## For Shopkeepers: How to Respond to Requests

### Step 1: Open Shop Dashboard
1. Navigate to Shop Dashboard
2. Make sure you're logged in as shopkeeper

### Step 2: View Market Requests
1. Click **"Market Requests"** tab (first tab)
2. See all requests in your area
3. Check:
   - Part details
   - Budget range
   - Time remaining
   - Reference photo

### Step 3: Submit an Offer
1. Click **"I Have This Part"** on any request
2. Fill in the offer form:
   - **Your Price:** Enter competitive price
   - **Part Photo:** (Optional) Upload image
   - **Message:** (Optional) Add details
3. Click **"Submit Offer"**

### Step 4: Track Your Offers
1. Requests you've responded to show **"Offer Submitted"**
2. Wait for customer to contact you
3. Check the "Requests" tab for direct customer requests

---

## 🎯 Quick Tips

### For Customers
- 📸 **Upload a photo** - Helps shopkeepers understand exactly what you need
- 💰 **Set realistic budget** - Too low might not get responses
- 📍 **Set accurate location** - Gets you local shopkeepers
- ⏰ **Act fast** - Requests expire in 7 days
- 👀 **Check offers daily** - New offers come in continuously

### For Shopkeepers
- ⚡ **Respond quickly** - First offers get noticed
- 📸 **Include photos** - Builds trust
- 💬 **Add details** - Warranty, condition, brand
- 💰 **Price competitively** - Customers compare offers
- 🔔 **Check daily** - New requests appear constantly

---

## 🎨 Visual Guide

### Customer Request Button
Look for the **purple floating button** with a lightning bolt (⚡) icon at the bottom-right of the screen.

### Request Status Colors
- **Yellow bar** = Pending
- **Blue bar** = Offers Received
- **Green bar** = Closed
- **Red bar** = Expired

### Shopkeeper Request Cards
- **Green badge** = You already offered
- **Blue badge** = New request
- **Red badge** = Expired

---

## ⚠️ Common Issues

### "Please set your location first"
**Solution:** Click the location button (top-right) and select your area.

### Photo upload fails
**Solution:** 
1. Check file size (max 5MB)
2. Ensure it's an image file
3. Verify Cloudinary is configured (see CLOUDINARY_SETUP.md)

### No requests showing for shopkeepers
**Solution:**
1. Verify your shop location is set
2. Check if your category matches customer requests
3. Ensure your shop is verified

### Request disappeared
**Solution:** Requests expire after 7 days. Check the "Expired" status.

---

## 📊 Understanding the System

### Broadcast Logic
When you create a request, it's sent to:
- ✅ Shopkeepers in your district/state
- ✅ Who deal in your selected category
- ✅ Who are verified on the platform

### Auto-Expiry
- Requests automatically expire after **7 days**
- Expired requests can't receive new offers
- Helps keep the marketplace fresh

### Offer System
- Multiple shopkeepers can offer on one request
- Customers see all offers and choose
- Shopkeepers can't see other offers (fair competition)

---

## 🔥 Pro Tips

### Maximize Responses (Customers)
1. Upload a clear reference photo
2. Be specific in description
3. Set reasonable budget range
4. Choose correct category
5. Set accurate location

### Win More Customers (Shopkeepers)
1. Respond within 24 hours
2. Upload actual part photos
3. Include warranty/guarantee info
4. Price competitively
5. Add helpful messages

---

## 📱 Mobile Experience
- Floating button positioned for thumb access
- Responsive forms
- Touch-optimized buttons
- Smooth animations

---

## 🆘 Need Help?

### Documentation
- **Full Docs:** See `REQUEST_SYSTEM_DOCS.md`
- **Cloudinary Setup:** See `CLOUDINARY_SETUP.md`
- **Implementation:** See `IMPLEMENTATION_SUMMARY.md`

### Support
- Check console for errors
- Review backend logs
- Verify MongoDB connection
- Test API endpoints

---

## ✅ Quick Checklist

### Before First Use
- [ ] Backend server running
- [ ] Frontend server running
- [ ] MongoDB connected
- [ ] Cloudinary configured
- [ ] Location set
- [ ] Logged in (not guest)

### Testing the Feature
- [ ] Create a test request
- [ ] Upload a photo
- [ ] Check "My Requests"
- [ ] Submit an offer (as shopkeeper)
- [ ] View offers (as customer)
- [ ] Mark as found

---

## 🎉 You're Ready!

The Request system is now fully operational. Start creating requests or responding to them!

**Happy Trading! 🚀**

---

**Last Updated:** January 29, 2026  
**Version:** 1.0.0
