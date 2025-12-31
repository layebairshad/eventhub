const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets, attendeeDetails, paymentMethod } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check availability
    if (event.availableTickets < tickets) {
      return res.status(400).json({
        success: false,
        message: 'Not enough tickets available',
      });
    }

    // Check if event is active
    if (event.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Event is not available for booking',
      });
    }

    const totalAmount = event.price * tickets;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      tickets,
      totalAmount,
      attendeeDetails,
      paymentMethod: paymentMethod || 'stripe',
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user owns booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentIntentId } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Update booking
    booking.paymentStatus = paymentStatus || booking.paymentStatus;
    if (paymentIntentId) {
      booking.paymentIntentId = paymentIntentId;
    }

    // If payment completed, update event tickets
    if (paymentStatus === 'completed' && booking.paymentStatus !== 'completed') {
      const event = await Event.findById(booking.event);
      if (event) {
        event.availableTickets -= booking.tickets;
        await event.save();

        // Add notification to user
        const user = await User.findById(booking.user);
        if (user) {
          user.notifications.push({
            type: 'booking',
            message: `Your booking for ${event.title} has been confirmed!`,
            eventId: event._id,
          });
          await user.save();
        }
      }
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('event')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Refund tickets to event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableTickets += booking.tickets;
      await event.save();
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

