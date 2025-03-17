const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  paidAt: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema); 