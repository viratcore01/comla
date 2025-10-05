const mongoose = require('mongoose');
const College = require('./models/College');
require('dotenv').config();

const checkCollegeImages = async () => {
  try {
    console.log('🔍 Checking college images in database...');

    // Connect to database
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/comla';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all colleges
    const colleges = await College.find({});
    console.log(`📊 Found ${colleges.length} colleges:`);

    colleges.forEach((college, index) => {
      console.log(`${index + 1}. ${college.name}: ${college.image}`);
    });

    // Check for placeholder images
    const placeholderColleges = colleges.filter(college =>
      college.image.includes('via.placeholder.com') ||
      college.image.includes('placeholder')
    );

    if (placeholderColleges.length > 0) {
      console.log(`⚠️ Found ${placeholderColleges.length} colleges with placeholder images that need updating`);
    } else {
      console.log('✅ All colleges have proper image URLs');
    }

  } catch (error) {
    console.error('❌ Error checking images:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run check if called directly
if (require.main === module) {
  checkCollegeImages();
}

module.exports = { checkCollegeImages };