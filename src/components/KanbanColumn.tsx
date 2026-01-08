import { useMemo } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Demand, DemandStatus, DemandPriority } from '@/types/demand';
import { KanbanCard } from './KanbanCard';
import { cn } from '@/lib/utils';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

interface KanbanColumnProps {
  status: DemandStatus;
  demands: Demand[];
}

// Priority order: high = 0, medium = 1, low = 2
const priorityOrder: Record<DemandPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const columnConfig: Record<DemandStatus, { 
  title: string; 
  icon: React.ReactNode; 
  headerBg: string;
  headerText: string;
  dropzoneBg: string;
  countBg: string;
}> = {
  open: {
    title: 'Aberta',
    icon: <Circle className="w-4 h-4" />,
    headerBg: 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20',
    headerText: 'text-amber-700 dark:text-amber-300',
    dropzoneBg: 'bg-amber-50/50 dark:bg-amber-950/20',
    countBg: 'bg-amber-200/60 text-amber-800 dark:bg-amber-800/40 dark:text-amber-200',
  },
  in_progress: {
    title: 'Em Andamento',
    icon: <Clock className="w-4 h-4" />,
    headerBg: 'bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20',
    headerText: 'text-blue-700 dark:text-blue-300',
    dropzoneBg: 'bg-blue-50/50 dark:bg-blue-950/20',
    countBg: 'bg-blue-200/60 text-blue-800 dark:bg-blue-800/40 dark:text-blue-200',
  },
  completed: {
    title: 'Concluída',
    icon: <CheckCircle2 className="w-4 h-4" />,
    headerBg: 'bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-900/20',
    headerText: 'text-emerald-700 dark:text-emerald-300',
    dropzoneBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    countBg: 'bg-emerald-200/60 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-200',
  },
};

export function KanbanColumn({ status, demands }: KanbanColumnProps) {
  const config = columnConfig[status];

  // Sort demands by priority: high → medium → low
  const sortedDemands = useMemo(() => {
    return [...demands].sort((a, b) => {
      const priorityA = priorityOrder[a.priority || 'medium'];
      const priorityB = priorityOrder[b.priority || 'medium'];
      return priorityA - priorityB;
    });
  }, [demands]);

  return (
    <div className="flex flex-col min-w-[300px] sm:min-w-[340px] max-w-[420px] flex-1">
      {/* Column Header */}
      <div className={cn(
        "flex items-center gap-2.5 px-4 py-3 rounded-t-xl font-semibold text-sm border-b border-border/30",
        config.headerBg,
        config.headerText
      )}>
        <div className="p-1 rounded-lg bg-white/50 dark:bg-black/20">
          {config.icon}
        </div>
        <span className="tracking-wide">{config.title}</span>
        <span className={cn(
          "ml-auto px-2.5 py-1 rounded-full text-xs font-bold",
          config.countBg
        )}>
          {demands.length}
        </span>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 p-3 rounded-b-xl min-h-[220px] transition-all duration-200 border border-t-0 border-border/30",
              config.dropzoneBg,
              snapshot.isDraggingOver && "ring-2 ring-primary/40 bg-primary/5 border-primary/30"
            )}
          >
            {sortedDemands.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex flex-col items-center justify-center h-28 text-muted-foreground text-sm gap-1">
                <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-1">
                  {config.icon}
                </div>
                <span className="font-medium">Arraste demandas aqui</span>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedDemands.map((demand, index) => (
                  <KanbanCard key={demand.id} demand={demand} index={index} />
                ))}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
