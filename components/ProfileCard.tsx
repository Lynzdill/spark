
import React from 'react';
import { UserProfile } from '../types';

interface ProfileCardProps {
  profile: UserProfile;
  onLike?: () => void;
  onPass?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onLike, onPass }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="relative aspect-[3/4]">
        <img 
          src={profile.imageUrl} 
          alt={profile.name} 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
            {profile.isPremium && (
              <span className="bg-yellow-400 text-yellow-900 text-[10px] px-1.5 py-0.5 rounded font-bold">PRO</span>
            )}
          </div>
          <p className="text-sm text-gray-200 mb-3 line-clamp-2">{profile.bio}</p>
          <div className="flex flex-wrap gap-2">
            {profile.interests.slice(0, 3).map(interest => (
              <span key={interest} className="text-[10px] px-2 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {profile.matchScore && (
          <div className="absolute top-4 right-4 bg-pink-500 text-white w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white/30">
            <span className="text-sm font-bold leading-none">{profile.matchScore}%</span>
            <span className="text-[8px] uppercase">Match</span>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 p-4 bg-white">
        <button 
          onClick={onPass}
          className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button 
          onClick={onLike}
          className="w-14 h-14 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200 transition-all shadow-sm"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
