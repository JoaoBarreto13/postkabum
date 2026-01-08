import { useState } from 'react';
import { Demand, DemandStatus } from '@/types/demand';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Circle,
  Clock,
  Calendar
} from 'lucide-react';
import { useDemands } from '@/hooks/useDemands';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DemandCardProps {
  demand: Demand;
}

export function DemandCard({ demand }: DemandCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const { updateDemand, deleteDemand, addSubtask, toggleSubtask, deleteSubtask } = useDemands();

  const subtasks = demand.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.is_completed).length;
  const totalSubtasks = subtasks.length;
  const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
  const allSubtasksCompleted = totalSubtasks > 0 && completedSubtasks === totalSubtasks;

  const handleStatusChange = (status: DemandStatus) => {
    if (status === 'completed' && !allSubtasksCompleted && totalSubtasks > 0) {
      setShowCompleteDialog(true);
      return;
    }
    updateDemand.mutate({ id: demand.id, status });
  };

  const handleConfirmComplete = () => {
    updateDemand.mutate({ id: demand.id, status: 'completed' });
    setShowCompleteDialog(false);
  };

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
    <>
      <div className="metric-card overflow-hidden animate-slide-up">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 p-0.5 hover:bg-secondary rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{demand.title}</h3>
                  {demand.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {demand.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusBadge status={demand.status} />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange('open')}>
                        <Circle className="w-4 h-4 mr-2 text-info" />
                        Marcar como Aberta
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                        <Clock className="w-4 h-4 mr-2 text-warning" />
                        Em Andamento
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                        <CheckCircle2 className="w-4 h-4 mr-2 text-success" />
                        Concluída
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
              </div>

              {/* Progress and Meta */}
              <div className="mt-3 space-y-2">
                {totalSubtasks > 0 && (
                  <div className="flex items-center gap-2">
                    <ProgressBar progress={progress} size="sm" className="flex-1" />
                    <span className="text-xs text-muted-foreground">
                      {completedSubtasks}/{totalSubtasks}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(demand.created_at), "dd MMM yyyy", { locale: ptBR })}
                  </span>
                  {demand.category && (
                    <span className="bg-secondary px-2 py-0.5 rounded-full">
                      {demand.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content - Subtasks */}
        {isExpanded && (
          <div className="border-t border-border bg-secondary/30 p-4 space-y-3">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-3 group"
              >
                <Checkbox
                  checked={subtask.is_completed}
                  onCheckedChange={(checked) => 
                    toggleSubtask.mutate({ id: subtask.id, is_completed: !!checked, demand_id: demand.id })
                  }
                />
                <span className={cn(
                  "flex-1 text-sm",
                  subtask.is_completed && "line-through text-muted-foreground"
                )}>
                  {subtask.description}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteSubtask.mutate(subtask.id)}
                >
                  <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}

            {/* Add Subtask */}
            <div className="flex items-center gap-2 pt-2">
              <Plus className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Adicionar subtarefa..."
                value={newSubtaskDescription}
                onChange={(e) => setNewSubtaskDescription(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8 text-sm bg-background"
              />
              <Button 
                size="sm" 
                onClick={handleAddSubtask}
                disabled={!newSubtaskDescription.trim()}
              >
                Adicionar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Complete Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Concluir demanda?</AlertDialogTitle>
            <AlertDialogDescription>
              Existem subtarefas não concluídas. Deseja marcar esta demanda como concluída mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmComplete}>
              Sim, concluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
