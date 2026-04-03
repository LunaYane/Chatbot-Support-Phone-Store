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

const recommendationSchema = new mongoose.Schema(
  {
    suitable_for_gaming: { type: Boolean, default: false },
    suitable_for_camera: { type: Boolean, default: false },
    suitable_for_battery: { type: Boolean, default: false },
    suitable_for_basic_use: { type: Boolean, default: false }
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
    specifications: { type: specificationSchema, required: true },
    recommendation: { type: recommendationSchema, required: true }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model('Phone', phoneSchema);
