const mongoose = require('mongoose');

/**
 * Model Product dùng để lưu thông tin điện thoại.
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Hãng sản phẩm là bắt buộc'],
      trim: true,
      lowercase: true
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc']
    },
    ram: {
      type: Number,
      required: [true, 'RAM là bắt buộc']
    },
    rom: {
      type: Number,
      required: [true, 'ROM là bắt buộc']
    },
    battery: {
      type: Number,
      required: [true, 'Dung lượng pin là bắt buộc']
    },
    camera: {
      type: Number,
      required: [true, 'Thông số camera là bắt buộc']
    },
    chipset: {
      type: String,
      required: [true, 'Chipset là bắt buộc'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Product', productSchema);
