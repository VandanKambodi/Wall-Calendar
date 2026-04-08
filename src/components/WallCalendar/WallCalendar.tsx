"use client";

import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, format, differenceInDays } from 'date-fns';
import { HangingFrame } from './HangingFrame';
import { HeroSection } from './HeroSection';
import { NotesSection } from './NotesSection';
import { CalendarGrid } from './CalendarGrid';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const WallCalendar = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isMounting, setIsMounting] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setCurrentDate(new Date());
    setIsMounting(false);
  }, []);

  if (isMounting || !currentDate) {
    return <div className="min-h-[800px] w-full max-w-4xl mx-auto opacity-0 animate-pulse bg-neutral-200/50 rounded-lg"></div>;
  }

  const handlePrevMonth = () => {
    setSlideDirection('left');
    setCurrentDate(subMonths(currentDate!, 1));
  };

  const handleNextMonth = () => {
    setSlideDirection('right');
    setCurrentDate(addMonths(currentDate!, 1));
  };

  const handleDateClick = (date: Date) => {
    if (!dateRange.start || (dateRange.start && dateRange.end)) {
      // Start a new selection
      setDateRange({ start: date, end: null });
    } else if (dateRange.start && !dateRange.end) {
      // Complete the selection
      let start = dateRange.start;
      let end = date;
      if (date < start) {
        end = start;
        start = date;
      }
      setDateRange({ start, end });
    }
  };

  const handleDateHover = (date: Date) => {
    setHoverDate(date);
  };

  const monthKey = format(currentDate, 'yyyy-MM');

  // Uses the local file you attached, saved in the public folder
  const getImageUrl = () => {
    return '/hero.jpg';
  };

  let daysSelected = 0;
  if (dateRange.start && dateRange.end) {
    daysSelected = Math.abs(differenceInDays(dateRange.end, dateRange.start)) + 1;
  } else if (dateRange.start && hoverDate) {
    daysSelected = Math.abs(differenceInDays(hoverDate, dateRange.start)) + 1;
  } else if (dateRange.start) {
    daysSelected = 1;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 sm:py-20 flex flex-col items-center">
      <div
        className="relative w-full max-w-3xl perspective-[2000px] z-10"
      >
        <HangingFrame />

        <div
          key={monthKey}
          className={`relative bg-white rounded-lg shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-neutral-200/50 transform-gpu ${slideDirection === 'left' ? 'animate-slide-left' : 'animate-slide-right'}`}
          style={{
            transformOrigin: 'top center',
          }}
        >
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 pointer-events-none rounded-lg" />

          <HeroSection
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            imageUrl={getImageUrl()}
          />

          <div className="flex flex-col md:flex-row p-6 sm:p-10 lg:p-12 gap-8 lg:gap-16 bg-white rounded-b-lg relative z-10">
            {/* Left Column: Notes */}
            <div className="w-full md:w-[35%] min-h-[250px] border-r-0 md:border-r border-neutral-100 pr-0 md:pr-8">
              <NotesSection monthKey={monthKey} dateRange={dateRange} />
            </div>

            {/* Right Column: Calendar */}
            <div className="w-full md:w-[65%] flex flex-col h-full">
              <div className="flex-grow">
                <CalendarGrid
                  currentDate={currentDate}
                  dateRange={dateRange}
                  onDateClick={handleDateClick}
                  onDateHover={handleDateHover}
                  hoverDate={hoverDate}
                />
              </div>

              {/* Range Selected Counter */}
              <div className="mt-2 flex justify-end h-8 items-center">
                {daysSelected > 0 && (
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full transition-all duration-300 transform scale-100 opacity-100">
                    {daysSelected === 1 ? '1 Day Selected' : `${daysSelected} Days Selected`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
