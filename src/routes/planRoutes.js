const express = require('express');
const router = express.Router();
const { getPlans, getPlan } = require('../controllers/planController');

router.get('/', getPlans);
router.get('/:id', getPlan);

module.exports = router;
