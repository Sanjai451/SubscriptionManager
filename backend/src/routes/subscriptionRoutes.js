const express = require('express');
const router = express.Router();
const {
  subscribe,
  getMySubscription,
  cancelSubscription,
  getAllSubscriptions,
  getStats,
} = require('../controllers/subscriptionController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.post('/subscribe/:planId', protect, authorize('user', 'admin'), subscribe);
router.get('/my-subscription', protect, getMySubscription);
router.put('/my-subscription/cancel', protect, cancelSubscription);

// Admin only routes
router.get('/admin/subscriptions', protect, authorize('admin'), getAllSubscriptions);
router.get('/admin/stats', protect, authorize('admin'), getStats);

module.exports = router;
