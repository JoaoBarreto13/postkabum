import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'info';
}

export function MetricCard({ title, value, subtitle, icon, trend, variant = 'default' }: MetricCardProps) {
  const iconContainerClasses = {
    default: 'bg-gradient-to-br from-primary/20 to-primary/10 text-primary ring-1 ring-primary/20',
    success: 'bg-gradient-to-br from-success/20 to-success/10 text-success ring-1 ring-success/20',
    warning: 'bg-gradient-to-br from-warning/20 to-warning/10 text-warning ring-1 ring-warning/20',
    info: 'bg-gradient-to-br from-info/20 to-info/10 text-info ring-1 ring-info/20',
  };

  return (
    <div className="metric-card p-6 animate-fade-in group">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-2.5 py-1 mt-1",
              trend.value >= 0 
                ? "bg-success/10 text-success ring-1 ring-success/20" 
                : "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
            )}>
              <span className="text-base">{trend.value >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal text-xs">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3.5 rounded-2xl transition-transform duration-200 group-hover:scale-105",
          iconContainerClasses[variant]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
