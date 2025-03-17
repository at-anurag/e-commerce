const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [8, 'Price cannot exceed 8 characters'],
    default: 0.0
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  category: {
    type: String,
    required: [true, 'Please select category for this product'],
    enum: {
      values: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books'],
      message: 'Please select correct category'
    }
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL for this product'],
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Stock cannot exceed 5 characters'],
    default: 1
  },
  seller: {
    type: String,
    required: [true, 'Please enter seller name']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema); 