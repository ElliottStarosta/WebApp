import React from 'react';
import { Camera, Heart, MessageCircle, TrendingUp, Award, Trophy } from 'lucide-react';
import { BADGES } from '../../data/mockData';

function StatsView({ users, posts }) {
  const stats = {
    totalPosts: posts.length,
    totalReactions: posts.reduce(
      (sum, p) => sum + Object.values(p.reactions || {}).flat().length,
      0
    ),
    totalComments: posts.reduce((sum, p) => sum + p.comments.length, 0),
    mostActive: users.reduce((max, user) => {
      const userPosts = posts.filter((p) => p.author.id === user.id).length;
      return userPosts > (max.posts || 0) ? { user, posts: userPosts } : max;
    }, {}),
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <Camera className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold mb-1">{stats.totalPosts}</p>
          <p className="text-purple-100">Total Memories</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
          <Heart className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold mb-1">{stats.totalReactions}</p>
          <p className="text-pink-100">Total Reactions</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <MessageCircle className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-3xl font-bold mb-1">{stats.totalComments}</p>
          <p className="text-blue-100">Total Comments</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Contribution Leaderboard
        </h3>
        <div className="space-y-3">
          {users.map((user, index) => {
            const userPostCount = posts.filter((p) => p.author.id === user.id).length;
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                        ? 'bg-gray-300 text-gray-700'
                        : index === 2
                        ? 'bg-orange-300 text-orange-900'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: user.color + '20' }}
                  >
                    {user.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{userPostCount} posts</p>
                  </div>
                </div>
                {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          Group Badges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-all"
              style={{ borderColor: badge.color + '40' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl">{badge.icon}</span>
                <div>
                  <p className="font-bold text-gray-800">{badge.name}</p>
                  <p className="text-xs text-gray-500">{badge.requirement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Activity This Month</h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {[3, 7, 2, 5, 8, 4, 6].map((count, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all hover:opacity-80"
                style={{ height: `${(count / 8) * 100}%` }}
              />
              <span className="text-xs text-gray-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsView;