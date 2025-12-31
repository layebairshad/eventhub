import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'concert',
    venue: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    date: '',
    time: '',
    image: '',
    totalTickets: '',
    availableTickets: '',
    price: '',
    organizer: '',
    featured: false,
    tags: '',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'events') {
        const res = await api.get('/events?limit=100');
        setEvents(res.data.data);
      } else {
        const res = await api.get('/bookings');
        setBookings(res.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleEventFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('venue.')) {
      const venueField = name.split('.')[1];
      setEventForm({
        ...eventForm,
        venue: { ...eventForm.venue, [venueField]: value },
      });
    } else {
      setEventForm({
        ...eventForm,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = {
        ...eventForm,
        tags: eventForm.tags.split(',').map((tag) => tag.trim()),
        totalTickets: parseInt(eventForm.totalTickets),
        availableTickets: parseInt(eventForm.availableTickets),
        price: parseFloat(eventForm.price),
      };

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, eventData);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', eventData);
        toast.success('Event created successfully');
      }

      setShowEventForm(false);
      setEditingEvent(null);
      setEventForm({
        title: '',
        description: '',
        category: 'concert',
        venue: { name: '', address: '', city: '', state: '', zipCode: '' },
        date: '',
        time: '',
        image: '',
        totalTickets: '',
        availableTickets: '',
        price: '',
        organizer: '',
        featured: false,
        tags: '',
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      date: event.date.split('T')[0],
      time: event.time,
      image: event.image || '',
      totalTickets: event.totalTickets.toString(),
      availableTickets: event.availableTickets.toString(),
      price: event.price.toString(),
      organizer: event.organizer,
      featured: event.featured,
      tags: event.tags?.join(', ') || '',
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={activeTab === 'events' ? 'active' : ''}
            onClick={() => setActiveTab('events')}
          >
            Events
          </button>
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </div>

        {activeTab === 'events' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Manage Events</h2>
              <button
                onClick={() => {
                  setShowEventForm(true);
                  setEditingEvent(null);
                  setEventForm({
                    title: '',
                    description: '',
                    category: 'concert',
                    venue: { name: '', address: '', city: '', state: '', zipCode: '' },
                    date: '',
                    time: '',
                    image: '',
                    totalTickets: '',
                    availableTickets: '',
                    price: '',
                    organizer: '',
                    featured: false,
                    tags: '',
                  });
                }}
                className="btn btn-primary"
              >
                Create Event
              </button>
            </div>

            {showEventForm && (
              <div className="event-form-modal">
                <div className="modal-content card">
                  <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                  <form onSubmit={handleCreateEvent}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={eventForm.title}
                          onChange={handleEventFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          name="category"
                          value={eventForm.category}
                          onChange={handleEventFormChange}
                          required
                        >
                          <option value="concert">Concert</option>
                          <option value="conference">Conference</option>
                          <option value="sports">Sports</option>
                          <option value="theater">Theater</option>
                          <option value="festival">Festival</option>
                          <option value="workshop">Workshop</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        name="description"
                        value={eventForm.description}
                        onChange={handleEventFormChange}
                        required
                        rows="4"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={eventForm.date}
                          onChange={handleEventFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Time *</label>
                        <input
                          type="time"
                          name="time"
                          value={eventForm.time}
                          onChange={handleEventFormChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Venue Name *</label>
                      <input
                        type="text"
                        name="venue.name"
                        value={eventForm.venue.name}
                        onChange={handleEventFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Venue Address *</label>
                      <input
                        type="text"
                        name="venue.address"
                        value={eventForm.venue.address}
                        onChange={handleEventFormChange}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="venue.city"
                          value={eventForm.venue.city}
                          onChange={handleEventFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          name="venue.state"
                          value={eventForm.venue.state}
                          onChange={handleEventFormChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Zip Code *</label>
                        <input
                          type="text"
                          name="venue.zipCode"
                          value={eventForm.venue.zipCode}
                          onChange={handleEventFormChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Total Tickets *</label>
                        <input
                          type="number"
                          name="totalTickets"
                          value={eventForm.totalTickets}
                          onChange={handleEventFormChange}
                          required
                          min="1"
                        />
                      </div>
                      <div className="form-group">
                        <label>Available Tickets *</label>
                        <input
                          type="number"
                          name="availableTickets"
                          value={eventForm.availableTickets}
                          onChange={handleEventFormChange}
                          required
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label>Price (₹) *</label>
                        <input
                          type="number"
                          name="price"
                          value={eventForm.price}
                          onChange={handleEventFormChange}
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Organizer *</label>
                      <input
                        type="text"
                        name="organizer"
                        value={eventForm.organizer}
                        onChange={handleEventFormChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="url"
                        name="image"
                        value={eventForm.image}
                        onChange={handleEventFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Tags (comma separated)</label>
                      <input
                        type="text"
                        name="tags"
                        value={eventForm.tags}
                        onChange={handleEventFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="featured"
                          checked={eventForm.featured}
                          onChange={handleEventFormChange}
                        />
                        Featured Event
                      </label>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {editingEvent ? 'Update Event' : 'Create Event'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEventForm(false);
                          setEditingEvent(null);
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="events-list">
              {events.map((event) => (
                <div key={event._id} className="admin-event-card card">
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-meta">
                      {event.category} • {format(new Date(event.date), 'MMM dd, yyyy')} •{' '}
                      {event.availableTickets}/{event.totalTickets} tickets • ₹{event.price}
                    </p>
                  </div>
                  <div className="event-actions">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="btn btn-outline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-section">
            <h2>All Bookings</h2>
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="admin-booking-card card">
                  <div className="booking-info">
                    <h3>{booking.event.title}</h3>
                    <p>
                      <strong>User:</strong> {booking.user.name} ({booking.user.email})
                    </p>
                    <p>
                      <strong>Reference:</strong> {booking.bookingReference}
                    </p>
                    <p>
                      <strong>Tickets:</strong> {booking.tickets} •{' '}
                      <strong>Total:</strong> ₹{booking.totalAmount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Status:</strong> {booking.status} •{' '}
                      <strong>Payment:</strong> {booking.paymentStatus}
                    </p>
                    <p>
                      <strong>Date:</strong>{' '}
                      {format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

