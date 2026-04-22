import React from 'react';
import { useInvoices } from '../context/InvoiceContext';
import InvoiceCard from './InvoiceCard';
import InvoiceFilter from './InvoiceFilter';
import EmptyInvoice from './EmptyInvoice';

const InvoiceList: React.FC = () => {
  const { filteredInvoices, filter, dispatch } = useInvoices();

  const countLabel =
    filteredInvoices.length === 0
      ? 'No invoices'
      : `There are ${filteredInvoices.length} ${filter !== 'all' ? filter + ' ' : ''}invoice${filteredInvoices.length !== 1 ? 's' : ''}`;

  return (
    <main className="flex-1 px-6 md:px-12 lg:px-0 py-12 md:py-16 max-w-3xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between mb-10 md:mb-14">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0C0E16] dark:text-white tracking-tight">
            Invoices
          </h1>
          <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] mt-1 hidden sm:block">
            {countLabel}
          </p>
          <p className="text-sm text-[#888EB0] dark:text-[#DFE3FA] mt-1 sm:hidden">
            {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <InvoiceFilter />

          <button
            onClick={() => dispatch({ type: 'OPEN_FORM' })}
            className="
              flex items-center gap-2 md:gap-4
              bg-primary hover:bg-primary-hover
              text-white font-bold text-sm
              pl-2 pr-4 md:pr-5 py-2 rounded-full
              transition-colors duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            "
            aria-label="Create new invoice"
          >
            <span className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.313 10.023V6.313h3.71V4.69h-3.71V.98H4.69v3.71H.98v1.623h3.71v3.71z" fill="#7C5DFA" />
              </svg>
            </span>
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </header>

      {/* Invoice list */}
      {filteredInvoices.length === 0 ? (
        <EmptyInvoice />
      ) : (
        <ul className="flex flex-col gap-4" aria-label="Invoice list" role="list">
          {filteredInvoices.map((invoice) => (
            <li key={invoice.id}>
              <InvoiceCard
                invoice={invoice}
                onClick={() => dispatch({ type: 'SET_CURRENT_INVOICE', payload: invoice.id })}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default InvoiceList;
