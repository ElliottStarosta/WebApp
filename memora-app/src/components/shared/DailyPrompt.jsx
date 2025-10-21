import React from 'react';
import { Zap, X } from 'lucide-react';

function DailyPrompt({ prompt, show, onDismiss }) {
  if (!show) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 mt-4">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <button 
          onClick={onDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="font-semibold mb-1">Daily Memory Prompt</p>
            <p className="text-white/90 text-sm">{prompt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyPrompt;