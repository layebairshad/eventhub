const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBooking,
  updatePaymentStatus,
  getAllBookings,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id/payment', protect, updatePaymentStatus);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);

module.exports = router;

