import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Code2, Users, Calendar, Trophy, Zap, Github, MessageSquare, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: Code2,
      title: 'Collaborative Projects',
      description: 'Build real-world projects with fellow developers using modern tech stacks'
    },
    {
      icon: Calendar,
      title: 'Tech Events',
      description: 'Participate in hackathons, workshops, and coding sessions'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn from experienced developers and industry professionals'
    },
    {
      icon: Trophy,
      title: 'Gamification',
      description: 'Earn badges, climb leaderboards, and showcase your achievements'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 animated-gradient opacity-20"></div>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle absolute bg-cyan-400/30 animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">NSTSWC Dev Club</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                data-testid="login-link"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                data-testid="register-link"
                className="glow-button text-sm"
              >
                Join Club
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full border border-cyan-500/30 mb-6">
              <Zap size={16} className="text-cyan-400" />
              <span className="text-sm text-gray-300">Welcome to the Future of Dev Learning</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="gradient-text">Build, Learn, Grow</span>
              <br />
              <span className="text-white">Together as Developers</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join NSTSWC Dev Club - where passionate developers collaborate on cutting-edge projects,
              participate in tech events, and level up their skills together.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                to="/register"
                data-testid="hero-join-btn"
                className="glow-button text-lg px-8 py-4 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight size={20} />
              </Link>
              <a
                href="#features"
                className="px-8 py-4 rounded-lg border border-white/20 hover:border-cyan-400/50 hover:bg-white/5 transition-all text-lg"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              { label: 'Active Members', value: '200+' },
              { label: 'Projects Built', value: '50+' },
              { label: 'Events Hosted', value: '30+' },
              { label: 'Skills Learned', value: '100+' },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center hover-lift">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold gradient-text mb-4">Why Join Us?</h2>
            <p className="text-xl text-gray-400">Everything you need to become a better developer</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-card p-6 hover-lift scanline">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Tech We Love</h2>
            <p className="text-gray-400 mb-8">Collaborate using modern technologies and frameworks</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {['React', 'Node.js', 'Python', 'MongoDB', 'Firebase', 'Docker', 'AWS', 'GitHub'].map((tech) => (
                <div key={tech} className="px-6 py-3 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/50 transition-all">
                  <span className="font-mono text-cyan-400">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 neon-border">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join our community of passionate developers and start building amazing projects today
            </p>
            <Link
              to="/register"
              data-testid="cta-register-btn"
              className="glow-button text-lg px-8 py-4 inline-flex items-center space-x-2"
            >
              <span>Request Access</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold gradient-text">NSTSWC Dev Club</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            © 2025 NSTSWC Dev Club. Building the future, one commit at a time.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;