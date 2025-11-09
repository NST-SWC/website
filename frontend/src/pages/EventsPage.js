import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Plus, Calendar, MapPin, Clock, Users, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';

const EventsPage = () => {
  const { userData } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image_url: '',
    max_attendees: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent({
        ...formData,
        max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null
      });
      toast.success('Event created successfully!');
      setCreateDialogOpen(false);
      setFormData({ title: '', description: '', date: '', time: '', location: '', image_url: '', max_attendees: '' });
      loadEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await api.rsvpEvent(eventId);
      toast.success('RSVP successful!');
      loadEvents();
    } catch (error) {
      console.error('Error RSVP:', error);
      toast.error(error.response?.data?.detail || 'Failed to RSVP');
    }
  };

  if (loading) {
    return <div className="text-center text-cyan-400 text-xl">Loading events...</div>;
  }

  const canCreateEvent = userData?.role === 'Mentor' || userData?.role === 'Project Leader';

  return (
    <div className="space-y-6" data-testid="events-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Events</h1>
          <p className="text-gray-400">Join upcoming tech events and workshops</p>
        </div>
        {canCreateEvent && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="glow-button" data-testid="create-event-btn">
                <Plus className="mr-2" size={20} />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/20 text-white max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text">Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4" data-testid="create-event-form">
                <div className="space-y-2">
                  <Label>Event Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="React Workshop"
                    className="bg-white/5 border-white/10 text-white"
                    required
                    data-testid="event-title-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event details..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    required
                    data-testid="event-description-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      required
                      data-testid="event-date-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      required
                      data-testid="event-time-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Room 101 or Zoom Link"
                    className="bg-white/5 border-white/10 text-white"
                    required
                    data-testid="event-location-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Attendees (Optional)</Label>
                  <Input
                    type="number"
                    value={formData.max_attendees}
                    onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
                    placeholder="50"
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="event-max-attendees-input"
                  />
                </div>
                <Button type="submit" className="w-full glow-button" data-testid="submit-event-btn">
                  Create Event
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => {
          const isRegistered = event.attendees?.includes(userData?.id);
          const isFull = event.max_attendees && event.attendees?.length >= event.max_attendees;
          
          return (
            <div key={event.id} className="glass-card p-6 hover-lift" data-testid={`event-card-${event.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-400 mb-4">{event.description}</p>
                </div>
                {isRegistered && (
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <CheckCircle2 size={16} />
                    <span>Registered</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Calendar size={18} className="text-cyan-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Clock size={18} className="text-cyan-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin size={18} className="text-cyan-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Users size={18} className="text-cyan-400" />
                  <span>
                    {event.attendees?.length || 0} attendees
                    {event.max_attendees && ` / ${event.max_attendees} max`}
                  </span>
                </div>
              </div>

              {!isRegistered && (
                <Button
                  onClick={() => handleRSVP(event.id)}
                  disabled={isFull}
                  className={`w-full ${isFull ? 'bg-gray-600 cursor-not-allowed' : 'glow-button'}`}
                  data-testid={`rsvp-btn-${event.id}`}
                >
                  {isFull ? 'Event Full' : 'RSVP Now'}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={40} className="text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
          <p className="text-gray-400 mb-6">Stay tuned for upcoming tech events and workshops!</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;