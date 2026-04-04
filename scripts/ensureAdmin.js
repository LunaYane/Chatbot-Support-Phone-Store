const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/User');
const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = require('../config/env');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

async function ensureAdmin() {
  await mongoose.connect(MONGO_URI);

  const email = String(ADMIN_EMAIL || '').trim().toLowerCase();
  const fullName = String(ADMIN_NAME || 'Store Admin').trim();
  const password = String(ADMIN_PASSWORD || '').trim();

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    if (exists.role !== 'admin') {
      exists.role = 'admin';
      await exists.save();
      console.log(`Updated ${email} to admin role.`);
    } else {
      console.log(`Admin already exists: ${email}`);
    }
    return;
  }

  const { hash, salt } = hashPassword(password);
  await User.create({
    fullName,
    email,
    phone: '',
    passwordHash: hash,
    passwordSalt: salt,
    role: 'admin',
    isActive: true
  });

  console.log(`Created admin account: ${email}`);
}

ensureAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
