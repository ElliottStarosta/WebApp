import React from 'react';
import { Clock, Dice5, Trophy } from 'lucide-react';

function Navigation({ activeView, onViewChange, onRandomMemory }) {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => onViewChange('timeline')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
            activeView === 'timeline'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Timeline
        </button>
        
        <button
          onClick={onRandomMemory}
          className="px-4 py-2 rounded-full font-medium text-sm bg-white text-gray-600 hover:bg-gray-50 transition-all whitespace-nowrap"
        >
          <Dice5 className="w-4 h-4 inline mr-2" />
          Random Memory
        </button>
        
        <button
          onClick={() => onViewChange('stats')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
            activeView === 'stats'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Trophy className="w-4 h-4 inline mr-2" />
          Stats & Badges
        </button>
      </div>
    </div>
  );
}

export default Navigation;