const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: '', trim: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    isActive: { type: Boolean, default: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
