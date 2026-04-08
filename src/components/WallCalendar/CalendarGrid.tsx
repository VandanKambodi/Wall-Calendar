import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  isWithinInterval,
} from 'date-fns';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface CalendarGridProps {
  currentDate: Date;
  dateRange: DateRange;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date) => void;
  hoverDate: Date | null;
}

export const CalendarGrid = ({ currentDate, dateRange, onDateClick, onDateHover, hoverDate }: CalendarGridProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);

  // Week starts on Monday (1)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = 'd';
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = '';

  const isInRange = (day: Date) => {
    if (dateRange.start && dateRange.end) {
      const start = dateRange.start < dateRange.end ? dateRange.start : dateRange.end;
      const end = dateRange.end > dateRange.start ? dateRange.end : dateRange.start;
      return isWithinInterval(day, { start, end });
    }

    if (dateRange.start && hoverDate) {
      const start = dateRange.start < hoverDate ? dateRange.start : hoverDate;
      const end = hoverDate > dateRange.start ? hoverDate : dateRange.start;
      return isWithinInterval(day, { start, end });
    }
    return false;
  };

  type EventCategory = 'holiday' | 'exam' | 'meeting' | 'deadline';
  interface CalendarEvent { id: string; dateKey: string; title: string; category: EventCategory; }

  const STATIC_EVENTS: CalendarEvent[] = [
    { id: '1', dateKey: '01-01', title: 'New Year', category: 'holiday' },
    { id: '2', dateKey: '02-14', title: 'Valentine', category: 'holiday' },
    { id: '3', dateKey: '07-04', title: 'July 4th', category: 'holiday' },
    { id: '4', dateKey: '10-31', title: 'Halloween', category: 'holiday' },
    { id: '5', dateKey: '11-28', title: 'Thanksgiving', category: 'holiday' },
    { id: '6', dateKey: '12-25', title: 'Christmas', category: 'holiday' },
  ];

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const md = format(date, 'MM-dd');
    return STATIC_EVENTS.filter(e => e.dateKey === md);
  };

  const categoryColors: Record<EventCategory, string> = {
    holiday: 'bg-red-500',
    exam: 'bg-purple-500',
    meeting: 'bg-blue-500',
    deadline: 'bg-orange-500',
  };

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      const dayEvents = getEventsForDate(day);

      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      const isSelectedStart = dateRange.start && isSameDay(day, dateRange.start);
      const isSelectedEnd = dateRange.end && isSameDay(day, dateRange.end);

      const isSelectedStartHover = hoverDate && dateRange.start && !dateRange.end && isSameDay(day, hoverDate) && hoverDate < dateRange.start;
      const isSelectedEndHover = hoverDate && dateRange.start && !dateRange.end && isSameDay(day, hoverDate) && hoverDate > dateRange.start;

      const isStartBox = isSelectedStart || isSelectedStartHover;
      const isEndBox = isSelectedEnd || isSelectedEndHover;

      const inRange = isInRange(day);
      const isWeekend = i === 5 || i === 6; // index 5 is Saturday, 6 is Sunday when starting on Monday

      // When day is exactly start and we hover same day
      const isSingleDayHover = dateRange.start && !dateRange.end && hoverDate && isSameDay(day, hoverDate) && isSameDay(hoverDate, dateRange.start);

      days.push(
        <div
          key={day.toString()}
          onMouseEnter={() => onDateHover(cloneDay)}
          onClick={() => onDateClick(cloneDay)}
          className={`
            relative flex flex-col justify-center items-center py-2 sm:py-4 transition-colors cursor-pointer group
            ${!isCurrentMonth ? 'text-neutral-300' : isWeekend ? 'text-neutral-500' : 'text-neutral-700'}
          `}
        >
          {/* Subtle line at the top for calendar grid feeling */}
          <div className="absolute top-0 left-2 right-2 border-t border-neutral-100 hidden sm:block" />

          {/* Highlight background for ranges */}
          {inRange && (
            <div className={`
              absolute inset-y-1 sm:inset-y-2 left-0 right-0 bg-orange-50 z-0
              ${isStartBox || isSingleDayHover ? 'rounded-l-full sm:rounded-l-lg ml-1 sm:ml-2' : ''} 
              ${isEndBox || isSingleDayHover ? 'rounded-r-full sm:rounded-r-lg mr-1 sm:mr-2' : ''}
            `} />
          )}

          {/* Hover indicator for non-range days */}
          {!inRange && hoverDate && isSameDay(day, hoverDate) && (
            <div className="absolute inset-y-1 sm:inset-y-2 left-1 sm:left-2 right-1 sm:right-2 bg-neutral-50 rounded-lg z-0 transition-colors" />
          )}

          {/* Date Number Pill */}
          <span className={`
            z-10 w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-sm sm:text-lg transition-all duration-300
            ${isSelectedStart || isSelectedEnd ? 'bg-orange-600 text-white shadow-lg font-bold scale-105 transform' : ''}
            ${!isSelectedStart && !isSelectedEnd ? 'group-hover:text-orange-600 font-medium' : ''}
            ${isToday && !isSelectedStart && !isSelectedEnd ? 'bg-neutral-100 text-orange-600 font-bold ring-1 ring-neutral-200' : ''}
          `}>
            {formattedDate}
          </span>

          {/* Holiday Label - Rendered above the number so it doesn't clash with dots */}
          {dayEvents.some(e => e.category === 'holiday') && isCurrentMonth && (
            <span className="absolute top-0 sm:top-1 text-[7px] sm:text-[8px] font-bold text-red-500 opacity-75 truncate w-full text-center px-1 pointer-events-none z-10 hidden sm:block uppercase tracking-wider">
              {dayEvents.find(e => e.category === 'holiday')?.title}
            </span>
          )}

          {/* Event Dots - Placed directly beneath the number pill */}
          {dayEvents.length > 0 && (
            <div className="absolute bottom-1 sm:bottom-1.5 w-full flex justify-center gap-1 px-1 pointer-events-none z-10">
              {dayEvents.filter(e => e.category !== 'holiday').map(event => (
                <div
                  key={event.id}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${categoryColors[event.category]} shadow-sm transform transition-transform group-hover:scale-125`}
                  title={event.title}
                />
              ))}
            </div>
          )}

        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-x-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <div className="flex flex-col h-full selector-none pt-2">
      <div className="grid grid-cols-7 mb-4 px-1">
        {weekDays.map((wd, i) => (
          <div key={wd} className={`
            text-center text-[10px] sm:text-xs font-bold tracking-[0.15em]
            ${i >= 5 ? 'text-neutral-300' : 'text-neutral-400'}
          `}>
            {wd}
          </div>
        ))}
      </div>
      <div className="flex-grow flex flex-col justify-between">
        {rows}
      </div>
    </div>
  );
};
