const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order => /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      paymentInfo, 
      totalPrice 
    } = req.body;

    // Check if orderItems is provided
    if (!orderItems || orderItems.length === 0) {
      // Fallback to single product order if orderItems is not provided
      const { product: productId, paymentInfo } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Please provide product information'
        });
      }

      // Find product
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if product is in stock
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: 'Product out of stock'
        });
      }

      // Calculate delivery date (1 week from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 7);

      // Create order
      const order = await Order.create({
        product: productId,
        user: req.user.id,
        paymentInfo,
        paidAt: Date.now(),
        price: product.price,
        deliveryDate
      });

      // Reduce product stock
      product.stock = product.stock - 1;
      await product.save();

      return res.status(201).json({
        success: true,
        order
      });
    }

    // Handle cart order with multiple items
    console.log('Creating cart order with items:', orderItems);

    // Calculate delivery date (1 week from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);

    // Create order with multiple items
    const order = await Order.create({
      orderItems,
      user: req.user.id,
      shippingAddress,
      paymentInfo,
      totalPrice,
      paidAt: Date.now(),
      deliveryDate
    });

    // Update stock for each product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    return res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order => /api/orders/:id
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'name price image')
      .populate('orderItems.product', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is admin or order belongs to user
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get logged in user orders => /api/orders/me
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('product', 'name price image')
      .populate('orderItems.product', 'name price image');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders - ADMIN => /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product', 'name price')
      .populate('orderItems.product', 'name price')
      .populate('user', 'name email');

    let totalAmount = 0;
    orders.forEach(order => {
      // Handle both single product and cart orders
      if (order.totalPrice) {
        totalAmount += order.totalPrice;
      } else if (order.price) {
        totalAmount += order.price;
      }
    });

    res.status(200).json({
      success: true,
      totalAmount,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update order status - ADMIN => /api/orders/:id
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order has already been delivered'
      });
    }

    order.orderStatus = req.body.orderStatus;
    
    if (req.body.orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 