import React, { useEffect, useRef, useState } from 'react';
import type { Invoice, InvoiceItem } from '../types/invoice';
import { useInvoices } from '../context/InvoiceContext';
import { useFormValidation } from '../hooks/useFormValidation';
import {
  calculateInvoiceTotal,
  calculateItemTotal,
  calculatePaymentDue,
  formatCurrency,
  generateId,
  generateItemId,
} from '../utils/helpers';
import DatePicker from './DatePicker';
import Dropdown from './Dropdown';

const PAYMENT_TERMS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
];

const emptyInvoice = (): Partial<Invoice> => ({
  createdAt: new Date().toISOString().slice(0, 10),
  paymentTerms: 30,
  description: '',
  clientName: '',
  clientEmail: '',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [],
});

const InvoiceForm: React.FC = () => {
  const { isFormOpen, editingInvoice, dispatch } = useInvoices();
  const { errors, validate, clearError } = useFormValidation();
  const [form, setForm] = useState<Partial<Invoice>>(emptyInvoice());
  const firstInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Load editing invoice or reset
  useEffect(() => {
    if (editingInvoice) {
      setForm({ ...editingInvoice });
    } else {
      setForm(emptyInvoice());
    }
  }, [editingInvoice, isFormOpen]);

  // Focus first input when opened
  useEffect(() => {
    if (isFormOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isFormOpen]);

  // ESC to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFormOpen) dispatch({ type: 'CLOSE_FORM' });
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isFormOpen, dispatch]);

  const handleClose = () => dispatch({ type: 'CLOSE_FORM' });

  const updateField = (path: string, value: any) => {
    clearError(path.replace(/\./g, '_'));
    setForm((prev) => {
      const next = { ...prev };
      const parts = path.split('.');
      if (parts.length === 1) {
        (next as any)[parts[0]] = value;
      } else if (parts.length === 2) {
        (next as any)[parts[0]] = { ...(next as any)[parts[0]], [parts[1]]: value };
      }
      return next;
    });
  };

  const addItem = () => {
    const newItem: InvoiceItem = { id: generateItemId(), name: '', quantity: 1, price: 0, total: 0 };
    setForm((prev) => ({ ...prev, items: [...(prev.items || []), newItem] }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    clearError(`item_${index}_${field}`);
    setForm((prev) => {
      const items = [...(prev.items || [])];
      const item = { ...items[index], [field]: value };
      if (field === 'quantity' || field === 'price') {
        item.total = calculateItemTotal({
          ...item,
          quantity: field === 'quantity' ? Number(value) : item.quantity,
          price: field === 'price' ? Number(value) : item.price,
        });
      }
      items[index] = item;
      return { ...prev, items };
    });
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index),
    }));
  };

  const buildInvoice = (status: Invoice['status']): Invoice => {
    const items = (form.items || []).map((item) => ({
      ...item,
      total: calculateItemTotal(item),
    }));
    const total = calculateInvoiceTotal(items);
    const createdAt = form.createdAt || new Date().toISOString().slice(0, 10);
    const paymentTerms = form.paymentTerms || 30;

    return {
      id: editingInvoice?.id || generateId(),
      createdAt,
      paymentDue: calculatePaymentDue(createdAt, paymentTerms),
      description: form.description || '',
      paymentTerms,
      clientName: form.clientName || '',
      clientEmail: form.clientEmail || '',
      status,
      senderAddress: form.senderAddress || { street: '', city: '', postCode: '', country: '' },
      clientAddress: form.clientAddress || { street: '', city: '', postCode: '', country: '' },
      items,
      total,
    };
  };

  const handleSaveAsDraft = () => {
    if (!validate(form, true)) return;
    const invoice = buildInvoice('draft');
    if (editingInvoice) {
      dispatch({ type: 'UPDATE_INVOICE', payload: invoice });
    } else {
      dispatch({ type: 'ADD_INVOICE', payload: invoice });
    }
    dispatch({ type: 'CLOSE_FORM' });
  };

  const handleSaveAndSend = () => {
    if (!validate(form, false)) return;
    const invoice = buildInvoice('pending');
    if (editingInvoice) {
      dispatch({ type: 'UPDATE_INVOICE', payload: invoice });
    } else {
      dispatch({ type: 'ADD_INVOICE', payload: invoice });
    }
    dispatch({ type: 'CLOSE_FORM' });
  };

  const handleSaveEdit = () => {
    if (!validate(form, false)) return;
    const invoice = buildInvoice(editingInvoice?.status || 'pending');
    dispatch({ type: 'UPDATE_INVOICE', payload: invoice });
    dispatch({ type: 'CLOSE_FORM' });
  };

  const inputClass = (errorKey?: string) =>
    `w-full px-5 py-4 rounded-md border font-bold text-sm text-[#0C0E16] dark:text-white bg-white dark:bg-[#1E2139] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors placeholder-[#888EB0] ${
      errorKey && errors[errorKey]
        ? 'border-delete focus:border-delete'
        : 'border-[#DFE3FA] dark:border-[#252945] hover:border-primary dark:hover:border-primary focus:border-primary dark:focus:border-primary'
    }`;

  const labelClass = (errorKey?: string) =>
    `block text-xs mb-2 font-medium ${
      errorKey && errors[errorKey] ? 'text-delete' : 'text-[#7E88C3] dark:text-[#DFE3FA]'
    }`;

  if (!isFormOpen) return null;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-30 md:block hidden"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={formRef}
        className="
          fixed top-[72px] md:top-0 left-0 md:left-[103px]
          w-full md:max-w-[616px] lg:max-w-[719px]
          h-[calc(100vh-72px)] md:h-screen
          bg-white dark:bg-[#141625]
          z-40
          flex flex-col
          rounded-r-[20px]
          shadow-2xl
        "
        role="dialog"
        aria-modal="true"
        aria-label={editingInvoice ? `Edit Invoice #${editingInvoice.id}` : 'New Invoice'}
      >
        {/* Header */}
        <div className="px-6 md:px-14 pt-8 md:pt-14 pb-0 flex-shrink-0">
          {/* Back button (mobile) */}
          <button
            onClick={handleClose}
            className="flex items-center gap-4 mb-6 md:hidden text-[#0C0E16] dark:text-white hover:text-primary font-bold text-sm transition-colors focus:outline-none"
          >
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.342.886L1.914 5.313l4.428 4.427" stroke="#7C5DFA" strokeWidth="2" />
            </svg>
            Go back
          </button>
          <h1 className="text-2xl font-bold text-[#0C0E16] dark:text-white mb-0">
            {editingInvoice ? (
              <>Edit <span className="text-[#888EB0]">#</span>{editingInvoice.id}</>
            ) : (
              'New Invoice'
            )}
          </h1>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 md:px-14 pb-4 pt-10">

          {/* Bill From */}
          <section aria-labelledby="bill-from-heading" className="mb-10">
            <h2 id="bill-from-heading" className="text-primary font-bold text-sm mb-6">Bill From</h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between">
                  <label htmlFor="sender-street" className={labelClass('senderStreet')}>Street Address</label>
                  {errors.senderStreet && <span className="text-delete text-xs">{errors.senderStreet}</span>}
                </div>
                <input
                  ref={firstInputRef}
                  id="sender-street"
                  className={inputClass('senderStreet')}
                  value={form.senderAddress?.street || ''}
                  onChange={(e) => updateField('senderAddress.street', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="sender-city" className={labelClass('senderCity')}>City</label>
                    {errors.senderCity && <span className="text-delete text-xs">{errors.senderCity}</span>}
                  </div>
                  <input
                    id="sender-city"
                    className={inputClass('senderCity')}
                    value={form.senderAddress?.city || ''}
                    onChange={(e) => updateField('senderAddress.city', e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="sender-postcode" className={labelClass('senderPostCode')}>Post Code</label>
                    {errors.senderPostCode && <span className="text-delete text-xs">{errors.senderPostCode}</span>}
                  </div>
                  <input
                    id="sender-postcode"
                    className={inputClass('senderPostCode')}
                    value={form.senderAddress?.postCode || ''}
                    onChange={(e) => updateField('senderAddress.postCode', e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="sender-country" className={labelClass('senderCountry')}>Country</label>
                    {errors.senderCountry && <span className="text-delete text-xs">{errors.senderCountry}</span>}
                  </div>
                  <input
                    id="sender-country"
                    className={inputClass('senderCountry')}
                    value={form.senderAddress?.country || ''}
                    onChange={(e) => updateField('senderAddress.country', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Bill To */}
          <section aria-labelledby="bill-to-heading" className="mb-10">
            <h2 id="bill-to-heading" className="text-primary font-bold text-sm mb-6">Bill To</h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between">
                  <label htmlFor="client-name" className={labelClass('clientName')}>Client's Name</label>
                  {errors.clientName && <span className="text-delete text-xs">{errors.clientName}</span>}
                </div>
                <input
                  id="client-name"
                  className={inputClass('clientName')}
                  value={form.clientName || ''}
                  onChange={(e) => updateField('clientName', e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <label htmlFor="client-email" className={labelClass('clientEmail')}>Client's Email</label>
                  {errors.clientEmail && <span className="text-delete text-xs">{errors.clientEmail}</span>}
                </div>
                <input
                  id="client-email"
                  type="email"
                  className={inputClass('clientEmail')}
                  placeholder="e.g. email@example.com"
                  value={form.clientEmail || ''}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                />
              </div>
              <div>
                <div className="flex justify-between">
                  <label htmlFor="client-street" className={labelClass('clientStreet')}>Street Address</label>
                  {errors.clientStreet && <span className="text-delete text-xs">{errors.clientStreet}</span>}
                </div>
                <input
                  id="client-street"
                  className={inputClass('clientStreet')}
                  value={form.clientAddress?.street || ''}
                  onChange={(e) => updateField('clientAddress.street', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="client-city" className={labelClass('clientCity')}>City</label>
                    {errors.clientCity && <span className="text-delete text-xs">{errors.clientCity}</span>}
                  </div>
                  <input
                    id="client-city"
                    className={inputClass('clientCity')}
                    value={form.clientAddress?.city || ''}
                    onChange={(e) => updateField('clientAddress.city', e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="client-postcode" className={labelClass('clientPostCode')}>Post Code</label>
                    {errors.clientPostCode && <span className="text-delete text-xs">{errors.clientPostCode}</span>}
                  </div>
                  <input
                    id="client-postcode"
                    className={inputClass('clientPostCode')}
                    value={form.clientAddress?.postCode || ''}
                    onChange={(e) => updateField('clientAddress.postCode', e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="client-country" className={labelClass('clientCountry')}>Country</label>
                    {errors.clientCountry && <span className="text-delete text-xs">{errors.clientCountry}</span>}
                  </div>
                  <input
                    id="client-country"
                    className={inputClass('clientCountry')}
                    value={form.clientAddress?.country || ''}
                    onChange={(e) => updateField('clientAddress.country', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Invoice Details */}
          <section aria-labelledby="invoice-details-heading" className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <div className="flex justify-between">
                  <label htmlFor="invoice-date" className={labelClass('createdAt')}>Invoice Date</label>
                  {errors.createdAt && <span className="text-delete text-xs">{errors.createdAt}</span>}
                </div>
                <DatePicker
                  id="invoice-date"
                  className={inputClass('createdAt')}
                  value={form.createdAt || ''}
                  onChange={(val) => updateField('createdAt', val)}
                />
              </div>
              <div>
                <label htmlFor="payment-terms" className={labelClass()}>Payment Terms</label>
                <Dropdown
                  id="payment-terms"
                  className={inputClass()}
                  options={PAYMENT_TERMS}
                  value={form.paymentTerms || 30}
                  onChange={(val) => updateField('paymentTerms', val)}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="project-description" className={labelClass('description')}>Project Description</label>
                {errors.description && <span className="text-delete text-xs">{errors.description}</span>}
              </div>
              <input
                id="project-description"
                className={inputClass('description')}
                placeholder="e.g. Graphic Design Service"
                value={form.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>
          </section>

          {/* Item List */}
          <section aria-labelledby="item-list-heading" className="mb-10">
            <h2 id="item-list-heading" className="text-[#777F98] font-bold text-lg mb-6">Item List</h2>

            {/* Column headers — desktop only */}
            {(form.items || []).length > 0 && (
              <div className="hidden sm:grid grid-cols-[1fr_64px_100px_80px_20px] gap-4 mb-4">
                <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] font-medium">Item Name</span>
                <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] font-medium">Qty.</span>
                <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] font-medium">Price</span>
                <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] font-medium">Total</span>
                <span />
              </div>
            )}

            <div className="space-y-4">
              {(form.items || []).map((item, index) => (
                <div key={item.id} className="grid grid-cols-[1fr_64px_100px_80px_20px] gap-4 items-center sm:items-center">
                  {/* Mobile: name spans full row */}
                  <div className="col-span-5 sm:col-span-1">
                    <label htmlFor={`item-name-${index}`} className="block text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2 sm:hidden font-medium">
                      Item Name
                    </label>
                    <input
                      id={`item-name-${index}`}
                      className={inputClass(`item_${index}_name`)}
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      aria-label="Item name"
                    />
                  </div>

                  {/* Qty */}
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor={`item-qty-${index}`} className="block text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2 sm:hidden font-medium">
                      Qty.
                    </label>
                    <input
                      id={`item-qty-${index}`}
                      type="number"
                      min="1"
                      className={inputClass(`item_${index}_qty`)}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      aria-label="Item quantity"
                    />
                  </div>

                  {/* Price */}
                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor={`item-price-${index}`} className="block text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2 sm:hidden font-medium">
                      Price
                    </label>
                    <input
                      id={`item-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputClass(`item_${index}_price`)}
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                      aria-label="Item price"
                    />
                  </div>

                  {/* Total */}
                  <div className="col-span-1 flex flex-col">
                    <span className="text-xs text-[#7E88C3] dark:text-[#DFE3FA] mb-2 sm:hidden font-medium">Total</span>
                    <span className="py-4 text-sm font-bold text-[#888EB0]">
                      {formatCurrency(calculateItemTotal(item))}
                    </span>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    aria-label={`Remove item ${item.name || index + 1}`}
                    className="p-1 text-[#888EB0] hover:text-delete transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-delete rounded mt-4 sm:mt-0"
                  >
                    <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.445.767l.56.56H13v1.333H0V1.327h3.994l.561-.56h3.89zM1.333 14.107V4h10.334v10.107A1.893 1.893 0 0 1 9.774 16H3.227a1.893 1.893 0 0 1-1.894-1.893z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="text-delete text-xs mt-3" role="alert">{errors.items}</p>
            )}

            <button
              type="button"
              onClick={addItem}
              className="mt-6 w-full py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              + Add New Item
            </button>
          </section>

          {/* Global error summary */}
          {hasErrors && (
            <div role="alert" className="mb-6">
              <p className="text-delete text-xs font-medium">- All fields must be added</p>
              {errors.items && <p className="text-delete text-xs font-medium">- An item must be added</p>}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 bg-white dark:bg-[#141625] px-6 md:px-14 py-8 shadow-[0_-8px_24px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.3)]">
          {editingInvoice ? (
            <div className="flex justify-end gap-4">
              <button
                onClick={handleClose}
                className="px-6 py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#888EB0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-4 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex justify-between gap-4">
              <button
                onClick={handleClose}
                className="px-6 py-4 rounded-full bg-[#F9FAFE] dark:bg-[#252945] text-[#7E88C3] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#DFE3FA] dark:hover:bg-[#DFE3FA] dark:hover:text-[#888EB0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Discard
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveAsDraft}
                  className="px-4 sm:px-6 py-4 rounded-full bg-[#373B53] dark:bg-[#373B53] text-[#888EB0] dark:text-[#DFE3FA] font-bold text-sm hover:bg-[#0C0E16] dark:hover:bg-[#0C0E16] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#373B53]"
                >
                  Save as Draft
                </button>
                <button
                  onClick={handleSaveAndSend}
                  className="px-4 sm:px-6 py-4 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Save &amp; Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceForm;
