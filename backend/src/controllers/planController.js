const Plan = require('../models/Plan');

// @desc    Get all active plans
// @route   GET /api/plans
// @access  Public
const getPlans = async (req, res, next) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Public
const getPlan = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan || !plan.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlans, getPlan };
