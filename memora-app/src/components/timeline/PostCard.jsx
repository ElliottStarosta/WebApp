import React, { useState } from 'react';
import { Star, MapPin, User, Smile, MessageCircle, Send } from 'lucide-react';
import { REACTION_TYPES } from '../../data/mockData';

function PostCard({ post, currentUser, onReact, onComment, onFavorite, onVote, highlighted }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showReactions, setShowReactions] = useState(false);

  const totalReactions = Object.values(post.reactions || {}).flat().length;
  const isFavorited = post.favorites?.includes(currentUser.id);

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
        highlighted ? 'ring-4 ring-purple-500' : ''
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: post.author.color + '20' }}
            >
              {post.author.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{post.author.name}</p>
              <p className="text-xs text-gray-500">
                {post.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <button
            onClick={() => onFavorite(post.id)}
            className={`p-2 rounded-full transition-all ${
              isFavorited ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <Star className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {post.images && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <img src={post.images[0]} alt="Memory" className="w-full h-96 object-cover" />
          </div>
        )}

        <p className="text-gray-800 mb-3">{post.content}</p>

        {/* Tags */}
        {(post.tags || post.location || post.taggedUsers) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.location && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {post.location}
              </span>
            )}
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {post.taggedUsers && (
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.taggedUsers.length} tagged
              </span>
            )}
          </div>
        )}

        {/* Poll */}
        {post.poll && (
          <div className="mb-4 space-y-2">
            {post.poll.options.map((option) => {
              const totalVotes = post.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
              const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
              const hasVoted = option.votes.includes(currentUser.id);

              return (
                <button
                  key={option.id}
                  onClick={() => onVote(post.id, option.id)}
                  className={`w-full p-3 rounded-xl border-2 transition-all relative overflow-hidden ${
                    hasVoted
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-gray-50'
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-purple-100 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="font-medium text-gray-800">{option.text}</span>
                    <span className="text-sm text-gray-600">
                      {option.votes.length} vote{option.votes.length !== 1 ? 's' : ''} (
                      {Math.round(percentage)}%)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Reactions Bar */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Object.entries(post.reactions || {}).map(
              ([emoji, users]) =>
                users.length > 0 && (
                  <span key={emoji} className="text-sm">
                    {emoji} {users.length}
                  </span>
                )
            )}
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-all"
            >
              <Smile className="w-4 h-4 inline mr-1" />
              React
            </button>

            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-xl p-2 flex gap-1 z-10 animate-scaleIn">
                {REACTION_TYPES.map(({ emoji, label }) => (
                  <button
                    key={label}
                    onClick={() => {
                      onReact(post.id, emoji);
                      setShowReactions(false);
                    }}
                    className="w-10 h-10 hover:scale-125 transition-transform rounded-full hover:bg-gray-100"
                    title={label}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-all"
          >
            <MessageCircle className="w-4 h-4 inline mr-1" />
            Comment
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="space-y-3 mb-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: comment.author.color + '20' }}
                >
                  {comment.author.avatar}
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl px-3 py-2">
                  <p className="font-semibold text-sm text-gray-800">{comment.author.name}</p>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
              className="flex-1 px-4 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSubmitComment}
              className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;