import React from 'react';
import { CheckCircle2, XCircle, Clock, MessageSquare } from 'lucide-react';

type Status = 'pending' | 'yes' | 'no' | 'maybe';

interface GuestStatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
}

export const GuestStatusBadge: React.FC<GuestStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = {
    pending: {
      label: 'Pendiente',
      icon: Clock,
      className: 'bg-stone-100 text-stone-500 border-stone-200'
    },
    yes: {
      label: 'Confirmado',
      icon: CheckCircle2,
      className: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    no: {
      label: 'No Asistirá',
      icon: XCircle,
      className: 'bg-rose-50 text-rose-600 border-rose-100'
    },
    maybe: {
      label: 'Por Confirmar',
      icon: MessageSquare,
      className: 'bg-amber-50 text-amber-600 border-amber-100'
    }
  };

  const { label, icon: Icon, className } = config[status];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 font-bold uppercase tracking-widest border rounded-full ${className} ${sizeClass}`}>
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {label}
    </span>
  );
};
