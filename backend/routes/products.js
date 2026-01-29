const router = require('express').Router();
const Product = require('../models/Product');
const Shopkeeper = require('../models/Shopkeeper');

// CREATE PRODUCT
router.post('/', async (req, res) => {
  try {
    const { name, description, price, condition, category, images, ownerId, shopId } = req.body;

    // Validate that the request contains shopId/ownerId
    if (!ownerId) return res.status(400).json({ message: "Owner ID required" });

    const newProduct = new Product({
      name, description, price, condition, category, images, ownerId, shopId
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL PRODUCTS (Customer View - Only Verified & Available)
router.get('/', async (req, res) => {
  try {
    // 1. Find all verified shopkeepers
    const verifiedShops = await Shopkeeper.find({ isVerified: true }).select('_id userId');
    const verifiedUserIds = verifiedShops.map(s => s.userId);

    // 2. Find products belonging to these users
    // Note: If product has shopId, we can check that too. 
    // For now, filtering by ownerId being in the list of verified shopkeepers users, OR if the seller is just a trusted user.
    // The requirement: "Customer searches, they see products from ALL verified shopkeepers."

    // Filter clause:
    // a. Product must be available
    // b. Product owner must be a verified shopkeeper (OR product has shopId that is verified)
    const verifiedShopIds = verifiedShops.map(s => s._id);

    const products = await Product.find({
      isAvailable: true,
      $or: [
        { shopId: { $in: verifiedShopIds } },
        // Also allow products if we linked per user, but shopId is cleaner
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET SELLER PRODUCTS (Shopkeeper Dashboard View - Only Theirs)
router.get('/my/:userId', async (req, res) => {
  try {
    const products = await Product.find({ ownerId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE PRODUCT
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
