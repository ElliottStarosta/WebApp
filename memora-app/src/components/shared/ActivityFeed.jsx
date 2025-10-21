import React, { useState } from 'react';
import { Zap } from 'lucide-react';

function ActivityFeed({ activities }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Activity Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center"
      >
        <Zap className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
          {activities.length}
        </span>
      </button>

      {/* Activity Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden animate-slideUp">
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <h3 className="font-bold flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Live Activity
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ActivityFeed;