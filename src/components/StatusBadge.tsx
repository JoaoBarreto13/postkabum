import { DemandStatus } from '@/types/demand';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: DemandStatus;
  className?: string;
}

const statusConfig: Record<DemandStatus, { label: string; className: string }> = {
  open: {
    label: 'Aberta',
    className: 'status-open',
  },
  in_progress: {
    label: 'Em Andamento',
    className: 'status-in-progress',
  },
  completed: {
    label: 'Concluída',
    className: 'status-completed',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
