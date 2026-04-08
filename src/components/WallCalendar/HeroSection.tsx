import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  imageUrl?: string;
}

export const HeroSection = ({ currentDate, onPrevMonth, onNextMonth, imageUrl }: HeroSectionProps) => {
  const defaultImage = "https://images.unsplash.com/photo-1506744902015-62da873cd37c?auto=format&fit=crop&q=80&w=1200&h=600";

  return (
    <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-neutral-100 rounded-t-lg select-none z-10 border-b border-neutral-200">
      {/* Background Image */}
      {/* Fallback pattern in case image fails or takes time to load */}
      <div className="absolute inset-0 bg-neutral-200 pattern-dots pattern-neutral-300 pattern-bg-transparent pattern-size-4 pattern-opacity-20" />

      <img
        src={imageUrl || defaultImage}
        alt="Calendar hero"
        className="absolute inset-0 w-full h-full object-cover origin-center transition-transform duration-1000"
        draggable={false}
      />

      {/* Physical texture over image */}
      <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />

      {/* Diagonal Overlays inspired by real print design - Moved to bottom */}
      <div
        className="absolute inset-0 bg-red-900/40 mix-blend-multiply transition-colors"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 70% , 0 45%)' }}
      />
      {/* Main geometric color block - Lower Third */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/90 to-red-600/90 shadow-2xl backdrop-blur-sm"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 80%, 0 55%)' }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 w-full h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
        <div className="flex justify-end items-start w-full">
          <div className="flex space-x-2 z-10">
            <button
              onClick={onPrevMonth}
              className="p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/40 active:bg-black/60 text-white backdrop-blur-md transition-all shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-white/10"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </button>
            <button
              onClick={onNextMonth}
              className="p-2 sm:p-3 rounded-full bg-black/20 hover:bg-black/40 active:bg-black/60 text-white backdrop-blur-md transition-all shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-white/10"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Date Label at Bottom Left */}
        <div className="flex flex-col text-white drop-shadow-md relative z-10 w-full pb-2">
          <span className="text-5xl sm:text-7xl lg:text-8xl font-sans font-bold tracking-tighter uppercase leading-none">
            {format(currentDate, 'MMMM')}
          </span>
          <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-orange-200 tracking-widest pl-1 mt-1 mb-1">
            {format(currentDate, 'yyyy')}
          </span>
        </div>
      </div>

      {/* Inner subtle shadow for card depth */}
      <div className="absolute inset-0 shadow-[inset_0_5px_15px_rgba(0,0,0,0.1)] pointer-events-none" />
    </div>
  );
};
