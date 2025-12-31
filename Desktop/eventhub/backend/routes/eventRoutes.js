const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  checkAvailability,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.get('/:id/availability', checkAvailability);

router.post('/', protect, authorize('admin'), createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;

