import React from 'react';
import { RefreshCw } from 'lucide-react';
import PostCard from './PostCard';

function RandomMemory({ post, currentUser, onReact, onComment, onFavorite, onVote, onRefresh }) {
  if (!post) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🎲 Random Memory</h2>
        <p className="text-gray-500">Here's a blast from the past!</p>
      </div>
      
      <PostCard
        post={post}
        currentUser={currentUser}
        onReact={onReact}
        onComment={onComment}
        onFavorite={onFavorite}
        onVote={onVote}
        highlighted
      />
      
      <button
        onClick={onRefresh}
        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
      >
        <RefreshCw className="w-5 h-5 inline mr-2" />
        Show Another Random Memory
      </button>
    </div>
  );
}

export default RandomMemory;