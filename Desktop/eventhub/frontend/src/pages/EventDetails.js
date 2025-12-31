import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import api from '../services/api';
import { format } from 'date-fns';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.data);
      checkAvailability(1);
    } catch (error) {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (tickets) => {
    try {
      const res = await api.get(`/events/${id}/availability?tickets=${tickets}`);
      setAvailability(res.data.data);
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.info('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (!availability?.available) {
      toast.error('Not enough tickets available');
      return;
    }

    navigate(`/booking/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (!event) {
    return null;
  }

  return (
    <div className="event-details-page">
      <div className="container">
        <Link to="/events" className="back-link">
          ← Back to Events
        </Link>

        <div className="event-details">
          {event.image && (
            <div className="event-image-large">
              <img src={event.image} alt={event.title} />
            </div>
          )}

          <div className="event-info">
            <div className="event-header">
              <span className="event-category">{event.category}</span>
              <h1 className="event-title">{event.title}</h1>
              <p className="event-organizer">Organized by {event.organizer}</p>
            </div>

            <div className="event-description">
              <h2>About this event</h2>
              <p>{event.description}</p>
            </div>

            <div className="event-details-grid">
              <div className="detail-item">
                <div className="detail-icon">📅</div>
                <div>
                  <div className="detail-label">Date & Time</div>
                  <div className="detail-value">
                    {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')} at{' '}
                    {event.time}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">📍</div>
                <div>
                  <div className="detail-label">Venue</div>
                  <div className="detail-value">
                    {event.venue.name}
                    <br />
                    {event.venue.address}, {event.venue.city}, {event.venue.state}{' '}
                    {event.venue.zipCode}
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">💰</div>
                <div>
                  <div className="detail-label">Price</div>
                  <div className="detail-value">₹{event.price} per ticket</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">🎫</div>
                <div>
                  <div className="detail-label">Availability</div>
                  <div className="detail-value">
                    {event.availableTickets} of {event.totalTickets} tickets
                    available
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-section">
              <div className="price-display">
                <span className="price-label">Ticket Price</span>
                <span className="price-amount">₹{event.price}</span>
              </div>

              {event.status === 'active' && event.availableTickets > 0 ? (
                <button
                  onClick={handleBookNow}
                  className="btn btn-primary btn-large btn-block"
                >
                  Book Now
                </button>
              ) : (
                <button className="btn btn-secondary btn-large btn-block" disabled>
                  {event.status === 'sold-out'
                    ? 'Sold Out'
                    : event.status === 'cancelled'
                    ? 'Cancelled'
                    : 'Not Available'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

