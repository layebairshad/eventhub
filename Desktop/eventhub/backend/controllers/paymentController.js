const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate('event');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user owns booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking already paid',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        eventId: booking.event._id.toString(),
      },
    });

    // Update booking with payment intent ID
    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const booking = await Booking.findOne({ paymentIntentId });

      if (booking && booking.paymentStatus !== 'completed') {
        // Update booking status
        booking.paymentStatus = 'completed';
        await booking.save();

        // Update event tickets
        const event = await Event.findById(booking.event);
        if (event) {
          event.availableTickets -= booking.tickets;
          await event.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified',
        data: {
          paymentStatus: 'completed',
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    const booking = await Booking.findOne({
      paymentIntentId: paymentIntent.id,
    });

    if (booking && booking.paymentStatus !== 'completed') {
      booking.paymentStatus = 'completed';
      await booking.save();

      const eventModel = await Event.findById(booking.event);
      if (eventModel) {
        eventModel.availableTickets -= booking.tickets;
        await eventModel.save();
      }
    }
  }

  res.json({ received: true });
};

