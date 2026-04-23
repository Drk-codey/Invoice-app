import React, { useEffect, useRef, useState } from 'react';
import type { InvoiceStatus } from '../types/invoice';
import { useInvoices } from '../context/InvoiceContext';

const STATUSES: Array<{ value: InvoiceStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
];

const InvoiceFilter: React.FC = () => {
  const { filter, filteredInvoices, dispatch } = useInvoices();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Live announcement text
  const [announcement, setAnnouncement] = useState('');

  // Selected statuses (multi for visual feedback)
  const [selected, setSelected] = useState<Set<InvoiceStatus | 'all'>>(new Set([filter]));

  useEffect(() => {
    setSelected(new Set([filter]));
  }, [filter]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleToggle = (value: InvoiceStatus | 'all') => {
    setSelected(new Set([value]));
    dispatch({ type: 'SET_FILTER', payload: value });
    setOpen(false);

    // Announce the filter result to screen readers
    const count = filteredInvoices.length;
    const statusLabel = value === 'all' ? '' : ` ${value}`;
    const invoiceWord = count === 1 ? 'invoice' : 'invoices';
    setAnnouncement(
      `Showing ${count}${statusLabel} ${invoiceWord}`
    );
    // Clear after announcement is read so it refires on next change
    setTimeout(() => setAnnouncement(''), 1500);
  };

  

  const label = filter === 'all' ? 'Filter by status' : `Filter: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;

  return (
    <div className="relative" ref={ref}>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 font-bold text-[#0C0E16] dark:text-white hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base">{label}</span>
        <svg
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          width="11"
          height="7"
          viewBox="0 0 11 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-[#252945] rounded-lg shadow-2xl p-6 z-50"
          role="listbox"
          aria-label="Filter invoices by status"
        >
          <ul className="flex flex-col gap-4">
            {STATUSES.map(({ value, label }) => (
              <li key={value}>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected.has(value)}
                    onChange={() => handleToggle(value)}
                    aria-label={`Filter by ${label}`}
                  />
                  <span
                    className={`
                      w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-colors
                      ${selected.has(value)
                        ? 'bg-primary border-primary'
                        : 'border-[#DFE3FA] dark:border-[#252945] group-hover:border-primary bg-[#DFE3FA] dark:bg-[#1E2139]'
                      }
                    `}
                    aria-hidden="true"
                  >
                    {selected.has(value) && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 4L3.5 6L8.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="font-bold text-sm text-[#0C0E16] dark:text-white group-hover:text-primary transition-colors">
                    {label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilter;
