const mongoose = require('mongoose');
const College = require('./models/College');
require('dotenv').config();

const seedColleges = [
  {
    name: "Delhi University",
    image: "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/delhi-university-campus.jpg",
    description: "One of India's premier universities with excellent placement records and diverse academic programs.",
    location: "Delhi",
    courses: ["Computer Science", "Business Administration", "Engineering", "Arts", "Commerce"],
    website: "https://www.du.ac.in",
    fees: 50000,
    ranking: 1
  },
  {
    name: "IIT Delhi",
    image: "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/iit-delhi-campus.jpg",
    description: "Premier engineering institute known for cutting-edge research and innovation.",
    location: "Delhi",
    courses: ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
    website: "https://www.iitd.ac.in",
    fees: 200000,
    ranking: 2
  },
  {
    name: "Mumbai University",
    image: "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/mumbai-university-campus.jpg",
    description: "Historic university offering comprehensive education in various disciplines.",
    location: "Mumbai",
    courses: ["Information Technology", "Commerce", "Science", "Management"],
    website: "https://www.mu.ac.in",
    fees: 75000,
    ranking: 3
  },
  {
    name: "IIT Bombay",
    image: "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/iit-bombay-campus.jpg",
    description: "World-renowned institute for engineering and technology education.",
    location: "Mumbai",
    courses: ["Computer Science", "Chemical Engineering", "Aerospace Engineering"],
    website: "https://www.iitb.ac.in",
    fees: 220000,
    ranking: 4
  },
  {
    name: "Bangalore University",
    image: "https://res.cloudinary.com/dytimzerg/image/upload/v1696500000/bangalore-university-campus.jpg",
    description: "Leading university in India's tech capital with strong industry connections.",
    location: "Bangalore",
    courses: ["Computer Applications", "Business Management", "Electronics"],
    website: "https://www.bangaloreuniversity.ac.in",
    fees: 60000,
    ranking: 5
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing colleges
    await College.deleteMany({});
    console.log('🗑️ Cleared existing colleges');

    // Insert seed data
    await College.insertMany(seedColleges);
    console.log('✅ Successfully seeded database with colleges');

    console.log('📊 Seed data summary:');
    console.log(`   - ${seedColleges.length} colleges added`);
    console.log('🎉 Database seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Connect to database and seed
const connectAndSeed = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/comla';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    await seedDatabase();

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');

  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  connectAndSeed();
}

module.exports = { seedDatabase, seedColleges };