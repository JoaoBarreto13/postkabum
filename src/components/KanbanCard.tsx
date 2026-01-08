import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Demand, DemandPriority } from '@/types/demand';
import { ProgressBar } from './ProgressBar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  GripVertical,
  AlertTriangle,
  Minus,
  ArrowDown
} from 'lucide-react';
import { useDemands } from '@/hooks/useDemands';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface KanbanCardProps {
  demand: Demand;
  index: number;
}

// Priority-based Post-it colors (refined pastel tones with better shadows)
const priorityColors: Record<DemandPriority, {
  bg: string;
  border: string;
  shadow: string;
  icon: React.ReactNode;
  label: string;
  badge: string;
}> = {
  high: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100/80 dark:from-red-950/50 dark:to-red-900/30',
    border: 'border-l-red-400 dark:border-l-red-500',
    shadow: 'shadow-red-100/50 dark:shadow-red-900/20',
    icon: <AlertTriangle className="w-3 h-3 text-red-500" />,
    label: 'Alta',
    badge: 'bg-red-100 text-red-700 ring-1 ring-red-200 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-800',
  },
  medium: {
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-100/80 dark:from-amber-950/50 dark:to-amber-900/30',
    border: 'border-l-amber-400 dark:border-l-amber-500',
    shadow: 'shadow-amber-100/50 dark:shadow-amber-900/20',
    icon: <Minus className="w-3 h-3 text-amber-500" />,
    label: 'Média',
    badge: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:ring-amber-800',
  },
  low: {
    bg: 'bg-gradient-to-br from-emerald-50 to-green-100/80 dark:from-emerald-950/50 dark:to-emerald-900/30',
    border: 'border-l-emerald-400 dark:border-l-emerald-500',
    shadow: 'shadow-emerald-100/50 dark:shadow-emerald-900/20',
    icon: <ArrowDown className="w-3 h-3 text-emerald-500" />,
    label: 'Baixa',
    badge: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:ring-emerald-800',
  },
};

export function KanbanCard({ demand, index }: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { deleteDemand, updateDemand, toggleSubtask, deleteSubtask } = useDemands();

  const subtasks = demand.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.is_completed).length;
  const totalSubtasks = subtasks.length;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const priority = demand.priority || 'medium';
  const priorityConfig = priorityColors[priority];

  const handlePriorityChange = (newPriority: DemandPriority) => {
    updateDemand.mutate({ id: demand.id, priority: newPriority });
  };

  return (
    <Draggable draggableId={demand.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "postit-card rounded-xl border-l-4 transition-all duration-200",
            priorityConfig.bg,
            priorityConfig.border,
            priorityConfig.shadow,
            snapshot.isDragging && "shadow-2xl rotate-2 scale-105 ring-2 ring-primary/30"
          )}
        >
          <div className="p-3.5">
            {/* Header with Drag Handle */}
            <div className="flex items-start gap-2">
              <div
                {...provided.dragHandleProps}
                className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground transition-colors"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-0.5 p-0.5 hover:bg-white/50 dark:hover:bg-black/20 rounded-md transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
                    {demand.title}
                  </h4>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 -mt-0.5 -mr-1 hover:bg-white/60 dark:hover:bg-black/30"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="shadow-lg">
                      <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                        Prioridade
                      </DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => handlePriorityChange('high')}
                        className="cursor-pointer"
                      >
                        <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                        Alta
                        {priority === 'high' && <span className="ml-auto text-xs text-primary">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handlePriorityChange('medium')}
                        className="cursor-pointer"
                      >
                        <Minus className="w-4 h-4 mr-2 text-amber-500" />
                        Média
                        {priority === 'medium' && <span className="ml-auto text-xs text-primary">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handlePriorityChange('low')}
                        className="cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4 mr-2 text-emerald-500" />
                        Baixa
                        {priority === 'low' && <span className="ml-auto text-xs text-primary">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteDemand.mutate(demand.id)}
                        className="text-destructive focus:text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Priority Badge */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    priorityConfig.badge
                  )}>
                    {priorityConfig.icon}
                    {priorityConfig.label}
                  </span>
                </div>

                {/* Progress */}
                {totalSubtasks > 0 && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <ProgressBar progress={progress} size="sm" className="flex-1" />
                    <span className="text-xs font-bold text-muted-foreground whitespace-nowrap tabular-nums">
                      {completedSubtasks}/{totalSubtasks}
                    </span>
                  </div>
                )}

                {/* Category */}
                {demand.category && (
                  <span className="mt-2 inline-block text-[11px] font-medium bg-white/60 dark:bg-black/20 px-2.5 py-1 rounded-full text-muted-foreground ring-1 ring-border/30">
                    {demand.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expanded - Description & Subtasks */}
          {isExpanded && (
            <div className="border-t border-border/30 px-3.5 py-3 bg-white/40 dark:bg-black/20 rounded-b-xl space-y-3">
              {/* Description */}
              {demand.description && (
                <div className="pb-2.5 border-b border-border/20">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1.5">
                    Descrição
                  </p>
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {demand.description}
                  </p>
                </div>
              )}

              {/* Subtasks */}
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">
                  Subtarefas ({completedSubtasks}/{totalSubtasks})
                </p>
                {subtasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Nenhuma subtarefa</p>
                ) : (
                  <div className="space-y-1.5">
                    {subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className={cn(
                          "flex items-center gap-2 group py-1.5 px-2 rounded-lg transition-colors",
                          "hover:bg-white/50 dark:hover:bg-black/20"
                        )}
                      >
                        <Checkbox
                          checked={subtask.is_completed}
                          onCheckedChange={(checked) => 
                            toggleSubtask.mutate({ id: subtask.id, is_completed: !!checked, demand_id: demand.id })
                          }
                          className="h-4 w-4 rounded-md"
                        />
                        <span className={cn(
                          "flex-1 text-xs leading-relaxed",
                          subtask.is_completed && "line-through text-muted-foreground"
                        )}>
                          {subtask.description}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10"
                          onClick={() => deleteSubtask.mutate(subtask.id)}
                        >
                          <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
