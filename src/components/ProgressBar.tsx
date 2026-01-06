import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ progress, showLabel = true, className, size = 'md' }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "progress-bar flex-1",
        size === 'sm' ? 'h-1.5' : 'h-2'
      )}>
        <div 
          className="progress-fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
}
