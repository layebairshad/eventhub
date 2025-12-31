import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', '12');

      const res = await api.get(`/events?${params.toString()}`);
      setEvents(res.data.data);
      setPagination({
        page: res.data.page,
        pages: res.data.pages,
        total: res.data.total,
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    'all',
    'concert',
    'conference',
    'sports',
    'theater',
    'festival',
    'workshop',
    'other',
  ];

  return (
    <div className="events-page">
      <div className="container">
        <div className="page-header">
          <h1>All Events</h1>
          <p>Discover and book your favorite events</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              name="search"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length > 0 ? (
          <>
            <div className="events-grid grid grid-3">
              {events.map((event) => (
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
                    <p className="event-description">
                      {event.description.substring(0, 100)}...
                    </p>
                    <div className="event-details">
                      <div className="event-date">
                        📅 {format(new Date(event.date), 'MMM dd, yyyy')} at{' '}
                        {event.time}
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

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                <span>
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-events">
            <p>No events found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

