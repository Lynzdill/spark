
import { UserProfile } from './types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 26,
    bio: 'Avid hiker and coffee enthusiast. Looking for someone to share sunrise adventures with.',
    interests: ['Hiking', 'Coffee', 'Photography', 'Travel'],
    location: 'San Francisco, CA',
    imageUrl: 'https://picsum.photos/seed/sarah/400/500',
    isPremium: false,
    matchScore: 94
  },
  {
    id: '2',
    name: 'James',
    age: 30,
    bio: 'Software engineer by day, jazz pianist by night. Let\'s talk about tech or tunes.',
    interests: ['Jazz', 'Coding', 'Cooking', 'Wine'],
    location: 'Brooklyn, NY',
    imageUrl: 'https://picsum.photos/seed/james/400/500',
    isPremium: true,
    matchScore: 88
  },
  {
    id: '3',
    name: 'Elena',
    age: 28,
    bio: 'Art historian with a love for street food and indie cinema.',
    interests: ['Art', 'Movies', 'Street Food', 'Reading'],
    location: 'Chicago, IL',
    imageUrl: 'https://picsum.photos/seed/elena/400/500',
    isPremium: false,
    matchScore: 82
  },
  {
    id: '4',
    name: 'David',
    age: 32,
    bio: 'Fitness coach who loves dogs and beach volleyball. Always up for a challenge.',
    interests: ['Fitness', 'Dogs', 'Sports', 'Beaches'],
    location: 'Austin, TX',
    imageUrl: 'https://picsum.photos/seed/david/400/500',
    isPremium: true,
    matchScore: 75
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'me',
  name: 'Alex',
  age: 29,
  bio: 'Explorer of life, lover of puzzles and deep conversations.',
  interests: ['Gaming', 'Puzzles', 'Philosophy', 'Nature'],
  location: 'Seattle, WA',
  imageUrl: 'https://picsum.photos/seed/me/400/400',
  isPremium: false
};
