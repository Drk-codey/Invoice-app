import { useState } from 'react';
import type { FormErrors, Invoice } from '../types/invoice';

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (data: Partial<Invoice>, isDraft: boolean): boolean => {
    const newErrors: FormErrors = {};

    if (isDraft) {
      // Drafts only need client name
      if (!data.clientName?.trim()) {
        newErrors.clientName = "can't be empty";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    // Full validation for pending/save&send
    if (!data.senderAddress?.street?.trim()) newErrors.senderStreet = "can't be empty";
    if (!data.senderAddress?.city?.trim()) newErrors.senderCity = "can't be empty";
    if (!data.senderAddress?.postCode?.trim()) newErrors.senderPostCode = "can't be empty";
    if (!data.senderAddress?.country?.trim()) newErrors.senderCountry = "can't be empty";
    if (!data.clientName?.trim()) newErrors.clientName = "can't be empty";
    if (!data.clientEmail?.trim()) {
      newErrors.clientEmail = "can't be empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) {
      newErrors.clientEmail = 'must be a valid email';
    }
    if (!data.clientAddress?.street?.trim()) newErrors.clientStreet = "can't be empty";
    if (!data.clientAddress?.city?.trim()) newErrors.clientCity = "can't be empty";
    if (!data.clientAddress?.postCode?.trim()) newErrors.clientPostCode = "can't be empty";
    if (!data.clientAddress?.country?.trim()) newErrors.clientCountry = "can't be empty";
    if (!data.createdAt) newErrors.createdAt = "can't be empty";
    if (!data.description?.trim()) newErrors.description = "can't be empty";

    if (!data.items || data.items.length === 0) {
      newErrors.items = 'An item must be added';
    } else {
      data.items.forEach((item, i) => {
        if (!item.name?.trim()) newErrors[`item_${i}_name`] = "can't be empty";
        if (item.quantity <= 0) newErrors[`item_${i}_qty`] = 'must be > 0';
        if (item.price < 0) newErrors[`item_${i}_price`] = 'must be ≥ 0';
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const clearAllErrors = () => setErrors({});

  return { errors, validate, clearError, clearAllErrors };
}
