import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../services/api';
import { toast } from 'react-toastify';
import './Booking.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = ({ event, booking, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const intentRes = await api.post('/payments/create-intent', {
        bookingId: booking._id,
      });

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentRes.data.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        toast.error(error.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Verify payment
        await api.post('/payments/verify', {
          paymentIntentId: paymentIntent.id,
        });
        toast.success('Payment successful! Booking confirmed.');
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Card Details</label>
        <div className="card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-large btn-block"
        disabled={!stripe || processing}
      >
        {processing ? 'Processing...' : `Pay ₹${booking.totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
};

const Booking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    tickets: 1,
    attendeeDetails: [{ name: '', email: '' }],
  });
  const [loading, setLoading] = useState(true);
  const [creatingBooking, setCreatingBooking] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data.data);
    } catch (error) {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const tickets = Math.min(Math.max(value, 1), event.availableTickets);

    setFormData({
      ...formData,
      tickets,
      attendeeDetails: Array.from({ length: tickets }, (_, i) =>
        formData.attendeeDetails[i] || { name: '', email: '' }
      ),
    });
  };

  const handleAttendeeChange = (index, field, value) => {
    const newAttendeeDetails = [...formData.attendeeDetails];
    newAttendeeDetails[index][field] = value;
    setFormData({ ...formData, attendeeDetails: newAttendeeDetails });
  };

  const handleCreateBooking = async () => {
    if (formData.tickets > event.availableTickets) {
      toast.error('Not enough tickets available');
      return;
    }

    setCreatingBooking(true);
    try {
      const res = await api.post('/bookings', {
        eventId,
        tickets: formData.tickets,
        attendeeDetails: formData.attendeeDetails,
      });
      setBooking(res.data.data);
      toast.success('Booking created. Please complete payment.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setCreatingBooking(false);
    }
  };

  const handlePaymentSuccess = () => {
    navigate('/my-bookings');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!event) {
    return null;
  }

  const totalAmount = event.price * formData.tickets;

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Book Tickets</h1>

        <div className="booking-content">
          <div className="booking-form card">
            <h2>{event.title}</h2>
            <p className="event-date">
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>

            {!booking ? (
              <>
                <div className="form-group">
                  <label>Number of Tickets</label>
                  <input
                    type="number"
                    min="1"
                    max={event.availableTickets}
                    value={formData.tickets}
                    onChange={handleChange}
                  />
                  <small>
                    {event.availableTickets} tickets available
                  </small>
                </div>

                <div className="attendee-details">
                  <h3>Attendee Details</h3>
                  {formData.attendeeDetails.map((attendee, index) => (
                    <div key={index} className="attendee-form">
                      <h4>Attendee {index + 1}</h4>
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={attendee.name}
                          onChange={(e) =>
                            handleAttendeeChange(index, 'name', e.target.value)
                          }
                          required
                          placeholder="Full name"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={attendee.email}
                          onChange={(e) =>
                            handleAttendeeChange(index, 'email', e.target.value)
                          }
                          required
                          placeholder="Email address"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="booking-summary">
                  <div className="summary-row">
                    <span>Ticket Price:</span>
                    <span>₹{event.price}</span>
                  </div>
                  <div className="summary-row">
                    <span>Quantity:</span>
                    <span>{formData.tickets}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCreateBooking}
                  className="btn btn-primary btn-large btn-block"
                  disabled={creatingBooking}
                >
                  {creatingBooking ? 'Creating Booking...' : 'Continue to Payment'}
                </button>
              </>
            ) : (
              <div className="payment-section">
                <h3>Complete Payment</h3>
                <div className="booking-summary">
                  <div className="summary-row">
                    <span>Booking Reference:</span>
                    <span>{booking.bookingReference}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <span>₹{booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    event={event}
                    booking={booking}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

