const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema(
  {
    display: String,
    processor: String,
    ram: String,
    storage: String,
    battery: String,
    camera: String
  },
  { _id: false }
);

const phoneSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    specifications: { type: specificationSchema, required: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Phone', phoneSchema);
