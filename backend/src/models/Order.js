const mongoose = require('mongoose');

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  _id: false
});

// Shipping Address Schema
const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: String,
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  },
  landmark: String
}, {
  _id: false
});

// Payment Information Schema
const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'cod', 'wallet']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  paymentGateway: String,
  paidAt: Date,
  refundedAt: Date,
  refundAmount: {
    type: Number,
    min: 0
  }
}, {
  _id: false
});

// Order Schema
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  discount: {
    type: Number,
    min: 0,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true
  },
  shippingAddress: shippingAddressSchema,
  paymentInfo: paymentInfoSchema,
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  returnedAt: Date,
  returnReason: String,
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: String
  }]
}, {
  timestamps: true,
  collection: 'orders'
});

// Indexes for better performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `AGR${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  
  // Add status to history if status changed
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status changed to ${this.status}`
    });
  }
  
  next();
});

// Instance methods
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = 'system') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
  
  // Set specific timestamps based on status
  switch (newStatus) {
    case 'delivered':
      this.deliveredAt = new Date();
      break;
    case 'cancelled':
      this.cancelledAt = new Date();
      break;
    case 'returned':
      this.returnedAt = new Date();
      break;
  }
  
  return this.save();
};

orderSchema.methods.calculateTotal = function() {
  this.subtotal = this.items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const discountAmount = (itemTotal * item.discount) / 100;
    item.subtotal = itemTotal - discountAmount;
    return sum + item.subtotal;
  }, 0);
  
  this.total = this.subtotal + this.tax + this.shippingCost - this.discount;
  return this.total;
};

orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

orderSchema.methods.canBeReturned = function() {
  return this.status === 'delivered' && 
         this.deliveredAt && 
         (Date.now() - this.deliveredAt.getTime()) <= (30 * 24 * 60 * 60 * 1000); // 30 days
};

// Static methods
orderSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 10, skip = 0, status } = options;
  const query = { userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('items.productId', 'name images')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

orderSchema.statics.getOrderStats = function(startDate, endDate) {
  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$total' },
        avgOrderValue: { $avg: '$total' }
      }
    }
  ]);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
