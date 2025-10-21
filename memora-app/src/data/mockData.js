// Mock Users
export const MOCK_USERS = [
  { id: 1, name: 'Sarah Chen', avatar: '👩🏻', color: '#FF6B9D' },
  { id: 2, name: 'Mike Johnson', avatar: '👨🏼', color: '#4ECDC4' },
  { id: 3, name: 'Emma Davis', avatar: '👩🏽', color: '#FFE66D' },
  { id: 4, name: 'Alex Kim', avatar: '👨🏻', color: '#A8E6CF' },
];

// Reaction Types
export const REACTION_TYPES = [
  { emoji: '❤️', label: 'love', color: '#FF6B9D' },
  { emoji: '😂', label: 'funny', color: '#FFE66D' },
  { emoji: '😭', label: 'emotional', color: '#95E1D3' },
  { emoji: '🔥', label: 'fire', color: '#FF8B94' },
  { emoji: '🎉', label: 'celebrate', color: '#C7CEEA' },
];

// Mood Tags
export const MOOD_TAGS = ['funny', 'nostalgic', 'exciting', 'chill', 'emotional', 'epic'];

// Badges
export const BADGES = [
  { id: 'memory_keeper', name: 'Memory Keeper', icon: '📸', requirement: '50 posts', color: '#FFD700' },
  { id: 'comedian', name: 'Comedian', icon: '😂', requirement: 'Most 😂 reactions', color: '#FF6B9D' },
  { id: 'squad_glue', name: 'Squad Glue', icon: '💫', requirement: 'Comment on everyone\'s posts', color: '#4ECDC4' },
  { id: 'historian', name: 'Historian', icon: '📚', requirement: 'Oldest memory added', color: '#A8E6CF' },
];

// Sample Posts
export const SAMPLE_POSTS = [
  {
    id: 1,
    type: 'photo',
    content: 'Best pizza night ever! 🍕',
    images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'],
    author: MOCK_USERS[1],
    date: new Date('2025-10-15'),
    reactions: { '❤️': [1, 2], '😂': [3], '🔥': [1, 2, 3, 4] },
    comments: [
      { id: 1, author: MOCK_USERS[0], text: 'This was legendary!', date: new Date() },
      { id: 2, author: MOCK_USERS[2], text: 'We need to go back asap', date: new Date() },
    ],
    tags: ['funny', 'food'],
    taggedUsers: [1, 2, 3],
    location: 'Tony\'s Pizza',
    favorites: [1, 3],
  },
  {
    id: 2,
    type: 'text',
    content: 'Remember when Mike tried to skateboard and face-planted? Classic moment 😂',
    author: MOCK_USERS[2],
    date: new Date('2025-10-10'),
    reactions: { '😂': [1, 2, 3, 4], '😭': [2] },
    comments: [
      { id: 1, author: MOCK_USERS[1], text: 'Why you gotta expose me like that 💀', date: new Date() },
    ],
    tags: ['funny', 'nostalgic'],
    taggedUsers: [2],
  },
  {
    id: 3,
    type: 'poll',
    content: 'Where should we go for spring break?',
    author: MOCK_USERS[0],
    date: new Date('2025-10-18'),
    poll: {
      options: [
        { id: 1, text: 'Beach 🏖️', votes: [1, 2, 3] },
        { id: 2, text: 'Mountains ⛰️', votes: [4] },
        { id: 3, text: 'City trip 🌆', votes: [] },
      ],
    },
    reactions: { '🔥': [2, 3] },
    comments: [],
  },
];

// Sample Activities
export const SAMPLE_ACTIVITIES = [
  { id: 1, type: 'post', user: 'Mike', action: 'added a new memory', time: '2m ago' },
  { id: 2, type: 'comment', user: 'Emma', action: 'commented on your post', time: '5m ago' },
  { id: 3, type: 'reaction', user: 'Alex', action: 'reacted ❤️ to your memory', time: '10m ago' },
];