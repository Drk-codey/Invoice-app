import React from 'react';
import type { InvoiceStatus } from '../types/invoice';
import { getStatusColor, getStatusDot } from '../utils/helpers';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm min-w-[104px] justify-center capitalize ${getStatusColor(status)}`}
    >
      <span className={`w-2 h-2 rounded-full ${getStatusDot(status)}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
