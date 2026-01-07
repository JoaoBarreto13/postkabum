import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Demand, DemandStatus } from '@/types/demand';
import { KanbanColumn } from './KanbanColumn';
import { useDemands } from '@/hooks/useDemands';
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

interface KanbanBoardProps {
  demands: Demand[];
  searchQuery: string;
}

const STATUSES: DemandStatus[] = ['open', 'in_progress', 'completed'];

export function KanbanBoard({ demands, searchQuery }: KanbanBoardProps) {
  const { updateDemand } = useDemands();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    demandId: string;
    demandTitle: string;
  }>({ open: false, demandId: '', demandTitle: '' });

  // Filter demands by search query
  const filteredDemands = demands.filter(demand => 
    demand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    demand.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group demands by status
  const demandsByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = filteredDemands.filter(d => d.status === status);
    return acc;
  }, {} as Record<DemandStatus, Demand[]>);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid droppable
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as DemandStatus;
    const demand = demands.find(d => d.id === draggableId);

    if (!demand) return;

    // Check if moving to completed with incomplete subtasks
    if (newStatus === 'completed') {
      const subtasks = demand.subtasks || [];
      const hasIncompleteSubtasks = subtasks.some(s => !s.is_completed);
      
      if (hasIncompleteSubtasks && subtasks.length > 0) {
        setConfirmDialog({
          open: true,
          demandId: demand.id,
          demandTitle: demand.title,
        });
        return;
      }
    }

    // Update status directly
    updateDemand.mutate({ id: draggableId, status: newStatus });
  };

  const handleConfirmComplete = () => {
    updateDemand.mutate({ id: confirmDialog.demandId, status: 'completed' });
    setConfirmDialog({ open: false, demandId: '', demandTitle: '' });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              demands={demandsByStatus[status]}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Confirm Complete Dialog */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, demandId: '', demandTitle: '' })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Concluir demanda?</AlertDialogTitle>
            <AlertDialogDescription>
              A demanda "<strong>{confirmDialog.demandTitle}</strong>" possui subtarefas não concluídas. 
              Deseja marcá-la como concluída mesmo assim?
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