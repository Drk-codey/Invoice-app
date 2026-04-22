import React, { useState } from 'react';
import { useInvoices } from '../context/InvoiceContext';
import StatusBadge from './StatusBadge';
import DeleteModal from './DeleteModal';
import { formatCurrency, formatDate } from '../utils/helpers';

const InvoiceDetail: React.FC = () => {
  const { currentInvoice, dispatch } = useInvoices();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!currentInvoice) return null;

  const handleGoBack = () => dispatch({ type: 'SET_CURRENT_INVOICE', payload: null });
  const handleEdit = () => dispatch({ type: 'OPEN_FORM', payload: currentInvoice.id });
  const handleDelete = () => setShowDeleteModal(true);
  const handleConfirmDelete = () => {
    dispatch({ type: 'DELETE_INVOICE', payload: currentInvoice.id });
    setShowDeleteModal(false);
  };
  const handleMarkAsPaid = () => dispatch({ type: 'MARK_AS_PAID', payload: currentInvoice.id });

  const isPaid = currentInvoice.status === 'paid';
  const isDraft = currentInvoice.status === 'draft';

  return (
    <main className="flex-1 px-6 md:px-12 lg:px-0 py-10 md:py-16 pb-32 sm:pb-16 max-w-3xl mx-auto w-full">
      {/* Go back */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-4 mb-8 font-bold text-sm text-[#0C0E16] dark:text-white hover:text-[#7E88C3] dark:hover:text-[#DFE3FA] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        aria-label="Go back to invoice list"
      >
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6.342.886L1.914 5.313l4.428 4.427" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Go back
      </button>

      {/* Status bar */}
      <div className="bg-white dark:bg-[#1E2139] rounded-lg px-6 md:px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 sm:gap-5">
          <span className="text-sm text-[#858BB2] dark:text-[#DFE3FA]">Status</span>
          <StatusBadge status={currentInvoice.status} />
        </div>

        {/* Action buttons */}
        <div className="hidden sm:flex items-center gap-4">
          {!isPaid && (
            <button
              onClick={handleEdit}
              className="px-6 py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#888EB0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleDelete}
            className="px-6 py-4 rounded-full bg-delete text-white font-bold text-sm hover:bg-delete-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-delete"
          >
            Delete
          </button>
          {(isDraft || !isPaid) && (
            <button
              onClick={handleMarkAsPaid}
              disabled={isPaid}
              className="px-6 py-4 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice details card */}
      <div className="bg-white dark:bg-[#1E2139] rounded-lg p-6 md:p-12 shadow-sm">

        {/* Top info row */}
        <div className="flex flex-col sm:flex-row sm:justify-between mb-10 gap-6">
          <div>
            <p className="text-base font-bold text-[#0C0E16] dark:text-white mb-1">
              <span className="text-[#7E88C3]">#</span>{currentInvoice.id}
            </p>
            <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">{currentInvoice.description}</p>
          </div>
          <address className="not-italic text-sm text-[#7E88C3] dark:text-[#DFE3FA] sm:text-right leading-relaxed">
            <p>{currentInvoice.senderAddress.street}</p>
            <p>{currentInvoice.senderAddress.city}</p>
            <p>{currentInvoice.senderAddress.postCode}</p>
            <p>{currentInvoice.senderAddress.country}</p>
          </address>
        </div>

        {/* Dates & client info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">
          <div>
            <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-3">Invoice Date</p>
            <p className="text-base font-bold text-[#0C0E16] dark:text-white">
              {formatDate(currentInvoice.createdAt)}
            </p>
            <div className="mt-6">
              <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-3">Payment Due</p>
              <p className="text-base font-bold text-[#0C0E16] dark:text-white">
                {formatDate(currentInvoice.paymentDue)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-3">Bill To</p>
            <p className="text-base font-bold text-[#0C0E16] dark:text-white mb-2">
              {currentInvoice.clientName}
            </p>
            <address className="not-italic text-sm text-[#7E88C3] dark:text-[#DFE3FA] leading-relaxed">
              <p>{currentInvoice.clientAddress.street}</p>
              <p>{currentInvoice.clientAddress.city}</p>
              <p>{currentInvoice.clientAddress.postCode}</p>
              <p>{currentInvoice.clientAddress.country}</p>
            </address>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] mb-3">Sent to</p>
            <p className="text-base font-bold text-[#0C0E16] dark:text-white break-all">
              {currentInvoice.clientEmail}
            </p>
          </div>
        </div>

        {/* Items table */}
        <div className="bg-[#F9FAFE] dark:bg-[#252945] rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_80px_120px_100px] gap-4 px-8 py-5">
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA]">Item Name</span>
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-center">QTY.</span>
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-right">Price</span>
            <span className="text-sm text-[#7E88C3] dark:text-[#DFE3FA] text-right">Total</span>
          </div>

          {/* Items */}
          <div className="px-6 md:px-8 pb-8 space-y-6 sm:space-y-4">
            {currentInvoice.items.map((item) => (
              <div
                key={item.id}
                className="flex sm:grid sm:grid-cols-[1fr_80px_120px_100px] sm:gap-4 items-center justify-between pt-4 sm:pt-0"
              >
                {/* Mobile: name + qty */}
                <div className="sm:hidden">
                  <p className="text-sm font-bold text-[#0C0E16] dark:text-white">{item.name}</p>
                  <p className="text-sm font-bold text-[#7E88C3] mt-1">
                    {item.quantity} x £ {formatCurrency(item.price)}
                  </p>
                </div>
                {/* Mobile: total */}
                <p className="sm:hidden text-sm font-bold text-[#0C0E16] dark:text-white">
                  £ {formatCurrency(item.total)}
                </p>

                {/* Desktop */}
                <p className="hidden sm:block text-sm font-bold text-[#0C0E16] dark:text-white">{item.name}</p>
                <p className="hidden sm:block text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] text-center">{item.quantity}</p>
                <p className="hidden sm:block text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] text-right">£ {formatCurrency(item.price)}</p>
                <p className="hidden sm:block text-sm font-bold text-[#0C0E16] dark:text-white text-right">£ {formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>

          {/* Amount due footer */}
          <div className="bg-[#373B53] dark:bg-[#0C0E16] rounded-b-lg px-6 md:px-8 py-8 flex items-center justify-between">
            <span className="text-sm text-white">Amount Due</span>
            <span className="text-2xl md:text-3xl font-bold text-white">
              £ {formatCurrency(currentInvoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile action buttons */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1E2139] px-6 py-6 flex justify-center gap-4 shadow-[0_-8px_24px_rgba(0,0,0,0.1)]">
        {!isPaid && (
          <button
            onClick={handleEdit}
            className="px-5 py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Edit
          </button>
        )}
        <button
          onClick={handleDelete}
          className="px-5 py-4 rounded-full bg-delete text-white font-bold text-sm hover:bg-delete-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-delete"
        >
          Delete
        </button>
        {!isPaid && (
          <button
            onClick={handleMarkAsPaid}
            className="px-5 py-4 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={currentInvoice.id}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </main>
  );
};

export default InvoiceDetail;
