const mongoose = require('mongoose');
const College = require('./models/College');
require('dotenv').config();

// Default placeholder image for colleges without images
const DEFAULT_PLACEHOLDER = "https://res.cloudinary.com/dytimzerg/image/upload/v1698765432/colleges/default-college.jpg";

// Mapping of old placeholder URLs to new Cloudinary URLs
const imageMapping = {
  "https://via.placeholder.com/400x300?text=Delhi+University": "https://res.cloudinary.com/dytimzerg/image/upload/v1698765432/colleges/delhi-university.jpg",
  "https://via.placeholder.com/400x300?text=IIT+Delhi": "https://res.cloudinary.com/dytimzerg/image/upload/v1698765432/colleges/iit-delhi.jpg",
  "https://via.placeholder.com/400x300?text=Mumbai+University": "https://res.cloudinary.com/dytimzerg/image/upload/v1698765432/colleges/mumbai-university.jpg",
  "https://via.placeholder.com/400x300?text=IIT+Bombay": "https://res.cloudinary.com/dytimzerg/image/upload/v1698765432/colleges/iit-bombay.jpg",
  "https://via.placeholder.com/400x300?text=Bangalore+University": "https://res.cloudinary.com/dytimzerg/image/upload/v1698765432/colleges/bangalore-university.jpg"
};

const migrateCollegeImages = async () => {
  try {
    console.log('🔄 Starting college image migration...');

    // Connect to database
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/comla';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Get all colleges
    const colleges = await College.find({});
    console.log(`📊 Found ${colleges.length} colleges to check`);

    let updatedCount = 0;

    for (const college of colleges) {
      let needsUpdate = false;
      let newImageUrl = college.image;

      // Check if current image is a placeholder that needs updating
      if (imageMapping[college.image]) {
        newImageUrl = imageMapping[college.image];
        needsUpdate = true;
      }
      // Check if image is empty or missing
      else if (!college.image || college.image.trim() === '') {
        newImageUrl = DEFAULT_PLACEHOLDER;
        needsUpdate = true;
      }
      // Check if image URL is invalid (placeholder.com fallback)
      else if (college.image.includes('via.placeholder.com')) {
        newImageUrl = DEFAULT_PLACEHOLDER;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await College.findByIdAndUpdate(college._id, { image: newImageUrl });
        console.log(`✅ Updated ${college.name}: ${college.image} → ${newImageUrl}`);
        updatedCount++;
      }
    }

    console.log(`🎉 Migration completed! Updated ${updatedCount} college images`);
    console.log(`📝 Default placeholder: ${DEFAULT_PLACEHOLDER}`);

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateCollegeImages();
}

module.exports = { migrateCollegeImages };