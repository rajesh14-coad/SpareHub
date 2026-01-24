const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect("mongodb://localhost:27017/sparehub", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Routes (Placeholder)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');
const Request = require('./models/Request');

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
