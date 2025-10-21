import React from 'react';
import { Plus, Camera } from 'lucide-react';
import PostCard from './PostCard';

function Timeline({ posts, currentUser, onReact, onComment, onFavorite, onVote, onNewPost }) {
  return (
    <>
      {/* New Post Button */}
      <button
        onClick={onNewPost}
        className="w-full mb-6 bg-white rounded-2xl p-4 border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all group"
      >
        <div className="flex items-center justify-center gap-2 text-gray-500 group-hover:text-purple-600">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add a new memory</span>
        </div>
      </button>

      {/* Timeline */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser}
            onReact={onReact}
            onComment={onComment}
            onFavorite={onFavorite}
            onVote={onVote}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No memories found. Start adding some!</p>
        </div>
      )}
    </>
  );
}

export default Timeline;