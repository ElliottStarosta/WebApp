import React, { useState, useEffect } from 'react';
import Header from './components/shared/Header';
import DailyPrompt from './components/shared/DailyPrompt';
import Navigation from './components/shared/Navigation';
import SearchFilter from './components/shared/SearchFilter';
import ActivityFeed from './components/shared/ActivityFeed';
import Timeline from './components/timeline/Timeline';
import RandomMemory from './components/timeline/RandomMemory';
import StatsView from './components/stats/StatsView';
import { MOCK_USERS, SAMPLE_POSTS, SAMPLE_ACTIVITIES } from './data/mockData';
import './styles/globals.css';

function App() {
  const [currentUser] = useState(MOCK_USERS[0]);
  const [activeView, setActiveView] = useState('timeline');
  const [posts, setPosts] = useState([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [randomMemory, setRandomMemory] = useState(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [groupStats, setGroupStats] = useState({
    totalPosts: 0,
    streak: 7,
    topContributor: MOCK_USERS[1],
  });

  const dailyPrompt = "Share your favorite meal from this week! 🍽️";

  // Initialize with sample posts
  useEffect(() => {
    setPosts(SAMPLE_POSTS);
    setGroupStats({ ...groupStats, totalPosts: SAMPLE_POSTS.length });
  }, []);

  // Add reaction to a post
  const addReaction = (postId, emoji) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const reactions = { ...post.reactions };
          if (!reactions[emoji]) reactions[emoji] = [];

          if (reactions[emoji].includes(currentUser.id)) {
            reactions[emoji] = reactions[emoji].filter((id) => id !== currentUser.id);
          } else {
            reactions[emoji].push(currentUser.id);
          }

          return { ...post, reactions };
        }
        return post;
      })
    );
  };

  // Add comment to a post
  const addComment = (postId, text) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                author: currentUser,
                text,
                date: new Date(),
              },
            ],
          };
        }
        return post;
      })
    );
  };

  // Toggle favorite on a post
  const toggleFavorite = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const favorites = post.favorites || [];
          return {
            ...post,
            favorites: favorites.includes(currentUser.id)
              ? favorites.filter((id) => id !== currentUser.id)
              : [...favorites, currentUser.id],
          };
        }
        return post;
      })
    );
  };

  // Vote in a poll
  const voteInPoll = (postId, optionId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId && post.poll) {
          const options = post.poll.options.map((opt) => ({
            ...opt,
            votes: opt.votes.filter((id) => id !== currentUser.id),
          }));

          const selectedOption = options.find((opt) => opt.id === optionId);
          if (selectedOption) {
            selectedOption.votes.push(currentUser.id);
          }

          return { ...post, poll: { ...post.poll, options } };
        }
        return post;
      })
    );
  };

  // Get random memory
  const getRandomMemory = () => {
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    setRandomMemory(randomPost);
    setActiveView('random');
  };

  // Filter posts
  const filteredPosts = posts
    .filter((post) => {
      if (searchQuery) {
        return post.content.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterBy === 'favorites') {
        return post.favorites?.includes(currentUser.id);
      }
      if (filterBy === 'photos') {
        return post.type === 'photo';
      }
      return true;
    })
    .sort((a, b) => b.date - a.date);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <Header groupStats={groupStats} users={MOCK_USERS} />

      {/* Daily Prompt */}
      <DailyPrompt prompt={dailyPrompt} show={showPrompt} onDismiss={() => setShowPrompt(false)} />

      {/* Navigation */}
      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
        onRandomMemory={getRandomMemory}
      />

      {/* Search & Filter (only show on timeline view) */}
      {activeView === 'timeline' && (
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
        />
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        {activeView === 'timeline' && (
          <Timeline
            posts={filteredPosts}
            currentUser={currentUser}
            onReact={addReaction}
            onComment={addComment}
            onFavorite={toggleFavorite}
            onVote={voteInPoll}
            onNewPost={() => setShowNewPost(!showNewPost)}
          />
        )}

        {activeView === 'random' && (
          <RandomMemory
            post={randomMemory}
            currentUser={currentUser}
            onReact={addReaction}
            onComment={addComment}
            onFavorite={toggleFavorite}
            onVote={voteInPoll}
            onRefresh={getRandomMemory}
          />
        )}

        {activeView === 'stats' && <StatsView users={MOCK_USERS} posts={posts} />}
      </main>

      {/* Floating Activity Feed */}
      <ActivityFeed activities={SAMPLE_ACTIVITIES} />
    </div>
  );
}

export default App;