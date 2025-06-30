const mongoose = require('mongoose');

// Export Buyer Schema
const exportBuyerSchema = new mongoose.Schema({
    buyerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['international', 'local', 'online_platform'],
        required: true
    },
    country: String,
    contactInfo: {
        email: String,
        phone: String,
        address: String
    },
    requirements: [String],
    certifications: [String],
    commission: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    _id: false
});

// Export Product Schema
const exportProductSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true
    },
    variety: String,
    quantity: {
        value: {
            type: Number,
            required: true,
            min: 0
        },
        unit: {
            type: String,
            enum: ['kg', 'quintal', 'ton'],
            default: 'kg'
        }
    },
    price: {
        perUnit: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: 'INR'
        },
        total: {
            type: Number,
            required: true,
            min: 0
        }
    },
    quality: {
        grade: {
            type: String,
            enum: ['A', 'B', 'C', 'Premium', 'Standard', 'Low'],
            default: 'Standard'
        },
        description: String,
        certifications: [String]
    },
    harvestDate: Date,
    expiryDate: Date,
    packaging: {
        type: String,
        enum: ['loose', 'bags', 'boxes', 'containers'],
        default: 'bags'
    },
    storageConditions: String,
    images: [String]
}, {
    _id: false
});

// Export Documentation Schema
const exportDocumentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['phytosanitary', 'certificate_of_origin', 'commercial_invoice', 'packing_list', 'bill_of_lading', 'insurance', 'quality_certificate'],
        required: true
    },
    documentNumber: String,
    issueDate: Date,
    expiryDate: Date,
    issuingAuthority: String,
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'expired'],
        default: 'pending'
    },
    fileUrl: String,
    notes: String
}, {
    _id: false
});

// Export Logistics Schema
const exportLogisticsSchema = new mongoose.Schema({
    shippingMethod: {
        type: String,
        enum: ['air_freight', 'sea_freight', 'land_transport', 'courier'],
        required: true
    },
    carrier: String,
    trackingNumber: String,
    containerNumber: String,
    departurePort: String,
    arrivalPort: String,
    departureDate: Date,
    estimatedArrival: Date,
    actualArrival: Date,
    shippingCost: {
        type: Number,
        min: 0
    },
    insuranceCost: {
        type: Number,
        min: 0
    },
    customsDuty: {
        type: Number,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'booked', 'in_transit', 'arrived', 'delivered'],
        default: 'pending'
    }
}, {
    _id: false
});

// Export Payment Schema
const exportPaymentSchema = new mongoose.Schema({
    method: {
        type: String,
        enum: ['letter_of_credit', 'advance_payment', 'open_account', 'documentary_collection'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    exchangeRate: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'partial', 'completed', 'overdue'],
        default: 'pending'
    },
    dueDate: Date,
    paidDate: Date,
    transactionId: String,
    notes: String
}, {
    _id: false
});

// Export Activity Log Schema
const exportActivityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'listing_created',
            'buyer_contacted',
            'proposal_submitted',
            'negotiation_started',
            'deal_finalized',
            'documentation_started',
            'logistics_arranged',
            'shipment_dispatched',
            'payment_received',
            'delivery_confirmed',
            'feedback_received'
        ]
    },
    description: String,
    performedBy: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
}, {
    _id: false
});

// Main Export Schema
const exportSchema = new mongoose.Schema({
    exportId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    product: exportProductSchema,
    buyers: [exportBuyerSchema],
    selectedBuyers: [String], // Array of buyer IDs
    status: {
        type: String,
        enum: ['draft', 'active', 'negotiating', 'finalized', 'in_progress', 'shipped', 'delivered', 'completed', 'cancelled'],
        default: 'draft'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    targetMarkets: [String],
    expectedRevenue: {
        type: Number,
        min: 0
    },
    actualRevenue: {
        type: Number,
        min: 0
    },
    profitMargin: {
        type: Number,
        min: 0,
        max: 100
    },
    documents: [exportDocumentSchema],
    logistics: exportLogisticsSchema,
    payment: exportPaymentSchema,
    timeline: {
        listingDate: {
            type: Date,
            default: Date.now
        },
        expectedDealDate: Date,
        actualDealDate: Date,
        expectedShipmentDate: Date,
        actualShipmentDate: Date,
        expectedDeliveryDate: Date,
        actualDeliveryDate: Date
    },
    requirements: {
        packaging: [String],
        labeling: [String],
        certifications: [String],
        qualityStandards: [String]
    },
    risks: [{
        type: {
            type: String,
            enum: ['quality', 'logistics', 'payment', 'regulatory', 'market', 'weather'],
            required: true
        },
        description: String,
        probability: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        impact: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        mitigation: String
    }],
    feedback: {
        buyerRating: {
            type: Number,
            min: 1,
            max: 5
        },
        buyerComments: String,
        farmerRating: {
            type: Number,
            min: 1,
            max: 5
        },
        farmerComments: String
    },
    activityLog: [exportActivityLogSchema],
    tags: [String],
    isFeatured: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    metadata: {
        source: {
            type: String,
            enum: ['web', 'mobile', 'api'],
            default: 'web'
        },
        ipAddress: String,
        userAgent: String
    }
}, {
    timestamps: true,
    collection: 'exports'
});

// Indexes for better performance
exportSchema.index({ userId: 1, createdAt: -1 });
exportSchema.index({ status: 1, createdAt: -1 });
exportSchema.index({ 'product.cropName': 1 });
exportSchema.index({ targetMarkets: 1 });
exportSchema.index({ isActive: 1, status: 1 });
exportSchema.index({ exportId: 1 });
exportSchema.index({ 'logistics.trackingNumber': 1 });
exportSchema.index({ 'payment.transactionId': 1 });

// Virtual for export age
exportSchema.virtual('exportAge').get(function () {
    return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for days until expected delivery
exportSchema.virtual('daysUntilDelivery').get(function () {
    if (!this.timeline.expectedDeliveryDate) return null;
    return Math.ceil((this.timeline.expectedDeliveryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
});

// Virtual for completion percentage
exportSchema.virtual('completionPercentage').get(function () {
    const statusProgress = {
        'draft': 10,
        'active': 20,
        'negotiating': 40,
        'finalized': 60,
        'in_progress': 70,
        'shipped': 85,
        'delivered': 95,
        'completed': 100,
        'cancelled': 0
    };
    return statusProgress[this.status] || 0;
});

// Pre-save middleware to generate export ID
exportSchema.pre('save', async function (next) {
    if (this.isNew && !this.exportId) {
        const count = await this.constructor.countDocuments();
        this.exportId = `EXP${Date.now()}${String(count + 1).padStart(4, '0')}`;
    }

    // Auto-calculate total price
    if (this.product && this.product.quantity && this.product.price) {
        this.product.price.total = this.product.quantity.value * this.product.price.perUnit;
    }

    // Auto-calculate profit margin if revenue and cost are available
    if (this.actualRevenue && this.product?.price?.total) {
        this.profitMargin = ((this.actualRevenue - this.product.price.total) / this.actualRevenue) * 100;
    }

    next();
});

// Instance methods
exportSchema.methods.addActivity = function (action, description, performedBy, metadata = {}) {
    this.activityLog.push({
        action,
        description,
        performedBy,
        timestamp: new Date(),
        metadata
    });
};

exportSchema.methods.updateStatus = function (newStatus, note = '') {
    this.status = newStatus;
    this.addActivity('status_changed', `Status changed to ${newStatus}`, 'system', { note });
};

exportSchema.methods.addBuyer = function (buyerData) {
    this.buyers.push(buyerData);
    this.addActivity('buyer_added', `Buyer ${buyerData.name} added`, 'system');
};

exportSchema.methods.updateLogistics = function (logisticsData) {
    this.logistics = { ...this.logistics, ...logisticsData };
    this.addActivity('logistics_updated', 'Logistics information updated', 'system');
};

exportSchema.methods.updatePayment = function (paymentData) {
    this.payment = { ...this.payment, ...paymentData };
    this.addActivity('payment_updated', 'Payment information updated', 'system');
};

// Static methods
exportSchema.statics.findByUser = function (userId, options = {}) {
    const { limit = 10, skip = 0, status, sort = { createdAt: -1 } } = options;
    const query = { userId, isActive: true };
    if (status) query.status = status;

    return this.find(query)
        .sort(sort)
        .limit(limit)
        .skip(skip);
};

exportSchema.statics.findActiveExports = function (userId = null) {
    const query = {
        isActive: true,
        status: { $in: ['active', 'negotiating', 'finalized', 'in_progress', 'shipped'] }
    };
    if (userId) query.userId = userId;

    return this.find(query).sort({ createdAt: -1 });
};

exportSchema.statics.getExportStats = function (userId = null) {
    const matchStage = { isActive: true };
    if (userId) matchStage.userId = userId;

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                totalRevenue: { $sum: '$actualRevenue' },
                avgRevenue: { $avg: '$actualRevenue' }
            }
        }
    ]);
};

exportSchema.statics.getMarketInsights = function () {
    return this.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: '$targetMarkets',
                count: { $sum: 1 },
                totalRevenue: { $sum: '$actualRevenue' },
                avgProfitMargin: { $avg: '$profitMargin' }
            }
        }
    ]);
};

exportSchema.statics.getTopCrops = function (limit = 10) {
    return this.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: '$product.cropName',
                count: { $sum: 1 },
                totalQuantity: { $sum: '$product.quantity.value' },
                avgPrice: { $avg: '$product.price.perUnit' },
                totalRevenue: { $sum: '$actualRevenue' }
            }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: limit }
    ]);
};

const Export = mongoose.model('Export', exportSchema);

module.exports = Export; 