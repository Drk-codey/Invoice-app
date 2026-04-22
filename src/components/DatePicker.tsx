import React, { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay, isSameDay, isValid, parseISO } from 'date-fns';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  id?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, className, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const displayDate = value ? parseISO(value) : new Date();
  const safeDisplayDate = isValid(displayDate) ? displayDate : new Date();

  const [currentMonth, setCurrentMonth] = useState(safeDisplayDate);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const bDay = String(selected.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${bDay}`);
    setIsOpen(false);
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = startOfMonth(currentMonth);
  const emptyCells = getDay(startDay); // 0 (Sun) to 6 (Sat)
  const prevMonthDays = getDaysInMonth(subMonths(currentMonth, 1));
  const nextDays = (7 - ((emptyCells + daysInMonth) % 7)) % 7;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        className={`${className} flex items-center justify-between cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        id={id}
      >
        <span className="font-bold text-[#0C0E16] dark:text-white text-sm">
          {format(safeDisplayDate, 'dd MMM yyyy')}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-[#7E88C3]">
          <path d="M14 2h-1V0h-2v2H5V0H3v2H2C.89 2 0 2.89 0 4v10c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2Zm0 12H2V7h12v7ZM6 9H4v2h2V9Zm4 0H8v2h2V9Zm4 0h-2v2h2V9Z"/>
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white dark:bg-[#252945] rounded-xl shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.25)] p-6 w-[260px]">
          <div className="flex justify-between items-center mb-6 px-1">
            <button type="button" onClick={prevMonth} className="text-[#7C5DFA] hover:text-[#9277FF] focus:outline-none p-1">
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 1L2 5l4 4" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
            <span className="font-bold text-[#0C0E16] dark:text-white text-sm tracking-wide">
              {format(currentMonth, 'MMM yyyy')}
            </span>
            <button type="button" onClick={nextMonth} className="text-[#7C5DFA] hover:text-[#9277FF] focus:outline-none p-1">
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth="2"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-4 text-center">
            {Array.from({ length: emptyCells }).map((_, i) => (
              <span key={`empty-${i}`} className="text-sm font-bold text-[#0C0E16]/10 dark:text-[#DFE3FA]/10">
                {prevMonthDays - emptyCells + i + 1}
              </span>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isSelected = isSameDay(dateObj, safeDisplayDate);
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={(e) => {
                     e.stopPropagation();
                     handleDateClick(day);
                  }}
                  className={`text-sm font-bold hover:text-[#7C5DFA] focus:outline-none transition-colors ${
                    isSelected 
                      ? 'text-[#7C5DFA]' 
                      : 'text-[#0C0E16] dark:text-[#DFE3FA]'
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {Array.from({ length: nextDays }).map((_, i) => (
              <span key={`next-${i}`} className="text-sm font-bold text-[#0C0E16]/10 dark:text-[#DFE3FA]/10">
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
