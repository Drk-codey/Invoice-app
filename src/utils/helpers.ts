import { format, addDays, parseISO } from 'date-fns';
import type { Invoice, InvoiceItem } from '../types/invoice';

export function generateId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = Math.floor(1000 + Math.random() * 9000);
  const l1 = letters[Math.floor(Math.random() * letters.length)];
  const l2 = letters[Math.floor(Math.random() * letters.length)];
  return `${l1}${l2}${nums}`;
}

export function generateItemId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculatePaymentDue(createdAt: string, paymentTerms: number): string {
  try {
    const date = parseISO(createdAt);
    return format(addDays(date, paymentTerms), 'yyyy-MM-dd');
  } catch {
    return createdAt;
  }
}

export function calculateItemTotal(item: InvoiceItem): number {
  return item.quantity * item.price;
}

export function calculateInvoiceTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export function toDateInputValue(dateStr: string): string {
  // Convert 'dd MMM yyyy' or ISO to 'yyyy-MM-dd' for input[type=date]
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return format(parseISO(dateStr), 'yyyy-MM-dd');
  } catch {
    return '';
  }
}

export function getStatusColor(status: Invoice['status']): string {
  switch (status) {
    case 'paid':
      return 'text-status-paid bg-green-50 dark:bg-green-900/20';
    case 'pending':
      return 'text-status-pending bg-orange-50 dark:bg-orange-900/20';
    case 'draft':
      return 'text-[#373B53] dark:text-status-draft-dark bg-gray-100 dark:bg-[#292C44]';
  }
}

export function getStatusDot(status: Invoice['status']): string {
  switch (status) {
    case 'paid':
      return 'bg-status-paid';
    case 'pending':
      return 'bg-status-pending';
    case 'draft':
      return 'bg-[#373B53] dark:bg-status-draft-dark';
  }
}