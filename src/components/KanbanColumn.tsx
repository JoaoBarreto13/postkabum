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
  headerColor: string;
  bgColor: string;
}> = {
  open: {
    title: 'Aberta',
    icon: <Circle className="w-4 h-4" />,
    headerColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    bgColor: 'bg-amber-50/30 dark:bg-amber-950/10',
  },
  in_progress: {
    title: 'Em Andamento',
    icon: <Clock className="w-4 h-4" />,
    headerColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    bgColor: 'bg-blue-50/30 dark:bg-blue-950/10',
  },
  completed: {
    title: 'Concluída',
    icon: <CheckCircle2 className="w-4 h-4" />,
    headerColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    bgColor: 'bg-emerald-50/30 dark:bg-emerald-950/10',
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
    <div className="flex flex-col min-w-[280px] sm:min-w-[320px] max-w-[400px] flex-1">
      {/* Column Header */}
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-t-lg font-medium text-sm",
        config.headerColor
      )}>
        {config.icon}
        <span>{config.title}</span>
        <span className="ml-auto bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full text-xs font-semibold">
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
              "flex-1 p-2 rounded-b-lg min-h-[200px] transition-colors",
              config.bgColor,
              snapshot.isDraggingOver && "ring-2 ring-primary/30 bg-primary/5"
            )}
          >
            {sortedDemands.length === 0 && !snapshot.isDraggingOver ? (
              <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
                Arraste demandas aqui
              </div>
            ) : (
              sortedDemands.map((demand, index) => (
                <KanbanCard key={demand.id} demand={demand} index={index} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}