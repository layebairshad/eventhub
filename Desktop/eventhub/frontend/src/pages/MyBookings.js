import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1>My Bookings</h1>

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card card">
                <div className="booking-header">
                  <div>
                    <h2>{booking.event.title}</h2>
                    <p className="booking-ref">
                      Reference: {booking.bookingReference}
                    </p>
                  </div>
                  <div className="booking-status">
                    <span
                      className={`status-badge ${
                        booking.status === 'confirmed'
                          ? 'confirmed'
                          : booking.status === 'cancelled'
                          ? 'cancelled'
                          : 'refunded'
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span
                      className={`payment-badge ${
                        booking.paymentStatus === 'completed'
                          ? 'completed'
                          : booking.paymentStatus === 'pending'
                          ? 'pending'
                          : 'failed'
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {format(new Date(booking.event.date), 'MMM dd, yyyy')} at{' '}
                      {booking.event.time}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Venue:</span>
                    <span className="detail-value">
                      {booking.event.venue.name}, {booking.event.venue.city}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Tickets:</span>
                    <span className="detail-value">{booking.tickets}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Total Amount:</span>
                    <span className="detail-value">₹{booking.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="booking-actions">
                  <Link
                    to={`/events/${booking.event._id}`}
                    className="btn btn-outline"
                  >
                    View Event
                  </Link>
                  {booking.status === 'confirmed' &&
                    booking.paymentStatus === 'completed' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="btn btn-danger"
                      >
                        Cancel Booking
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
            <Link to="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

