
export type View = 'landing' | 'dashboard' | 'matchmaking' | 'ai-coach' | 'profile' | 'messages' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  imageUrl: string;
  isPremium: boolean;
  matchScore?: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
}

export interface ChatSession {
  id: string;
  participant: UserProfile | { name: string; imageUrl: string; id: string };
  messages: Message[];
}

export enum MembershipTier {
  FREE = 'Free',
  SPARK_PLUS = 'Spark Plus',
  SPARK_GOLD = 'Spark Gold'
}
