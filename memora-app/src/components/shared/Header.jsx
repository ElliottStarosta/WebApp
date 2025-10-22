import React, { useState } from 'react';
import { Camera, Flame, Users, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GroupSelector from '../groups/GroupSelector';

function Header({ groupStats, users, userProfile }) {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Memora
              </h1>
              <p className="text-xs text-gray-500">
                {userProfile?.displayName || 'User'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Group Selector */}
            <GroupSelector />

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">
                {groupStats?.streak || 0} day streak!
              </span>
            </div>

            <button className="relative">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
                {users?.length || 0}
              </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-semibold"
              >
                {userProfile?.avatar || '👤'}
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">
                      {userProfile?.displayName}
                    </p>
                    <p className="text-xs text-gray-500">{userProfile?.email}</p>
                  </div>

                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>

                  <button className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700">
                    <Settings className="w-4 h-4" />
                    Account Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all flex items-center gap-2 text-red-600 border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;