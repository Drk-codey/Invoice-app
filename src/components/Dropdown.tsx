import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: number;
  label: string;
}

interface DropdownProps {
  id?: string;
  options: Option[];
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ id, options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectedOption = options.find((o) => o.value === value) || options[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        id={id}
        className={`${className} flex items-center justify-between cursor-pointer w-full text-left`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-[#0C0E16] dark:text-white text-sm">
          {selectedOption ? selectedOption.label : ''}
        </span>
        <svg 
          width="11" 
          height="7" 
          viewBox="0 0 11 7" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" />
        </svg>
      </button>

      {isOpen && (
        <ul 
          className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-white dark:bg-[#252945] rounded-lg shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden"
          role="listbox"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              className={`
                px-6 py-4 cursor-pointer text-sm font-bold transition-colors
                ${index !== options.length - 1 ? 'border-b border-[#DFE3FA] dark:border-[#1E2139]' : ''}
                text-[#0C0E16] dark:text-[#DFE3FA] hover:text-[#7C5DFA] dark:hover:text-[#9277FF]
              `}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option.value === value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
