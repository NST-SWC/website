import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Shield, CheckCircle, XCircle, User, Mail, Briefcase, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const AdminPage = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveDialog, setApproveDialog] = useState({ open: false, user: null });
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const response = await api.getPendingRequests();
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error loading pending requests:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (user) => {
    setApproveDialog({ open: true, user });
    // Generate suggested credentials
    const username = user.name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
    const password = Math.random().toString(36).slice(-10);
    setCredentials({ username, password });
  };

  const submitApproval = async () => {
    try {
      await api.approveUser({
        user_id: approveDialog.user.id,
        username: credentials.username,
        password: credentials.password
      });
      
      toast.success(`User approved! Credentials: ${credentials.username} / ${credentials.password}`);
      setApproveDialog({ open: false, user: null });
      setCredentials({ username: '', password: '' });
      loadPendingRequests();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Failed to approve user');
    }
  };

  if (loading) {
    return <div className="text-center text-cyan-400 text-xl">Loading admin panel...</div>;
  }

  return (
    <div className="space-y-6" data-testid="admin-page">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-500 rounded-lg flex items-center justify-center">
          <Shield size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold gradient-text">Admin Portal</h1>
          <p className="text-gray-400">Manage user registration requests</p>
        </div>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
          <p className="text-gray-400">No pending registration requests at the moment.</p>
        </div>
      ) : (
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Pending Requests <span className="text-cyan-400">({pendingRequests.length})</span>
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((user) => (
              <div key={user.id} className="glass-card p-6 hover-lift" data-testid={`pending-user-${user.id}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-lg">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        <p className="text-sm text-gray-400">
                          Requested {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Mail size={16} className="text-cyan-400" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Briefcase size={16} className="text-cyan-400" />
                        <span className="text-sm">{user.role}</span>
                      </div>
                    </div>

                    {user.interests && user.interests.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Tag size={16} className="text-cyan-400" />
                          <span className="text-sm text-gray-400">Interests:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {user.interests.map((interest, idx) => (
                            <span key={idx} className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.github_username && (
                      <div className="text-sm text-gray-400">
                        GitHub: <span className="text-cyan-400">{user.github_username}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => handleApprove(user)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                      data-testid={`approve-btn-${user.id}`}
                    >
                      <CheckCircle className="mr-2" size={16} />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      data-testid={`reject-btn-${user.id}`}
                    >
                      <XCircle className="mr-2" size={16} />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onOpenChange={(open) => setApproveDialog({ open, user: null })}>
        <DialogContent className="bg-gray-900 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Approve User Registration</DialogTitle>
          </DialogHeader>
          {approveDialog.user && (
            <div className="space-y-6" data-testid="approve-dialog">
              <div className="glass-card p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <User size={20} className="text-cyan-400" />
                  <span className="font-bold text-white">{approveDialog.user.name}</span>
                </div>
                <div className="text-sm text-gray-400">{approveDialog.user.email}</div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="username-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="password-input"
                  />
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <strong>Note:</strong> These credentials will be sent to the user via email. Make sure to save them!
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={submitApproval}
                  className="flex-1 glow-button"
                  data-testid="confirm-approve-btn"
                >
                  Confirm & Approve
                </Button>
                <Button
                  onClick={() => setApproveDialog({ open: false, user: null })}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/5"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;