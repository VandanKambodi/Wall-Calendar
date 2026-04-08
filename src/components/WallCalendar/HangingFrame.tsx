import React from 'react';

export const HangingFrame = () => {
  return (
    <div className="relative w-full h-8 sm:h-12 flex justify-center z-10 select-none">
      {/* Hanging string/wire */}
      <svg className="absolute -top-16 sm:-top-24 w-32 sm:w-48 h-20 sm:h-28 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
        <path
          d="M 20 50 L 47 10 Q 50 4, 53 10 L 80 50"
          fill="transparent"
          stroke="#555"
          strokeWidth="1.5"
          className="drop-shadow-sm"
        />
        {/* The nail */}
        <circle cx="50" cy="8.5" r="3.5" fill="#222" className="drop-shadow-md" /> 
        {/* Nail highlight for realism */}
        <circle cx="49" cy="7.5" r="1.5" fill="#555" />
      </svg>
      
      {/* Binding bar body */}
      <div className="absolute bottom-1 sm:bottom-2 left-0 right-0 mx-auto w-[90%] sm:w-[85%] h-3 sm:h-4 bg-gradient-to-b from-neutral-200 to-neutral-400 rounded-full border border-neutral-300 shadow-[0_4px_6px_rgba(0,0,0,0.3)] z-10" />
      
      {/* Spiral rings */}
      <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 mx-auto w-[80%] flex justify-between px-2 sm:px-4 z-20">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Front of ring */}
            <div className="w-2 sm:w-3 h-5 sm:h-8 bg-gradient-to-tr from-neutral-500 via-neutral-100 to-neutral-400 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.6)] border border-neutral-400"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
