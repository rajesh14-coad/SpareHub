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
mongoose.connect("mongodb://localhost:27017/purzasetu", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Routes
const authRoute = require('./routes/auth');
const productRoute = require('./routes/products');

app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);

app.get('/', (req, res) => {
  res.send('PurzaSetu API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
