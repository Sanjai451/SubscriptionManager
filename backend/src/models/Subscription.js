const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    // For simulated payment
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'paid',
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-update status based on end_date
subscriptionSchema.methods.checkAndUpdateStatus = function () {
  if (this.status === 'active' && new Date() > this.end_date) {
    this.status = 'expired';
  }
  return this;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
