const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const crypto = require('crypto');

// Helper: generate fake transaction ID
const generateTransactionId = () => {
  return 'TXN_' + crypto.randomBytes(8).toString('hex').toUpperCase();
};

// @desc    Subscribe to a plan (with simulated payment)
// @route   POST /api/subscribe/:planId
// @access  Private (user)
const subscribe = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const userId = req.user.userId;
    const { paymentMethod = 'card' } = req.body; // Simulated payment

    // Find the plan
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found or unavailable.',
      });
    }

    // Check for existing active subscription
    const existingSubscription = await Subscription.findOne({
      user_id: userId,
      status: 'active',
    });

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    // Simulate payment processing
    const transactionId = generateTransactionId();
    const paymentSuccess = true; // Always succeeds in simulation

    if (!paymentSuccess) {
      return res.status(402).json({
        success: false,
        message: 'Payment failed. Please try again.',
      });
    }

    let subscription;

    if (existingSubscription) {
      // Upgrade/Downgrade: Update existing subscription
      existingSubscription.plan_id = plan._id;
      existingSubscription.start_date = startDate;
      existingSubscription.end_date = endDate;
      existingSubscription.status = 'active';
      existingSubscription.transactionId = transactionId;
      existingSubscription.paymentStatus = 'paid';
      await existingSubscription.save();
      subscription = existingSubscription;
    } else {
      // Create new subscription
      subscription = await Subscription.create({
        user_id: userId,
        plan_id: plan._id,
        start_date: startDate,
        end_date: endDate,
        status: 'active',
        paymentStatus: 'paid',
        transactionId,
      });
    }

    // Populate plan details for response
    await subscription.populate('plan_id');

    res.status(201).json({
      success: true,
      message: `Successfully subscribed to ${plan.name} plan!`,
      data: {
        subscription,
        payment: {
          transactionId,
          amount: plan.price,
          status: 'paid',
          method: paymentMethod,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's active subscription
// @route   GET /api/my-subscription
// @access  Private (user)
const getMySubscription = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const subscription = await Subscription.findOne({
      user_id: userId,
      status: 'active',
    }).populate('plan_id');

    if (!subscription) {
      // Check for expired subscription
      const expiredSub = await Subscription.findOne({
        user_id: userId,
      })
        .sort({ createdAt: -1 })
        .populate('plan_id');

      return res.status(200).json({
        success: true,
        data: null,
        lastSubscription: expiredSub || null,
        message: 'No active subscription found.',
      });
    }

    // Auto-check if expired
    if (new Date() > subscription.end_date) {
      subscription.status = 'expired';
      await subscription.save();

      return res.status(200).json({
        success: true,
        data: null,
        lastSubscription: subscription,
        message: 'Subscription has expired.',
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel subscription
// @route   PUT /api/my-subscription/cancel
// @access  Private (user)
const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      user_id: req.user.userId,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription to cancel.',
      });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL subscriptions (Admin only)
// @route   GET /api/admin/subscriptions
// @access  Private (admin)
const getAllSubscriptions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [subscriptions, total] = await Promise.all([
      Subscription.find(filter)
        .populate('user_id', 'name email role')
        .populate('plan_id', 'name price duration')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Subscription.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get subscription stats (Admin only)
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = async (req, res, next) => {
  try {
    const [totalActive, totalExpired, totalCancelled, revenueData] = await Promise.all([
      Subscription.countDocuments({ status: 'active' }),
      Subscription.countDocuments({ status: 'expired' }),
      Subscription.countDocuments({ status: 'cancelled' }),
      Subscription.aggregate([
        { $match: { paymentStatus: 'paid' } },
        {
          $lookup: {
            from: 'plans',
            localField: 'plan_id',
            foreignField: '_id',
            as: 'plan',
          },
        },
        { $unwind: '$plan' },
        { $group: { _id: null, totalRevenue: { $sum: '$plan.price' } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalActive,
        totalExpired,
        totalCancelled,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  getMySubscription,
  cancelSubscription,
  getAllSubscriptions,
  getStats,
};
