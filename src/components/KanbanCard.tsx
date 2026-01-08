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

// Priority-based Post-it colors (pastel tones)
const priorityColors: Record<DemandPriority, {
  bg: string;
  border: string;
  icon: React.ReactNode;
  label: string;
}> = {
  high: {
    bg: 'bg-red-100 dark:bg-red-950/40',
    border: 'border-l-red-400 dark:border-l-red-500',
    icon: <AlertTriangle className="w-3 h-3 text-red-500" />,
    label: 'Alta',
  },
  medium: {
    bg: 'bg-amber-100 dark:bg-amber-950/40',
    border: 'border-l-amber-400 dark:border-l-amber-500',
    icon: <Minus className="w-3 h-3 text-amber-500" />,
    label: 'Média',
  },
  low: {
    bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    border: 'border-l-emerald-400 dark:border-l-emerald-500',
    icon: <ArrowDown className="w-3 h-3 text-emerald-500" />,
    label: 'Baixa',
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
            "rounded-lg border-l-4 shadow-md transition-all duration-200 mb-3",
            "hover:shadow-lg",
            priorityConfig.bg,
            priorityConfig.border,
            snapshot.isDragging && "shadow-xl rotate-2 scale-105"
          )}
        >
          <div className="p-3">
            {/* Header with Drag Handle */}
            <div className="flex items-start gap-2">
              <div
                {...provided.dragHandleProps}
                className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 p-0.5 hover:bg-secondary/50 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm text-foreground leading-tight line-clamp-2">
                    {demand.title}
                  </h4>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-xs">Prioridade</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handlePriorityChange('high')}>
                        <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                        Alta
                        {priority === 'high' && <span className="ml-auto text-xs">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange('medium')}>
                        <Minus className="w-4 h-4 mr-2 text-amber-500" />
                        Média
                        {priority === 'medium' && <span className="ml-auto text-xs">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange('low')}>
                        <ArrowDown className="w-4 h-4 mr-2 text-emerald-500" />
                        Baixa
                        {priority === 'low' && <span className="ml-auto text-xs">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deleteDemand.mutate(demand.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Priority indicator */}
                <div className="flex items-center gap-1 mt-1">
                  {priorityConfig.icon}
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {priorityConfig.label}
                  </span>
                </div>

                {/* Progress */}
                {totalSubtasks > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar progress={progress} size="sm" className="flex-1" />
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {progress}%
                    </span>
                  </div>
                )}

                {/* Category */}
                {demand.category && (
                  <span className="mt-2 inline-block text-xs bg-secondary/70 px-2 py-0.5 rounded-full text-muted-foreground">
                    {demand.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expanded - Description & Subtasks */}
          {isExpanded && (
            <div className="border-t border-border/50 px-3 py-2 bg-background/50 space-y-3">
              {/* Description */}
              {demand.description && (
                <div className="pb-2 border-b border-border/30">
                  <p className="text-xs text-muted-foreground font-medium mb-1">Descrição:</p>
                  <p className="text-xs text-foreground whitespace-pre-wrap">{demand.description}</p>
                </div>
              )}

              {/* Subtasks */}
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1.5">Subtarefas:</p>
                {subtasks.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Nenhuma subtarefa</p>
                ) : (
                  subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 group mb-1.5"
                    >
                      <Checkbox
                        checked={subtask.is_completed}
                        onCheckedChange={(checked) => 
                          toggleSubtask.mutate({ id: subtask.id, is_completed: !!checked, demand_id: demand.id })
                        }
                        className="h-3.5 w-3.5"
                      />
                      <span className={cn(
                        "flex-1 text-xs",
                        subtask.is_completed && "line-through text-muted-foreground"
                      )}>
                        {subtask.description}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteSubtask.mutate(subtask.id)}
                      >
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}