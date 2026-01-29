# Cloudinary Setup Guide for SpareHub Request System

## Quick Setup (5 minutes)

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Verify your email

### Step 2: Get Your Cloud Name
1. Log in to Cloudinary Dashboard
2. You'll see your **Cloud Name** at the top
3. Copy it (e.g., `dxyz123abc`)

### Step 3: Create Upload Presets

#### For Request Reference Photos:
1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name:** `purzasetu_requests`
   - **Signing Mode:** Unsigned
   - **Folder:** `sparehub/requests` (optional)
   - **Upload Manipulations:**
     - Max image width: 1920
     - Max image height: 1920
     - Quality: Auto
5. Click **Save**

#### For Shopkeeper Offer Photos:
1. Click **Add upload preset** again
2. Set the following:
   - **Preset name:** `purzasetu_offers`
   - **Signing Mode:** Unsigned
   - **Folder:** `sparehub/offers` (optional)
   - **Upload Manipulations:**
     - Max image width: 1920
     - Max image height: 1920
     - Quality: Auto
3. Click **Save**

### Step 4: Update Frontend Code

#### File 1: RequestFormModal.jsx
**Location:** `frontend/src/components/RequestFormModal.jsx`

Find these lines (around line 60-64):
```javascript
formData.append('upload_preset', 'purzasetu_requests'); // You need to create this preset in Cloudinary
formData.append('cloud_name', 'YOUR_CLOUD_NAME'); // Replace with your Cloudinary cloud name

// Upload to Cloudinary
const response = await fetch(
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', // Replace YOUR_CLOUD_NAME
```

Replace `YOUR_CLOUD_NAME` with your actual cloud name:
```javascript
formData.append('upload_preset', 'purzasetu_requests');
formData.append('cloud_name', 'dxyz123abc'); // Your cloud name here

const response = await fetch(
  'https://api.cloudinary.com/v1_1/dxyz123abc/image/upload', // Your cloud name here
```

#### File 2: MarketRequests.jsx
**Location:** `frontend/src/components/MarketRequests.jsx`

Find these lines (around line 53-57):
```javascript
formData.append('upload_preset', 'purzasetu_offers');
formData.append('cloud_name', 'YOUR_CLOUD_NAME');

const response = await fetch(
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload',
```

Replace `YOUR_CLOUD_NAME`:
```javascript
formData.append('upload_preset', 'purzasetu_offers');
formData.append('cloud_name', 'dxyz123abc'); // Your cloud name here

const response = await fetch(
  'https://api.cloudinary.com/v1_1/dxyz123abc/image/upload', // Your cloud name here
```

### Step 5: Test the Upload

1. Start your frontend: `npm run dev`
2. Click the Request button
3. Try uploading a test image
4. Check your Cloudinary Media Library to see if it uploaded

## Environment Variables (Recommended for Production)

Instead of hardcoding, use environment variables:

### Create .env file in frontend:
```env
VITE_CLOUDINARY_CLOUD_NAME=dxyz123abc
VITE_CLOUDINARY_REQUEST_PRESET=purzasetu_requests
VITE_CLOUDINARY_OFFER_PRESET=purzasetu_offers
```

### Update the code to use env variables:
```javascript
formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_REQUEST_PRESET);
formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

const response = await fetch(
  `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
```

## Troubleshooting

### Upload fails with 401 Unauthorized
- Check if upload preset is set to **Unsigned**
- Verify the preset name matches exactly

### Upload fails with 400 Bad Request
- Check if cloud name is correct
- Verify the upload URL is correct

### Images not appearing
- Check browser console for errors
- Verify the returned `secure_url` is valid
- Check Cloudinary Media Library

## Free Tier Limits
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25,000/month

This is more than enough for development and small-scale production!

## Security Best Practices

1. **Use Upload Presets:** Never expose API keys in frontend
2. **Set File Size Limits:** Prevent abuse
3. **Enable Moderation:** Auto-detect inappropriate content
4. **Set Allowed Formats:** Only allow images

## Advanced Configuration (Optional)

### Enable Auto-Moderation:
1. Go to **Settings** → **Security**
2. Enable **Moderation**
3. Set moderation type to **Manual** or **Auto**

### Set Transformation Defaults:
1. In upload preset settings
2. Add transformations:
   - Format: Auto
   - Quality: Auto
   - Fetch Format: Auto

### Enable Backup:
1. Go to **Settings** → **Upload**
2. Enable **Backup**
3. Set backup location

---

**Need Help?**
- Cloudinary Docs: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com
