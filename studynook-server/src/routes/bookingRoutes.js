const express = require('express');
const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All booking routes are protected
router.post('/', protect, createBooking);
router.get('/mine', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
