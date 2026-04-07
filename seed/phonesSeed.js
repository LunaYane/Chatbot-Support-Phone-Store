const mongoose = require('mongoose');
const Phone = require('../models/Phone');
const phones = require('../data/phones');
const { buildRecommendationAttributes } = require('../utils/recommendation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phone-store-demo';

async function seedPhones() {
  try {
    await mongoose.connect(MONGO_URI);

    const phonesWithRecommendation = phones.map((phone) => ({
      ...phone,
      recommendation: buildRecommendationAttributes(phone)
    }));

    await Phone.deleteMany({});
    await Phone.insertMany(phonesWithRecommendation);

    console.log(`Seeded ${phonesWithRecommendation.length} phones into MongoDB.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedPhones();
