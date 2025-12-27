
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileCard } from './components/ProfileCard';
import { View, UserProfile, Message, MembershipTier } from './types';
import { MOCK_USERS, CURRENT_USER } from './constants';
import { getDatingAdvice, startMockDate, generateMatchmakingAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [datingAdvice, setDatingAdvice] = useState<{text: string, sources: any[]}>({text: '', sources: []});
  const [isCoachMode, setIsCoachMode] = useState(true); // true = advice, false = mock date

  // Landing View
  const LandingView = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        Find Your <span className="gradient-text">Spark</span> <br />
        With AI-Powered Dating
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
        The only dating platform that coaches you through the process. 
        Mock dates, smart matchmaking, and verified connections.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => setView('dashboard')}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-all"
        >
          Get Started
        </button>
        <button 
          onClick={() => setView('ai-coach')}
          className="bg-white text-gray-800 border-2 border-gray-100 px-10 py-4 rounded-full text-lg font-bold shadow-md hover:bg-gray-50 transition-all"
        >
          Try AI Coach
        </button>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
        {[
          { icon: '🤖', title: 'AI Matchmaking', desc: 'Smarter connections based on deep personality analysis.' },
          { icon: '📅', title: 'Mock Dates', desc: 'Practice your conversation skills with our empathetic AI.' },
          { icon: '💡', title: 'Real Advice', desc: 'Get grounded dating tips backed by real-time web search.' }
        ].map((feat, i) => (
          <div key={i} className="glass-effect p-6 rounded-3xl shadow-sm">
            <div className="text-3xl mb-3">{feat.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{feat.title}</h3>
            <p className="text-sm text-gray-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Dashboard View (Explore)
  const DashboardView = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Discover Matches</h2>
        <div className="flex gap-2">
          <button className="p-2 glass-effect rounded-lg"><svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg></button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MOCK_USERS.map(user => (
          <ProfileCard key={user.id} profile={user} />
        ))}
      </div>
    </div>
  );

  // AI Coach View
  const AICoachView = () => {
    const handleSend = async () => {
      if (!input.trim()) return;
      const userMsg: Message = { id: Date.now().toString(), senderId: 'me', text: input, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      if (isCoachMode) {
        const result = await getDatingAdvice(input);
        setDatingAdvice(result);
        const aiMsg: Message = { id: (Date.now() + 1).toString(), senderId: 'ai', text: result.text, timestamp: new Date(), isAI: true };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const reply = await startMockDate(input, messages);
        const aiMsg: Message = { id: (Date.now() + 1).toString(), senderId: 'ai', text: reply, timestamp: new Date(), isAI: true };
        setMessages(prev => [...prev, aiMsg]);
      }
      setIsLoading(false);
    };

    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Spark AI Dating Coach</h2>
            <p className="text-sm text-gray-500">Practice makes perfect connections.</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-full">
            <button 
              onClick={() => { setIsCoachMode(true); setMessages([]); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isCoachMode ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500'}`}
            >
              Get Advice
            </button>
            <button 
              onClick={() => { setIsCoachMode(false); setMessages([]); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isCoachMode ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500'}`}
            >
              Mock Date
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4 no-scrollbar p-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center">
                {isCoachMode ? '💡' : '🥂'}
              </div>
              <p className="max-w-xs text-center">
                {isCoachMode 
                  ? "Ask anything! Like 'How do I start a conversation?' or 'What should I wear for a coffee date?'" 
                  : "Maya is ready to start our coffee date. Say 'Hi' to begin our practice session!"}
              </p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                msg.senderId === 'me' 
                  ? 'bg-pink-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
                {msg.text}
                {msg.isAI && isCoachMode && datingAdvice.sources.length > 0 && (
                   <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Grounding Sources:</p>
                      <div className="flex flex-wrap gap-2">
                        {datingAdvice.sources.map((chunk, i) => chunk.web && (
                          <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-[10px] text-pink-500 hover:underline truncate max-w-[150px]">
                            {chunk.web.title}
                          </a>
                        ))}
                      </div>
                   </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="glass-effect p-2 rounded-2xl flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isCoachMode ? "Ask for dating advice..." : "Chat with Maya..."}
            className="flex-1 bg-transparent px-4 py-3 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-pink-600 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Matchmaking Analysis
  const MatchmakingView = () => {
    const handleMatchmaking = async () => {
      setIsLoading(true);
      const userStr = JSON.stringify(currentUser);
      const matchesStr = MOCK_USERS.map(u => `${u.name}: ${u.interests.join(',')}`);
      const result = await generateMatchmakingAnalysis(userStr, matchesStr);
      setAnalysis(result);
      setIsLoading(false);
    };

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl font-bold mb-6">AI Matchmaker</h2>
            <p className="text-gray-600 mb-8">
              Our advanced algorithm looks beyond photos. We analyze your shared values, hobbies, and personality style to find true compatibility.
            </p>
            <button 
              onClick={handleMatchmaking}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? 'Analyzing...' : 'Run Analysis'}
              {!isLoading && '✨'}
            </button>
          </div>
          <div className="w-full md:w-2/3 glass-effect rounded-3xl p-8 min-h-[400px]">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <p className="text-indigo-600 font-medium">Spark AI is crunching the data...</p>
               </div>
            ) : analysis ? (
              <div className="prose prose-indigo">
                <h3 className="text-xl font-bold text-indigo-900 mb-4">Your Match Analysis</h3>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {analysis}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-4 bg-indigo-50 rounded-2xl">
                      <span className="text-xs font-bold text-indigo-400 uppercase">Top Suggestion</span>
                      <p className="text-lg font-bold text-indigo-900">{MOCK_USERS[0].name}</p>
                   </div>
                   <div className="p-4 bg-pink-50 rounded-2xl">
                      <span className="text-xs font-bold text-pink-400 uppercase">Compatibility</span>
                      <p className="text-lg font-bold text-pink-900">94% Highly Compatible</p>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to find your match?</h3>
                <p className="text-gray-500 max-w-xs">Click the button to generate your personalized compatibility report.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Membership / Profile View
  const ProfileView = () => {
    const [tier, setTier] = useState<MembershipTier>(MembershipTier.FREE);

    const handleUpgrade = (selectedTier: MembershipTier) => {
      setTier(selectedTier);
      setCurrentUser(prev => ({ ...prev, isPremium: selectedTier !== MembershipTier.FREE }));
      alert(`Success! You've upgraded to ${selectedTier}.`);
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-effect p-8 rounded-3xl text-center shadow-sm">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img src={currentUser.imageUrl} alt="Me" className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg" />
                {currentUser.isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-2 rounded-full shadow-md">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold">{currentUser.name}, {currentUser.age}</h3>
              <p className="text-gray-500 mb-6">{currentUser.location}</p>
              <div className="flex justify-center gap-4 mb-8">
                <div className="text-center">
                  <div className="font-bold text-gray-900">24</div>
                  <div className="text-xs text-gray-400 uppercase">Likes</div>
                </div>
                <div className="w-px h-8 bg-gray-100" />
                <div className="text-center">
                  <div className="font-bold text-gray-900">12</div>
                  <div className="text-xs text-gray-400 uppercase">Matches</div>
                </div>
              </div>
              <button className="w-full bg-white border border-gray-100 py-3 rounded-2xl font-semibold shadow-sm hover:bg-gray-50 transition-all mb-3">Edit Profile</button>
              <button className="w-full text-red-500 font-semibold py-2">Logout</button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-bold">Membership Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  name: MembershipTier.SPARK_PLUS, 
                  price: '$9.99/mo', 
                  features: ['Unlimited Likes', 'See Who Likes You', 'Spark AI Dating Coach Basic'], 
                  color: 'pink' 
                },
                { 
                  name: MembershipTier.SPARK_GOLD, 
                  price: '$24.99/mo', 
                  features: ['Unlimited Mock Dates', 'Priority Matchmaking', 'Profile Boost', 'Ad-Free Experience'], 
                  color: 'purple' 
                }
              ].map((mTier) => (
                <div key={mTier.name} className="glass-effect rounded-3xl p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {tier === mTier.name && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Active</div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{mTier.name}</h3>
                  <div className="text-3xl font-extrabold text-gray-900 mb-6">{mTier.price}</div>
                  <ul className="space-y-3 mb-8">
                    {mTier.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleUpgrade(mTier.name)}
                    className={`w-full py-3 rounded-2xl font-bold transition-all ${
                      tier === mTier.name ? 'bg-gray-100 text-gray-400 cursor-default' : 'bg-pink-600 text-white hover:bg-pink-700 shadow-lg shadow-pink-200'
                    }`}
                  >
                    {tier === mTier.name ? 'Current Plan' : 'Select Plan'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case 'landing': return <LandingView />;
      case 'dashboard': return <DashboardView />;
      case 'ai-coach': return <AICoachView />;
      case 'matchmaking': return <MatchmakingView />;
      case 'profile': return <ProfileView />;
      case 'messages': return (
        <div className="flex items-center justify-center h-[70vh] text-gray-500">
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">No messages yet</h3>
            <p className="max-w-xs mx-auto">Start matching to begin conversations with real people! Until then, you can chat with our AI Coach.</p>
            <button onClick={() => setView('ai-coach')} className="mt-6 text-pink-600 font-bold hover:underline">Go to AI Coach</button>
          </div>
        </div>
      );
      default: return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen">
      {view !== 'landing' && (
        <Navbar currentView={view} setView={setView} isPremium={currentUser.isPremium} />
      )}
      <main className="container mx-auto">
        {renderView()}
      </main>
      
      {/* Persistent CTA on Mobile Dashboard */}
      {view === 'dashboard' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
          <button 
            onClick={() => setView('ai-coach')}
            className="bg-pink-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce"
          >
            <span>Ask AI Coach</span>
            <span className="text-lg">✨</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
