export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

export type PaymentTerm = 1 | 7 | 14 | 30;

export interface FormErrors {
  senderStreet?: string;
  senderCity?: string;
  senderPostCode?: string;
  senderCountry?: string;
  clientName?: string;
  clientEmail?: string;
  clientStreet?: string;
  clientCity?: string;
  clientPostCode?: string;
  clientCountry?: string;
  createdAt?: string;
  description?: string;
  items?: string;
  [key: string]: string | undefined;
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'paymentDue' | 'total'> & {
  items: Omit<InvoiceItem, 'total'>[];
};
