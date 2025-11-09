import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserPlus, Mail, User, Briefcase, Tag, Github, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { api } from '../utils/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    interests: '',
    github_username: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const interests = formData.interests.split(',').map(i => i.trim()).filter(i => i);
      
      await api.registerRequest({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        interests,
        github_username: formData.github_username || null
      });

      setSuccess(true);
      toast.success('Registration request submitted successfully!');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animated-gradient opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl floating"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl floating"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="glass-card p-12 text-center neon-border">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-black" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-4">Request Submitted!</h1>
            <p className="text-gray-400 mb-6">
              Your registration request has been submitted successfully. Our admin team will review your application and send you login credentials via email once approved.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 animated-gradient opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl floating" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="glass-card p-8 neon-border">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserPlus size={32} className="text-black" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Join the Club</h1>
            <p className="text-gray-400">Request access to NSTSWC Dev Club</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-form">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400"
                  required
                  data-testid="name-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400"
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })} required>
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-cyan-400" data-testid="role-select">
                  <Briefcase className="mr-2" size={20} />
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  <SelectItem value="Student Developer" className="text-white hover:bg-white/10">Student Developer</SelectItem>
                  <SelectItem value="Project Leader" className="text-white hover:bg-white/10">Project Leader</SelectItem>
                  <SelectItem value="Mentor" className="text-white hover:bg-white/10">Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-gray-300">Interests (comma-separated)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="interests"
                  type="text"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  placeholder="React, Node.js, Python, AI/ML"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400"
                  required
                  data-testid="interests-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github" className="text-gray-300">GitHub Username (Optional)</Label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  id="github"
                  type="text"
                  value={formData.github_username}
                  onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                  placeholder="yourusername"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-400"
                  data-testid="github-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full glow-button text-base py-6"
              data-testid="register-submit-btn"
            >
              {loading ? 'Submitting...' : 'Request Access'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;