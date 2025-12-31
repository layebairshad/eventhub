import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import './Home.css';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const res = await api.get('/events?featured=true&limit=6');
      setFeaturedEvents(res.data.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading featured events...</div>;
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Amazing Events</h1>
            <p className="hero-subtitle">
              Book tickets for concerts, conferences, sports, and more. Your next
              adventure starts here.
            </p>
            <Link to="/events" className="btn btn-primary btn-large">
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-events">
        <div className="container">
          <h2 className="section-title">Featured Events</h2>
          {featuredEvents.length > 0 ? (
            <div className="events-grid grid grid-3">
              {featuredEvents.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="event-card card"
                >
                  {event.image && (
                    <div className="event-image">
                      <img src={event.image} alt={event.title} />
                    </div>
                  )}
                  <div className="event-content">
                    <span className="event-category">{event.category}</span>
                    <h3 className="event-title">{event.title}</h3>
                    <p className="event-description">{event.description.substring(0, 100)}...</p>
                    <div className="event-details">
                      <div className="event-date">
                        📅 {format(new Date(event.date), 'MMM dd, yyyy')} at {event.time}
                      </div>
                      <div className="event-venue">📍 {event.venue.name}</div>
                      <div className="event-price">₹{event.price}</div>
                    </div>
                    {event.availableTickets > 0 ? (
                      <div className="event-availability">
                        {event.availableTickets} tickets available
                      </div>
                    ) : (
                      <div className="event-sold-out">Sold Out</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="no-events">No featured events at the moment.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

