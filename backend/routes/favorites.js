const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// @route   GET /api/favorites/:userId
// @desc    Get all favorites for a user
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId })
      .sort({ addedAt: -1 });

    const productIds = favorites.map(fav => fav.productId);

    res.json({
      success: true,
      favorites: productIds
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/favorites/toggle
// @desc    Toggle favorite (add or remove)
// @access  Public
router.post('/toggle', async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId or productId'
      });
    }

    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({ userId, productId });

    if (existingFavorite) {
      // Remove from favorites
      await Favorite.deleteOne({ userId, productId });
      return res.json({
        success: true,
        action: 'removed',
        message: 'Removed from favorites'
      });
    } else {
      // Add to favorites
      const newFavorite = new Favorite({ userId, productId });
      await newFavorite.save();
      return res.json({
        success: true,
        action: 'added',
        message: 'Added to favorites'
      });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/favorites/:userId/:productId
// @desc    Remove a specific favorite
// @access  Public
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await Favorite.deleteOne({ userId, productId: parseInt(productId) });

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
