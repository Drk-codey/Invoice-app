import React, { useEffect, useRef } from 'react';

interface DeleteModalProps {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ invoiceId, onConfirm, onCancel }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Focus trap & ESC key
  useEffect(() => {
    cancelRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab') {
        // Simple focus trap between the two buttons
        const focusable = document.querySelectorAll<HTMLElement>('#delete-modal button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        id="delete-modal"
        className="relative bg-white dark:bg-[#1E2139] rounded-lg shadow-2xl p-12 max-w-md w-full z-10"
      >
        <h2
          id="delete-modal-title"
          className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-3"
        >
          Confirm Deletion
        </h2>
        <p
          id="delete-modal-desc"
          className="text-[#888EB0] dark:text-[#DFE3FA] mb-8 leading-relaxed"
        >
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-6 py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold hover:bg-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#888EB0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-4 rounded-full bg-delete text-white font-bold hover:bg-delete-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
