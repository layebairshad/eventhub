const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// Send event reminders to users (can be called via cron job)
const sendEventReminders = async () => {
  try {
    // Find bookings for events happening in 24 hours
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const upcomingEvents = await Event.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfter,
      },
      status: 'active',
    });

    for (const event of upcomingEvents) {
      const bookings = await Booking.find({
        event: event._id,
        status: 'confirmed',
        paymentStatus: 'completed',
        reminderSent: false,
      }).populate('user');

      for (const booking of bookings) {
        const user = await User.findById(booking.user._id);
        if (user) {
          user.notifications.push({
            type: 'reminder',
            message: `Reminder: ${event.title} is happening tomorrow at ${event.time}`,
            eventId: event._id,
          });
          await user.save();

          booking.reminderSent = true;
          await booking.save();
        }
      }
    }

    console.log('Event reminders sent successfully');
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
};

module.exports = { sendEventReminders };

