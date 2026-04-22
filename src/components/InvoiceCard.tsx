import React from 'react';
import type { Invoice } from '../types/invoice';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/helpers';

interface InvoiceCardProps {
  invoice: Invoice;
  onClick: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick }) => {
  return (
    <article
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`Invoice #${invoice.id}, ${invoice.clientName}, ${invoice.status}`}
      className="
        w-full bg-white dark:bg-[#1E2139] rounded-lg px-6 md:px-8 py-6
        border border-white dark:border-[#1E2139]
        hover:border-primary dark:hover:border-primary
        transition-all duration-200 cursor-pointer
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        shadow-sm
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
      "
    >
      {/* Mobile layout */}
      <div className="flex flex-col sm:hidden gap-4">
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold text-[#0C0E16] dark:text-white">
            <span className="text-[#7E88C3]">#</span>{invoice.id}
          </span>
          <span className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">{invoice.clientName}</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-[#7E88C3] mb-1">Due {formatDate(invoice.paymentDue)}</p>
            <p className="text-base font-bold text-[#0C0E16] dark:text-white">
              £ {formatCurrency(invoice.total)}
            </p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex items-center gap-8 flex-1">
        <span className="text-sm font-bold text-[#0C0E16] dark:text-white w-20 flex-shrink-0">
          <span className="text-[#7E88C3]">#</span>{invoice.id}
        </span>
        <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] w-28 flex-shrink-0">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <span className="text-sm text-[#858BB2] dark:text-white flex-1 min-w-0 truncate">
          {invoice.clientName}
        </span>
        <span className="text-base font-bold text-[#0C0E16] dark:text-white w-28 text-right flex-shrink-0">
          £ {formatCurrency(invoice.total)}
        </span>
      </div>

      {/* Status & chevron — desktop */}
      <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
        <StatusBadge status={invoice.status} />
        <svg
          width="7"
          height="10"
          viewBox="0 0 7 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </article>
  );
};

export default InvoiceCard;
