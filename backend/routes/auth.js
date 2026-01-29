const router = require('express').Router();
const User = require('../models/User');
const Shopkeeper = require('../models/Shopkeeper');
const bcrypt = require('bcryptjs');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, shopDetails } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Create User
    const newUser = new User({
      name,
      email,
      password, // Pre-save hook will hash this
      role
    });

    const savedUser = await newUser.save();

    // If Shopkeeper, create Shopkeeper Profile
    if (role === 'shopkeeper' && shopDetails) {
      const newShopkeeper = new Shopkeeper({
        userId: savedUser._id,
        shopName: shopDetails.shopName,
        shopType: shopDetails.shopType,
        address: shopDetails.address,
        isVerified: false // Default to false
      });
      await newShopkeeper.save();
    }

    res.status(201).json({ user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // If Shopkeeper, fecth verification status
    let extraData = {};
    if (user.role === 'shopkeeper') {
      const shop = await Shopkeeper.findOne({ userId: user._id });
      if (shop) {
        extraData = { isVerified: shop.isVerified, shopId: shop._id };
      }
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...extraData
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
