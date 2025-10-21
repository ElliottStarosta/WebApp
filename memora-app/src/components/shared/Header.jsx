import React from 'react';
import { Camera, Flame, Users } from 'lucide-react';

function Header({ groupStats, users }) {
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
              <p className="text-xs text-gray-500">Camp Crew 2025</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-700">
                {groupStats.streak} day streak!
              </span>
            </div>
            
            <button className="relative">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
                {users.length}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;