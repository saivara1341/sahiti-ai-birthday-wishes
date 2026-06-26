
import React, { useEffect, useState } from 'react';

const BirthdayAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    const today = new Date();
    const birthdayDate = new Date('2025-06-30');
    
    // Check if today is the birthday
    const isBirthday = today.toDateString() === birthdayDate.toDateString();
    
    if (isBirthday) {
      setIsVisible(true);
      setTimeout(() => setShowFireworks(true), 1000);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Birthday Message */}
      <div className="text-center z-10 px-4">
        <div className="animate-bounce mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
            🎉 Happy Birthday 🎉
          </h1>
        </div>
        
        <div className="animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-scale-in">
            SAHITI
          </h2>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Celebrating another year of brilliance! 🌟
          </p>
        </div>

        {/* Fireworks Effect */}
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayAnimation;
