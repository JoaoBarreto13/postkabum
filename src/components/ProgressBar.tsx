import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ progress, showLabel = true, className, size = 'md' }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (clampedProgress >= 100) return 'from-emerald-400 to-emerald-500';
    if (clampedProgress >= 75) return 'from-emerald-400 to-green-500';
    if (clampedProgress >= 50) return 'from-amber-400 to-yellow-500';
    if (clampedProgress >= 25) return 'from-amber-500 to-orange-500';
    return 'from-red-400 to-red-500';
  };
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "flex-1 rounded-full bg-secondary/80 overflow-hidden",
        size === 'sm' ? 'h-1.5' : 'h-2.5'
      )}>
        <div 
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out",
            getProgressColor()
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-muted-foreground min-w-[3rem] text-right tabular-nums">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
}
