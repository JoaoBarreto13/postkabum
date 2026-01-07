import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Demand, DemandStatus } from '@/types/demand';
import { ProgressBar } from './ProgressBar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  Trash2,
  GripVertical
} from 'lucide-react';
import { useDemands } from '@/hooks/useDemands';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface KanbanCardProps {
  demand: Demand;
  index: number;
}

const statusColors: Record<DemandStatus, string> = {
  open: 'bg-amber-50 border-l-amber-400 dark:bg-amber-950/30 dark:border-l-amber-500',
  in_progress: 'bg-blue-50 border-l-blue-400 dark:bg-blue-950/30 dark:border-l-blue-500',
  completed: 'bg-emerald-50 border-l-emerald-400 dark:bg-emerald-950/30 dark:border-l-emerald-500',
};

export function KanbanCard({ demand, index }: KanbanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
  const { deleteDemand, addSubtask, toggleSubtask, deleteSubtask } = useDemands();

  const subtasks = demand.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.is_completed).length;
  const totalSubtasks = subtasks.length;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleAddSubtask = () => {
    if (!newSubtaskDescription.trim()) return;
    addSubtask.mutate({ demand_id: demand.id, description: newSubtaskDescription });
    setNewSubtaskDescription('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubtask();
    }
  };

  return (
    <Draggable draggableId={demand.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "rounded-lg border-l-4 shadow-md transition-all duration-200 mb-3",
            "bg-card hover:shadow-lg",
            statusColors[demand.status],
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

          {/* Expanded - Subtasks Checklist */}
          {isExpanded && (
            <div className="border-t border-border/50 px-3 py-2 bg-background/50 space-y-2">
              {subtasks.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhuma subtarefa</p>
              ) : (
                subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-2 group"
                  >
                    <Checkbox
                      checked={subtask.is_completed}
                      onCheckedChange={(checked) => 
                        toggleSubtask.mutate({ id: subtask.id, is_completed: !!checked })
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

              {/* Add Subtask */}
              <div className="flex items-center gap-1.5 pt-1">
                <Plus className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <Input
                  placeholder="Nova subtarefa..."
                  value={newSubtaskDescription}
                  onChange={(e) => setNewSubtaskDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-7 text-xs bg-background"
                />
                <Button 
                  size="sm" 
                  onClick={handleAddSubtask}
                  disabled={!newSubtaskDescription.trim()}
                  className="h-7 text-xs px-2"
                >
                  +
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}