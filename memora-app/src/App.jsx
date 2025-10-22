import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { GroupProvider } from './context/GroupContext';
import { useAuth } from './context/AuthContext';
import { useGroup } from './context/GroupContext';
import AuthLayout from './components/auth/AuthLayout';
import Header from './components/shared/Header';
import DailyPrompt from './components/shared/DailyPrompt';
import Navigation from './components/shared/Navigation';
import SearchFilter from './components/shared/SearchFilter';
import ActivityFeed from './components/shared/ActivityFeed';
import Timeline from './components/timeline/Timeline';
import RandomMemory from './components/timeline/RandomMemory';
import StatsView from './components/stats/StatsView';
import GroupSelector from './components/groups/GroupSelector';
import { usePosts } from './hooks/usePosts';
import { useNotifications } from './hooks/useNotifications';
import './styles/globals.css';

function AppContent() {
  const { currentUser, userProfile } = useAuth();
  const { activeGroup, userGroups } = useGroup();
  const { posts, addReaction, addComment, toggleFavorite, voteInPoll } = usePosts(
    activeGroup?.id
  );
  const { notifications } = useNotifications(currentUser?.uid);

  const [activeView, setActiveView] = useState('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [randomMemory, setRandomMemory] = useState(null);
  const [showPrompt, setShowPrompt] = useState(true);

  const dailyPrompt = "Share your favorite meal from this week! 🍽️";

  // Get random memory
  const getRandomMemory = () => {
    if (posts.length > 0) {
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      setRandomMemory(randomPost);
      setActiveView('random');
    }
  };

  // Filter posts
  const filteredPosts = posts
    .filter((post) => {
      if (searchQuery) {
        return post.content.toLowerCase().includes(searchQuery.toLowerCase());
      }
      if (filterBy === 'favorites') {
        return post.favorites?.includes(currentUser?.uid);
      }
      if (filterBy === 'photos') {
        return post.type === 'photo';
      }
      return true;
    })
    .sort((a, b) => b.date - a.date);

  const groupStats = {
    totalPosts: posts.length,
    streak: 7,
    topContributor: userProfile,
  };

  // Show group selector if no active group
  if (!activeGroup && userGroups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Memora!</h2>
          <p className="text-gray-600 mb-6">
            Create your first group to start sharing memories with friends and family.
          </p>
          <GroupSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <Header
        groupStats={groupStats}
        users={activeGroup?.members || []}
        userProfile={userProfile}
      />

      {/* Daily Prompt */}
      <DailyPrompt
        prompt={dailyPrompt}
        show={showPrompt}
        onDismiss={() => setShowPrompt(false)}
      />

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
            currentUser={userProfile}
            onReact={(postId, emoji) => addReaction(postId, emoji, currentUser.uid)}
            onComment={(postId, text) => addComment(postId, currentUser.uid, text)}
            onFavorite={(postId) => toggleFavorite(postId, currentUser.uid)}
            onVote={(postId, optionId) => voteInPoll(postId, optionId, currentUser.uid)}
          />
        )}

        {activeView === 'random' && randomMemory && (
          <RandomMemory
            post={randomMemory}
            currentUser={userProfile}
            onReact={(postId, emoji) => addReaction(postId, emoji, currentUser.uid)}
            onComment={(postId, text) => addComment(postId, currentUser.uid, text)}
            onFavorite={(postId) => toggleFavorite(postId, currentUser.uid)}
            onVote={(postId, optionId) => voteInPoll(postId, optionId, currentUser.uid)}
            onRefresh={getRandomMemory}
          />
        )}

        {activeView === 'stats' && (
          <StatsView users={activeGroup?.members || []} posts={posts} />
        )}
      </main>

      {/* Floating Activity Feed */}
      <ActivityFeed activities={notifications.slice(0, 10)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <AuthChecker />
      </GroupProvider>
    </AuthProvider>
  );
}

function AuthChecker() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <AuthLayout />;
  }

  return <AppContent />;
}

export default App;