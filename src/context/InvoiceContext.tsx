import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { Invoice, InvoiceStatus } from '../types/invoice';
import { sampleInvoices } from '../data/sampleData';

interface InvoiceState {
  invoices: Invoice[];
  filter: InvoiceStatus | 'all';
  currentInvoiceId: string | null;
  isFormOpen: boolean;
  editingInvoiceId: string | null;
}

type InvoiceAction =
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'MARK_AS_PAID'; payload: string }
  | { type: 'SET_FILTER'; payload: InvoiceStatus | 'all' }
  | { type: 'SET_CURRENT_INVOICE'; payload: string | null }
  | { type: 'OPEN_FORM'; payload?: string }
  | { type: 'CLOSE_FORM' };

const initialState: InvoiceState = {
  invoices: [],
  filter: 'all',
  currentInvoiceId: null,
  isFormOpen: false,
  editingInvoiceId: null,
};

function reducer(state: InvoiceState, action: InvoiceAction): InvoiceState {
  switch (action.type) {
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload };
    case 'ADD_INVOICE':
      return { ...state, invoices: [action.payload, ...state.invoices] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload.id ? action.payload : inv
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter((inv) => inv.id !== action.payload),
        currentInvoiceId: state.currentInvoiceId === action.payload ? null : state.currentInvoiceId,
      };
    case 'MARK_AS_PAID':
      return {
        ...state,
        invoices: state.invoices.map((inv) =>
          inv.id === action.payload && inv.status === 'pending' ? { ...inv, status: 'paid' } : inv
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_CURRENT_INVOICE':
      return { ...state, currentInvoiceId: action.payload };
    case 'OPEN_FORM':
      return { ...state, isFormOpen: true, editingInvoiceId: action.payload ?? null };
    case 'CLOSE_FORM':
      return { ...state, isFormOpen: false, editingInvoiceId: null };
    default:
      return state;
  }
}

interface InvoiceContextType extends InvoiceState {
  dispatch: React.Dispatch<InvoiceAction>;
  filteredInvoices: Invoice[];
  currentInvoice: Invoice | null;
  editingInvoice: Invoice | null;
}

const InvoiceContext = createContext<InvoiceContextType>({
  ...initialState,
  dispatch: () => {},
  filteredInvoices: [],
  currentInvoice: null,
  editingInvoice: null,
});

const init = (defaultState: InvoiceState): InvoiceState => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('invoice-data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultState, invoices: parsed };
      } catch {
        return { ...defaultState, invoices: sampleInvoices };
      }
    }
  }
  return { ...defaultState, invoices: sampleInvoices };
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('invoice-data', JSON.stringify(state.invoices));
    }
  }, [state.invoices]);

  const filteredInvoices =
    state.filter === 'all'
      ? state.invoices
      : state.invoices.filter((inv) => inv.status === state.filter);

  const currentInvoice = state.currentInvoiceId
    ? state.invoices.find((inv) => inv.id === state.currentInvoiceId) ?? null
    : null;

  const editingInvoice = state.editingInvoiceId
    ? state.invoices.find((inv) => inv.id === state.editingInvoiceId) ?? null
    : null;

  return (
    <InvoiceContext.Provider
      value={{ ...state, dispatch, filteredInvoices, currentInvoice, editingInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => useContext(InvoiceContext);