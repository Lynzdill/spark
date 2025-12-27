
import React, { useState } from 'react';
import { MembershipTier } from '../types';
import { processStripePayment } from '../services/paymentService';

interface CheckoutOverlayProps {
  tier: { name: MembershipTier; price: string };
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutOverlay: React.FC<CheckoutOverlayProps> = ({ tier, onClose, onSuccess }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep('processing');
    
    const result = await processStripePayment(tier.name, tier.price);
    
    if (result.success) {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2500);
    } else {
      setStep('details');
      setError(result.error || "Payment failed. Please try again.");
    }
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-md rounded-3xl p-10 text-center shadow-2xl scale-in-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Verified!</h2>
          <p className="text-gray-500 mb-6">Welcome to {tier.name}. Your account has been upgraded.</p>
          <div className="text-xs text-gray-400 font-mono">Activating Premium features...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-indigo-900 p-8 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">SparkAI Secure Payment</span>
            <div className="flex gap-2">
               <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">SSL Secure</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{tier.name} Plan</h2>
          <div className="text-4xl font-black mt-2">{tier.price}<span className="text-sm font-normal text-indigo-300">/month</span></div>
        </div>

        <form onSubmit={handlePayment} className="p-8 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Card Number</label>
            <div className="relative">
              <input type="text" placeholder="4242 4242 4242 4242" required className="w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-indigo-500" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 grayscale opacity-50">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-3" alt="Mastercard" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Expiry Date</label>
              <input type="text" placeholder="MM / YY" required className="w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-indigo-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">CVC</label>
              <input type="password" placeholder="•••" required className="w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-indigo-500" />
            </div>
          </div>

          <button 
            type="submit"
            disabled={step === 'processing'}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 disabled:bg-indigo-400"
          >
            {step === 'processing' ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying with Bank...
              </>
            ) : (
              `Complete Purchase`
            )}
          </button>
          
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            By clicking "Complete Purchase", you authorize SparkAI to charge your card {tier.price} monthly until you cancel. 
            All transactions are processed by Stripe.
          </p>
        </form>
      </div>
    </div>
  );
};
