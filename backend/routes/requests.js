const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');

// @route   POST /api/requests
// @desc    Create a new request (broadcasts to relevant shopkeepers)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      customerName,
      customerEmail,
      customerPhone,
      partName,
      vehicleModel,
      category,
      condition,
      description,
      referencePhoto,
      budgetMin,
      budgetMax,
      location
    } = req.body;

    // Validate required fields
    if (!partName || !vehicleModel || !category || !condition || !budgetMin || !budgetMax || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Since users are stored in localStorage (not MongoDB), we'll skip the shopkeeper query
    // The frontend will handle broadcasting logic
    const shopkeeperIds = []; // Empty for now, can be populated by frontend if needed

    // Create the request
    const newRequest = new Request({
      customer,
      customerName,
      customerEmail,
      customerPhone,
      partName,
      vehicleModel,
      category,
      condition,
      description,
      referencePhoto,
      budgetMin,
      budgetMax,
      location,
      broadcastedTo: shopkeeperIds,
      status: 'Pending'
    });

    await newRequest.save();

    // TODO: Send real-time notifications to shopkeepers (Socket.io or Push Notifications)
    // For now, we'll return the count of notified shopkeepers

    res.status(201).json({
      success: true,
      message: `Request created successfully`,
      request: newRequest,
      notifiedShopkeepers: shopkeeperIds.length
    });

  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/requests/customer/:customerId
// @desc    Get all requests for a specific customer
// @access  Public
router.get('/customer/:customerId', async (req, res) => {
  try {
    const requests = await Request.find({ customer: req.params.customerId })
      .sort({ createdAt: -1 })
      .populate('offers.shopkeeperId', 'name email shopDetails');

    // Mark expired requests
    await Request.markExpiredRequests();

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching customer requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/requests/market/:shopkeeperId
// @desc    Get all market requests for a shopkeeper (broadcasted to them)
// @access  Public
router.get('/market/:shopkeeperId', async (req, res) => {
  try {
    const requests = await Request.find({
      broadcastedTo: req.params.shopkeeperId,
      status: { $in: ['Pending', 'Offers Received'] }
    })
      .sort({ createdAt: -1 })
      .populate('customer', 'name email phone');

    // Mark expired requests
    await Request.markExpiredRequests();

    res.json({ success: true, requests });
  } catch (error) {
    console.error('Error fetching market requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/requests/:requestId/offer
// @desc    Shopkeeper submits a quote/offer for a request
// @access  Public
router.post('/:requestId/offer', async (req, res) => {
  try {
    const { shopkeeperId, shopkeeperName, shopName, price, photo, message } = req.body;

    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status === 'Expired' || request.status === 'Closed') {
      return res.status(400).json({ message: 'This request is no longer active' });
    }

    // Check if shopkeeper already submitted an offer
    const existingOffer = request.offers.find(
      offer => offer.shopkeeperId.toString() === shopkeeperId
    );

    if (existingOffer) {
      return res.status(400).json({ message: 'You have already submitted an offer for this request' });
    }

    // Add the offer
    request.offers.push({
      shopkeeperId,
      shopkeeperName,
      shopName,
      price,
      photo,
      message,
      respondedAt: new Date()
    });

    // Update status to 'Offers Received'
    request.status = 'Offers Received';

    // Add shopkeeper to viewedBy if not already there
    if (!request.viewedBy.includes(shopkeeperId)) {
      request.viewedBy.push(shopkeeperId);
    }

    await request.save();

    res.json({
      success: true,
      message: 'Offer submitted successfully',
      request
    });

  } catch (error) {
    console.error('Error submitting offer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/requests/:requestId/status
// @desc    Update request status (Close, etc.)
// @access  Public
router.put('/:requestId/status', async (req, res) => {
  try {
    const { status } = req.body;

    const request = await Request.findByIdAndUpdate(
      req.params.requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ success: true, request });

  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/requests/:requestId
// @desc    Delete a request
// @access  Public
router.delete('/:requestId', async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ success: true, message: 'Request deleted successfully' });

  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/requests/cleanup/expired
// @desc    Cleanup expired requests (can be called by a cron job)
// @access  Public
router.get('/cleanup/expired', async (req, res) => {
  try {
    await Request.markExpiredRequests();
    res.json({ success: true, message: 'Expired requests marked' });
  } catch (error) {
    console.error('Error cleaning up expired requests:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
