import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-start pt-8 p-4">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-red-500/20 animate-gradient-x" />
      
      {/* Floating elements animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
              opacity: 0.6,
              transform: `scale(${0.8 + Math.random() * 0.5})`
            }}
          >
            {i % 2 === 0 ? '✨' : '🦋'}
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-4xl w-full bg-black/10 rounded-lg backdrop-blur-[2px] p-8">
        {/* Image container with relative positioning */}
        <div className="relative">
          <img
            src="/original.jpeg"
            alt="Our Teachers"
            className="w-full rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300"
          />
          
          {/* Get Started Button - Positioned absolute over the image */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8">
          
            <div className="bg-black flex items-center justify-center">
    <div className="flex items-center p-2 px-6  border-2 border-sky-400 rounded-full">
        <button  onClick={() => navigate('/login')} className="bg-gradient-to-r from-purple-600 via-blue-600 to-red-600 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl  font-bold py-2 px-4 rounded-full">GET STARTED</button>
        <span className="ml-2 text-white text-xl italic">Team Beta Bots</span>
    </div>
</div>
          </div>
        </div>
      </div>
      
      {/* Star animations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `scale(${0.6 + Math.random() * 0.6})`
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThankYouPage;