import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface NotesSectionProps {
  monthKey: string;
  dateRange: DateRange;
}

export const NotesSection = ({ monthKey, dateRange }: NotesSectionProps) => {
  const [notes, setNotes] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'selection'>('monthly');

  const getSelectionKey = () => {
    if (!dateRange.start) return null;
    const startStr = format(dateRange.start, 'yyyy-MM-dd');
    const endStr = dateRange.end ? format(dateRange.end, 'yyyy-MM-dd') : startStr;
    return `calendar-notes-range-${startStr}-${endStr}`;
  };

  const currentKey = viewMode === 'monthly' ? `calendar-notes-${monthKey}` : getSelectionKey();

  useEffect(() => {
    if (dateRange.start) {
      setViewMode('selection');
    } else {
      setViewMode('monthly');
    }
  }, [dateRange.start, dateRange.end]);

  useEffect(() => {
    if (!currentKey) return;
    const saved = localStorage.getItem(currentKey);
    if (saved !== null) {
      setNotes(saved);
    } else {
      setNotes('');
    }
    setIsLoaded(true);
  }, [currentKey]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    if (currentKey) {
      localStorage.setItem(currentKey, val);
    }
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  const headerText = viewMode === 'monthly' ? 'Monthly Notes' : 'Selection Notes';
  const subtitle = viewMode === 'selection' && dateRange.start
    ? (dateRange.end
      ? `${format(dateRange.start, 'MMM d')} - ${format(dateRange.end, 'MMM d')}`
      : format(dateRange.start, 'MMM d, yyyy'))
    : null;

  return (
    <div className="h-full flex flex-col pt-2 pb-6 print:hidden">
      <div className="flex flex-col gap-1 mb-5 px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 decoration-neutral-300">
            {headerText}
          </h3>
          <div className="h-[1px] flex-grow bg-neutral-200 mt-1"></div>
        </div>

        {/* Toggle / Date Subtitle */}
        <div className="flex items-center justify-between h-5">
          <div className="text-xs text-orange-500 font-medium tracking-wide">
            {subtitle}
          </div>
          {dateRange.start && (
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setViewMode('monthly')}
                className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${viewMode === 'monthly' ? 'text-neutral-700' : 'text-neutral-400 hover:text-neutral-600'}`}
              >Month</button>
              <span className="text-neutral-200 text-[10px]">|</span>
              <button
                onClick={() => setViewMode('selection')}
                className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${viewMode === 'selection' ? 'text-orange-600' : 'text-neutral-400 hover:text-orange-400'}`}
              >Selection</button>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex-grow flex flex-col min-h-[300px]">
        {/* Lined paper background */}
        <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e5e5 31px, #e5e5e5 32px)',
            backgroundPosition: '0 -4px'
          }}
        />
        <textarea
          className="w-full flex-grow bg-transparent resize-none outline-none text-neutral-600 font-sans leading-[32px] pt-1 px-1 text-[15px] z-10 custom-scrollbar"
          value={notes}
          onChange={handleChange}
          placeholder={viewMode === 'monthly' ? "Jot down notes, goals, or important events here..." : "Add specific notes for this selected date range..."}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
