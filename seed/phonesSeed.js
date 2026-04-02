const mongoose = require('mongoose');
const Phone = require('../models/Phone');
const phones = require('../data/phones');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phone-store-demo';

async function seedPhones() {
  try {
    await mongoose.connect(MONGO_URI);
    await Phone.deleteMany({});
    await Phone.insertMany(phones);

    console.log(`Seeded ${phones.length} phones into MongoDB.`);
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedPhones();
