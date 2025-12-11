
import React, { useEffect, useState } from 'react';
import { PartyPopper, X, Star, Heart, Sparkles, Trophy } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "You're taking great care of yourself! Keep it up!",
  "Small steps every day lead to big results. Proud of you!",
  "Health is wealth, and you're investing wisely today.",
  "Another day, another victory. You're doing amazing!",
  "Consistency is key, and you unlocked it today!",
  "Your future self will thank you for this dedication."
];

const CelebrationModal = ({ isOpen, onClose }) => {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Pick a random quote
      setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Confetti Elements (Pure CSS Animation simulation) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fade-in"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `bounce ${1 + Math.random()}s infinite`,
              animationDelay: `${Math.random()}s`
            }}
          >
            {i % 3 === 0 ? (
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
            ) : i % 3 === 1 ? (
              <div className="w-3 h-3 bg-teal-400 rotate-45" />
            ) : (
              <div className="w-2 h-4 bg-rose-400 rounded-sm" />
            )}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-slide-up text-center p-8 border-4 border-white">
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-teal-50 to-transparent" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-yellow-200 blur-xl opacity-50 rounded-full animate-pulse"></div>
            <div className="bg-gradient-to-tr from-yellow-400 to-orange-400 p-5 rounded-full shadow-lg shadow-orange-200 rotate-12 transform hover:rotate-0 transition-transform duration-500">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            {/* Floating Icons */}
            <Star className="absolute -top-2 -right-4 w-6 h-6 text-yellow-400 fill-yellow-400 animate-bounce delay-100" />
            <Sparkles className="absolute -bottom-2 -left-4 w-6 h-6 text-teal-400 animate-pulse delay-200" />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
            Daily Goal Complete!
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            You've taken all your meds for today.
          </p>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8 w-full">
            <Heart className="w-6 h-6 text-rose-500 mx-auto mb-3" />
            <p className="text-indigo-900 font-bold text-lg italic leading-relaxed">
              "{quote}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] transition-all shadow-xl shadow-slate-200"
          >
            Awesome, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;
