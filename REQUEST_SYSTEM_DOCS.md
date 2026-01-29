# Advanced Request System - SpareHub

## Overview
The Request System allows customers to broadcast part requests to all relevant shopkeepers in their area. Shopkeepers can view these requests and submit competitive quotes, creating a marketplace dynamic.

## Features Implemented

### 1. Smart Request Form (Customer Side)
**Location:** `frontend/src/components/RequestFormModal.jsx`

**Features:**
- **Part Details Input:**
  - Part Name (e.g., "Front Bumper")
  - Vehicle Model (e.g., "Toyota Innova 2018")
  - Category Selection (Car Parts, Bike Parts, etc.)
  - Condition (New, Used, Reconditioned)
  - Optional Description

- **Reference Photo Upload:**
  - Cloudinary integration for image storage
  - Image preview before submission
  - File validation (type and size)

- **Budget Range:**
  - Minimum and Maximum budget inputs
  - Validation to ensure min ≤ max

- **Location-Based Broadcasting:**
  - Uses customer's saved location
  - Displays broadcasting area before submission

- **Visual Design:**
  - Glassmorphism modal design
  - RGB glow effect on submit button
  - Rounded-3xl inputs matching global design
  - Smooth animations

### 2. Broadcast Logic (Backend)
**Location:** `backend/routes/requests.js`

**How it works:**
1. When a customer submits a request, the system finds all shopkeepers:
   - In the same district/state
   - Who deal in the requested category
   - With verified status

2. The request is saved with:
   - Customer information
   - Part details
   - Budget range
   - Reference photo URL
   - Location data
   - List of notified shopkeepers

3. Returns the count of shopkeepers notified

**API Endpoints:**
- `POST /api/requests` - Create new request
- `GET /api/requests/customer/:customerId` - Get customer's requests
- `GET /api/requests/market/:shopkeeperId` - Get market requests for shopkeeper
- `POST /api/requests/:requestId/offer` - Submit offer
- `PUT /api/requests/:requestId/status` - Update request status
- `DELETE /api/requests/:requestId` - Delete request

### 3. Market Requests Tab (Shopkeeper Side)
**Location:** `frontend/src/components/MarketRequests.jsx`

**Features:**
- **Request Cards Display:**
  - Part name and vehicle model
  - Condition and category
  - Budget range
  - Location
  - Time remaining before expiry
  - Reference photo (if uploaded)

- **Status Indicators:**
  - Color-coded status bars (Pending, Offered, Expired)
  - Time countdown display
  - Visual badges

- **Offer Submission:**
  - Modal form to submit quote
  - Price input
  - Optional part photo upload
  - Optional message
  - Prevents duplicate offers

- **Filtering:**
  - Shows only active requests
  - Hides expired requests
  - Shows requests already responded to

### 4. My Requests Section (Customer Side)
**Location:** `frontend/src/components/MyRequests.jsx`

**Features:**
- **Request Tracking:**
  - All submitted requests
  - Status: Pending, Offers Received, Closed, Expired
  - Time since creation
  - Time remaining

- **Offers Management:**
  - View all received offers
  - Compare prices
  - See shopkeeper details
  - Contact shopkeeper button

- **Actions:**
  - Mark request as "Found" (Close)
  - View detailed offers in modal
  - See reference photo

### 5. Auto-Expiry System
**Location:** `backend/utils/scheduler.js`

**How it works:**
- Cron job runs every hour
- Checks all requests with `expiresAt < current time`
- Updates status to "Expired"
- Prevents database bloat
- Default expiry: 7 days from creation

**MongoDB TTL Index:**
- Automatic document deletion after expiry
- Keeps database clean
- Configurable expiry duration

### 6. Database Schema
**Location:** `backend/models/Request.js`

**Fields:**
```javascript
{
  // Customer Info
  customer: ObjectId (ref: User)
  customerName: String
  customerEmail: String
  customerPhone: String
  
  // Part Details
  partName: String (required)
  vehicleModel: String (required)
  category: String (enum, required)
  condition: String (enum, required)
  description: String
  referencePhoto: String (Cloudinary URL)
  
  // Budget
  budgetMin: Number (required)
  budgetMax: Number (required)
  
  // Location
  location: {
    state: String (required)
    district: String (required)
    area: String
  }
  
  // Status
  status: String (enum: Pending, Offers Received, Closed, Expired)
  
  // Offers from Shopkeepers
  offers: [{
    shopkeeperId: ObjectId
    shopkeeperName: String
    shopName: String
    price: Number
    photo: String
    message: String
    respondedAt: Date
  }]
  
  // Auto-Expiry
  expiresAt: Date (default: 7 days from creation)
  
  // Metadata
  broadcastedTo: [ObjectId] // Shopkeepers notified
  viewedBy: [ObjectId] // Shopkeepers who viewed
  
  timestamps: true
}
```

**Indexes:**
- `expiresAt` - TTL index for auto-deletion
- `location.state, location.district, category` - For efficient broadcast queries

## Integration Points

### Customer Home Page
**Location:** `frontend/src/pages/CustomerHome.jsx`

**Changes:**
1. Added floating Request button (bottom-right)
2. Integrated RequestFormModal
3. Replaced mock requests with MyRequests component
4. Location validation before request submission

### Shop Dashboard
**Location:** `frontend/src/pages/ShopDashboard.jsx`

**Changes:**
1. Added "Market Requests" tab (first tab)
2. Integrated MarketRequests component
3. Shows count of available requests

## Setup Instructions

### Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Ensure MongoDB is running:
   ```bash
   mongod
   ```

3. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. No additional dependencies needed
2. Ensure backend is running on `http://localhost:5000`
3. Frontend should be running on `http://localhost:5173`

### Cloudinary Setup (Required for Photo Uploads)
1. Create a Cloudinary account at https://cloudinary.com
2. Get your Cloud Name
3. Create upload presets:
   - `purzasetu_requests` (for request reference photos)
   - `purzasetu_offers` (for shopkeeper offer photos)
4. Update the following files with your Cloud Name:
   - `frontend/src/components/RequestFormModal.jsx` (line 60, 64)
   - `frontend/src/components/MarketRequests.jsx` (line 53, 57)

## User Flow

### Customer Journey
1. **Create Request:**
   - Click floating Request button
   - Fill in part details
   - Upload reference photo (optional)
   - Set budget range
   - Submit (broadcasts to shopkeepers)

2. **Track Requests:**
   - Go to "Requests" tab
   - See all submitted requests
   - View status and time remaining
   - Check received offers

3. **Review Offers:**
   - Click "View Offers" on request
   - Compare prices and photos
   - Contact shopkeeper
   - Mark as "Found" when done

### Shopkeeper Journey
1. **View Market Requests:**
   - Go to "Market Requests" tab
   - See all requests in their area
   - Filter by category/condition
   - Check time remaining

2. **Submit Offer:**
   - Click "I Have This Part"
   - Enter price
   - Upload part photo (optional)
   - Add message (optional)
   - Submit offer

3. **Track Responses:**
   - See which requests they've responded to
   - Wait for customer contact

## Technical Details

### Real-time Notifications (Future Enhancement)
Currently, the system uses polling. For production, implement:
- Socket.io for real-time updates
- Push notifications for mobile
- Email notifications

### Location Matching Algorithm
Current implementation uses regex matching on address fields. For better accuracy:
- Implement geospatial queries using MongoDB's 2dsphere index
- Use coordinates for distance calculation
- Add radius-based filtering

### Performance Optimizations
- Pagination for large request lists
- Lazy loading of images
- Caching of frequently accessed data
- Database query optimization with proper indexes

## API Response Examples

### Create Request
**Request:**
```json
POST /api/requests
{
  "customer": "user_id",
  "customerName": "John Doe",
  "partName": "Front Bumper",
  "vehicleModel": "Toyota Innova 2018",
  "category": "Car Parts",
  "condition": "New",
  "budgetMin": 5000,
  "budgetMax": 8000,
  "location": {
    "state": "Delhi",
    "district": "South Delhi",
    "area": "Saket"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request broadcasted to 12 shopkeepers in your area",
  "request": { ... },
  "notifiedShopkeepers": 12
}
```

### Submit Offer
**Request:**
```json
POST /api/requests/:requestId/offer
{
  "shopkeeperId": "shop_id",
  "shopkeeperName": "AutoParts Hub",
  "shopName": "AutoParts Hub",
  "price": 6500,
  "photo": "cloudinary_url",
  "message": "Original Toyota part, 1 year warranty"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Offer submitted successfully",
  "request": { ... }
}
```

## Troubleshooting

### Common Issues

1. **Requests not appearing for shopkeepers:**
   - Check if shopkeeper's location matches customer's location
   - Verify shopkeeper's category matches request category
   - Ensure shopkeeper is verified

2. **Photo upload failing:**
   - Verify Cloudinary credentials
   - Check file size (max 5MB)
   - Ensure file is an image type

3. **Expired requests not cleaning up:**
   - Check if cron job is running
   - Verify MongoDB TTL index is created
   - Check server logs for errors

## Future Enhancements

1. **Advanced Matching:**
   - AI-based part matching
   - Compatibility checking
   - Price prediction

2. **Communication:**
   - In-app chat between customer and shopkeeper
   - Negotiation system
   - Rating and reviews

3. **Analytics:**
   - Request fulfillment rate
   - Average response time
   - Popular parts tracking

4. **Notifications:**
   - Email notifications
   - SMS alerts
   - Push notifications

## Security Considerations

1. **Input Validation:**
   - All inputs are validated on backend
   - File upload restrictions
   - SQL injection prevention

2. **Authentication:**
   - Requests tied to authenticated users
   - Shopkeeper verification required

3. **Rate Limiting:**
   - Prevent spam requests
   - Limit offer submissions

## Maintenance

### Regular Tasks
1. Monitor expired request cleanup
2. Check Cloudinary storage usage
3. Review database performance
4. Update indexes as needed

### Logs to Monitor
- Request creation success rate
- Broadcast efficiency
- Offer submission rate
- Expiry cleanup execution

---

**Version:** 1.0.0  
**Last Updated:** January 29, 2026  
**Author:** SpareHub Development Team
