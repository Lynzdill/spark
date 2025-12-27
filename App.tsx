
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProfileCard } from './components/ProfileCard';
import { CheckoutOverlay } from './components/CheckoutOverlay';
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
  const [isCoachMode, setIsCoachMode] = useState(true);
  const [selectedTier, setSelectedTier] = useState<{name: MembershipTier, price: string} | null>(null);

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
        <button onClick={() => setView('dashboard')} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-all">
          Get Started
        </button>
        <button onClick={() => setView('ai-coach')} className="bg-white text-gray-800 border-2 border-gray-100 px-10 py-4 rounded-full text-lg font-bold shadow-md hover:bg-gray-50 transition-all">
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

  // Merchant Dashboard View
  const AdminView = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Merchant Center</h2>
          <p className="text-gray-500">How to get your site live and start collecting payments.</p>
        </div>
        <button onClick={() => setView('profile')} className="text-pink-600 font-semibold flex items-center gap-1 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">🚀</span>
              Go-Live Deployment Checklist
            </h3>
            <div className="space-y-6">
              {[
                { 
                  step: "1. Create Stripe Account", 
                  desc: "Go to Stripe.com and register. Complete your business profile and link your bank account for payouts.",
                  done: true
                },
                { 
                  step: "2. Get API Keys", 
                  desc: "Copy your 'Publishable Key' and 'Secret Key' from the Stripe Developers Dashboard.",
                  done: false
                },
                { 
                  step: "3. Choose a Host", 
                  desc: "Deploy this code to a platform like Vercel, Netlify, or Cloudflare Pages. They handle the scaling for you.",
                  done: false
                },
                { 
                  step: "4. Create Backend Endpoints", 
                  desc: "Stripe requires a small bit of 'Server Side' code to hide your Secret Key. Vercel Functions are perfect for this.",
                  done: false
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${item.done ? 'bg-green-500 text-white' : 'border-2 border-gray-200 text-gray-300'}`}>
                    {item.done ? '✓' : i+1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.step}</h4>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <h3 className="text-xl font-bold mb-2">Want a No-Code Payout?</h3>
            <p className="text-indigo-200 text-sm mb-6">If you don't want to build a backend, use **Stripe Payment Links**. You simply paste the URL into this app's upgrade buttons.</p>
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all">Learn About Payment Links</button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Live Statistics</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Site Status</span>
                <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Sandbox Mode</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Members</span>
                <span className="font-bold">4,102</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Payout Time</span>
                <span className="font-bold">2-3 Days</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-4">Payment Methods</h4>
            <div className="flex flex-wrap gap-2">
              {['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'PayPal'].map(p => (
                <span key={p} className="text-[10px] border border-gray-100 px-2 py-1 rounded bg-gray-50 font-medium">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // The rest of the App views remain consistent...
  const DashboardView = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Discover Matches</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MOCK_USERS.map(user => <ProfileCard key={user.id} profile={user} />)}
      </div>
    </div>
  );

  const AICoachView = () => {
    const handleSend = async () => {
      if (!input.trim()) return;
      const userMsg: Message = { id: Date.now().toString(), senderId: 'me', text: input, timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);
      const result = isCoachMode ? await getDatingAdvice(input) : { text: await startMockDate(input, messages), sources: [] };
      setMessages(prev => [...prev, { id: Date.now().toString(), senderId: 'ai', text: result.text, timestamp: new Date(), isAI: true }]);
      setIsLoading(false);
    };

    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Spark AI Dating Coach</h2>
          <div className="flex bg-gray-100 p-1 rounded-full">
            <button onClick={() => setIsCoachMode(true)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${isCoachMode ? 'bg-white shadow text-pink-600' : 'text-gray-500'}`}>Advice</button>
            <button onClick={() => setIsCoachMode(false)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${!isCoachMode ? 'bg-white shadow text-pink-600' : 'text-gray-500'}`}>Mock Date</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2 no-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.senderId === 'me' ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && <div className="animate-pulse flex space-x-2"><div className="w-2 h-2 bg-gray-300 rounded-full"></div><div className="w-2 h-2 bg-gray-300 rounded-full"></div></div>}
        </div>
        <div className="glass-effect p-2 rounded-2xl flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1 bg-transparent px-4 py-3 outline-none" placeholder="Type a message..." />
          <button onClick={handleSend} className="bg-pink-600 text-white w-12 h-12 rounded-xl flex items-center justify-center">➤</button>
        </div>
      </div>
    );
  };

  const MatchmakingView = () => (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl font-bold mb-4">AI Matchmaker</h2>
          <p className="text-gray-600 mb-6">Ready for a deeper connection? Let Spark AI analyze your soulmate potential.</p>
          <button onClick={async () => { setIsLoading(true); setAnalysis(await generateMatchmakingAnalysis("user", ["match"])); setIsLoading(false); }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">Find My Match</button>
        </div>
        <div className="w-full md:w-2/3 glass-effect rounded-3xl p-8 min-h-[300px]">
          {isLoading ? "Analyzing..." : analysis || "Click 'Find My Match' to begin."}
        </div>
      </div>
    </div>
  );

  const ProfileView = () => {
    const handleUpgradeRequest = (selected: {name: MembershipTier, price: string}) => setSelectedTier(selected);
    const handlePaymentSuccess = () => {
      if (selectedTier) {
        setCurrentUser(prev => ({ ...prev, isPremium: true }));
        setSelectedTier(null);
      }
    };

    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="glass-effect p-8 rounded-3xl text-center">
            <img src={currentUser.imageUrl} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" alt="Profile" />
            <h3 className="text-2xl font-bold">{currentUser.name}, {currentUser.age}</h3>
            <button onClick={() => setView('admin')} className="w-full mt-6 bg-gray-900 text-white py-3 rounded-2xl font-bold text-sm">Merchant Center</button>
            <button className="w-full mt-2 text-red-500 font-bold text-sm">Logout</button>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: MembershipTier.SPARK_PLUS, price: '$9.99', features: ['Unlimited Likes', 'AI Coach Basic'] },
              { name: MembershipTier.SPARK_GOLD, price: '$24.99', features: ['Unlimited Mock Dates', 'Priority Matches'] }
            ].map(tier => (
              <div key={tier.name} className="glass-effect p-8 rounded-3xl border border-white">
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <div className="text-3xl font-black my-4">{tier.price}<span className="text-xs font-normal">/mo</span></div>
                <ul className="mb-6 space-y-2 text-sm text-gray-600">
                  {tier.features.map(f => <li key={f}>✓ {f}</li>)}
                </ul>
                <button 
                  onClick={() => handleUpgradeRequest({name: tier.name, price: tier.price})}
                  className="w-full bg-pink-600 text-white py-3 rounded-2xl font-bold hover:bg-pink-700 transition-all"
                >
                  Upgrade Now
                </button>
              </div>
            ))}
          </div>
        </div>
        {selectedTier && <CheckoutOverlay tier={selectedTier} onClose={() => setSelectedTier(null)} onSuccess={handlePaymentSuccess} />}
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView />;
      case 'ai-coach': return <AICoachView />;
      case 'matchmaking': return <MatchmakingView />;
      case 'profile': return <ProfileView />;
      case 'admin': return <AdminView />;
      default: return <LandingView />;
    }
  };

  return (
    <div className="min-h-screen">
      {view !== 'landing' && <Navbar currentView={view} setView={setView} isPremium={currentUser.isPremium} />}
      <main className="container mx-auto">{renderView()}</main>
    </div>
  );
};

export default App;
