import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Trophy, TrendingUp, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const { userData } = useAuth();
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [projectsRes, eventsRes, leaderboardRes] = await Promise.all([
        api.getProjects(),
        api.getEvents(),
        api.getLeaderboard()
      ]);
      setProjects(projectsRes.data.slice(0, 4));
      setEvents(eventsRes.data.slice(0, 3));
      setLeaderboard(leaderboardRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      {/* Welcome Section */}
      <div className="glass-card p-8 neon-border">
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Welcome back, {userData?.name}! 👋
        </h1>
        <p className="text-gray-400">Here's what's happening in the dev club today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 hover-lift" data-testid="stats-projects">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Briefcase className="text-cyan-400" size={24} />
            </div>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">{projects.length}</div>
          <div className="text-gray-400 text-sm">Active Projects</div>
        </div>

        <div className="glass-card p-6 hover-lift" data-testid="stats-events">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="text-purple-400" size={24} />
            </div>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">{events.length}</div>
          <div className="text-gray-400 text-sm">Upcoming Events</div>
        </div>

        <div className="glass-card p-6 hover-lift" data-testid="stats-points">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="text-green-400" size={24} />
            </div>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">{userData?.points || 0}</div>
          <div className="text-gray-400 text-sm">Your Points</div>
        </div>

        <div className="glass-card p-6 hover-lift" data-testid="stats-badges">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="text-yellow-400" size={24} />
            </div>
            <TrendingUp className="text-green-400" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">{userData?.badges?.length || 0}</div>
          <div className="text-gray-400 text-sm">Badges Earned</div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Projects</h2>
          <Link to="/projects">
            <Button className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400" data-testid="view-all-projects-btn">
              View All
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <div className="glass-card p-4 hover-lift scanline" data-testid={`project-card-${project.id}`}>
                <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((member, idx) => (
                      <div key={idx} className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full border-2 border-black" />
                    ))}
                    {project.members?.length > 3 && (
                      <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-black flex items-center justify-center text-xs">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                    {project.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
          <Link to="/events">
            <Button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400" data-testid="view-all-events-btn">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="glass-card p-4 hover-lift" data-testid={`event-card-${event.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-cyan-400">{event.date}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{event.time}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{event.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Attendees</div>
                  <div className="text-2xl font-bold text-white">{event.attendees?.length || 0}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
          <Link to="/leaderboard">
            <Button className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400" data-testid="view-leaderboard-btn">
              View Full
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between p-3 glass-card hover-lift" data-testid={`leaderboard-${index + 1}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-yellow-500 text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="text-xs text-gray-400">{user.role}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-cyan-400">{user.points} pts</div>
                <div className="text-xs text-gray-400">{user.badges?.length || 0} badges</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;