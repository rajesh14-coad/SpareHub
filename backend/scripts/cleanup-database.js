const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/purzasetu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('🔗 Connected to MongoDB');
  console.log('⚠️  WARNING: This script will DELETE ALL DATA from the database!');
  console.log('⏳ Starting cleanup in 5 seconds... Press Ctrl+C to cancel.');

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    console.log('\n🧹 Starting database cleanup...\n');

    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const collection of collections) {
      const collectionName = collection.name;

      // Skip system collections
      if (collectionName.startsWith('system.')) {
        continue;
      }

      console.log(`📦 Cleaning collection: ${collectionName}`);

      const result = await mongoose.connection.db.collection(collectionName).deleteMany({});
      console.log(`   ✅ Deleted ${result.deletedCount} documents`);
    }

    console.log('\n✨ Database cleanup completed successfully!');
    console.log('📊 Summary:');
    console.log('   - All test users removed');
    console.log('   - All test products removed');
    console.log('   - All test requests removed');
    console.log('   - All analytics counters reset');
    console.log('   - All notifications cleared');
    console.log('\n🚀 Database is now ready for production!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
});

db.on('error', (error) => {
  console.error('❌ Database connection error:', error);
  process.exit(1);
});
