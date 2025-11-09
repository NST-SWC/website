import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LeaderboardPage = () => {
  const { userData } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await api.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-cyan-400 text-xl">Loading leaderboard...</div>;
  }

  const userRank = leaderboard.findIndex(u => u.id === userData?.id) + 1;

  return (
    <div className="space-y-6" data-testid="leaderboard-page">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Trophy size={24} className="text-black" />
        </div>
        <div>
          <h1 className="text-4xl font-bold gradient-text">Leaderboard</h1>
          <p className="text-gray-400">Top contributors and achievers</p>
        </div>
      </div>

      {/* Your Rank Card */}
      {userRank > 0 && (
        <div className="glass-card p-6 neon-border" data-testid="user-rank-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                #{userRank}
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Your Rank</div>
                <div className="text-gray-400">{userData?.name}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold gradient-text">{userData?.points || 0}</div>
              <div className="text-gray-400 text-sm">Total Points</div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="grid md:grid-cols-3 gap-6">
        {leaderboard.slice(0, 3).map((user, index) => {
          const podiumColors = [
            { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-400', icon: Trophy },
            { bg: 'from-gray-300 to-gray-500', text: 'text-gray-400', icon: Medal },
            { bg: 'from-orange-400 to-orange-600', text: 'text-orange-400', icon: Award }
          ];
          const color = podiumColors[index];
          const Icon = color.icon;

          return (
            <div
              key={user.id}
              className={`glass-card p-6 hover-lift text-center border-2 ${
                index === 0 ? 'border-yellow-400/50 md:order-2' :
                index === 1 ? 'border-gray-400/50 md:order-1 md:mt-8' :
                'border-orange-400/50 md:order-3 md:mt-8'
              }`}
              data-testid={`podium-${index + 1}`}
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Icon size={40} className="text-black" />
              </div>
              <div className={`text-4xl font-bold mb-2 ${color.text}`}>#{index + 1}</div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-semibold">{user.name.charAt(0)}</span>
              </div>
              <div className="text-xl font-bold text-white mb-1">{user.name}</div>
              <div className="text-sm text-gray-400 mb-4">{user.role}</div>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${color.text}`}>{user.points}</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${color.text}`}>{user.badges?.length || 0}</div>
                  <div className="text-xs text-gray-500">Badges</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of Leaderboard */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold text-white mb-6">All Rankings</h2>
        <div className="space-y-3">
          {leaderboard.map((user, index) => {
            const isCurrentUser = user.id === userData?.id;
            return (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 glass-card hover-lift ${
                  isCurrentUser ? 'border-2 border-cyan-400/50' : ''
                }`}
                data-testid={`rank-${index + 1}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index < 3
                      ? index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        'bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-white flex items-center space-x-2">
                      <span>{user.name}</span>
                      {isCurrentUser && (
                        <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">You</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{user.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-cyan-400 text-lg">{user.points} pts</div>
                  <div className="text-sm text-gray-400">{user.badges?.length || 0} badges</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;