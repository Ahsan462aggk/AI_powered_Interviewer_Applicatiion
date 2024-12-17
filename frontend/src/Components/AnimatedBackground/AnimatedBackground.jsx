import React from 'react';


const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-red-600 animate-gradient">
        {/* Blur effect overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl">
          {/* Animated shapes */}
          <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full -top-20 -left-20 animate-blob" />
          <div className="absolute w-96 h-96 bg-blue-500/30 rounded-full top-1/3 left-1/2 animate-blob animation-delay-2000" />
          <div className="absolute w-96 h-96 bg-red-500/30 rounded-full bottom-20 right-20 animate-blob animation-delay-4000" />
        </div>
      </div>

      

      
      {/* Content container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 15s ease infinite;
  }
`;
document.head.appendChild(style);

export default AnimatedBackground;