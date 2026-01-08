import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Demand, Subtask, DemandStatus, DemandPriority, DashboardMetrics } from '@/types/demand';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export function useDemands() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const demandsQuery = useQuery({
    queryKey: ['demands', user?.id],
    queryFn: async (): Promise<Demand[]> => {
      if (!user) return [];
      
      const { data: demands, error } = await supabase
        .from('demands')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch subtasks for all demands
      const demandIds = demands?.map(d => d.id) || [];
      if (demandIds.length === 0) return demands || [];

      const { data: subtasks, error: subtasksError } = await supabase
        .from('subtasks')
        .select('*')
        .in('demand_id', demandIds);

      if (subtasksError) throw subtasksError;

      // Map subtasks to demands
      return demands?.map(demand => ({
        ...demand,
        subtasks: subtasks?.filter(s => s.demand_id === demand.id) || []
      })) || [];
    },
    enabled: !!user,
  });

  const createDemand = useMutation({
    mutationFn: async (data: { title: string; description?: string; category?: string; priority?: DemandPriority; subtasks?: string[] }) => {
      if (!user) throw new Error('Not authenticated');

      const { data: demand, error } = await supabase
        .from('demands')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          category: data.category || null,
          priority: data.priority || 'medium',
          status: 'open' as DemandStatus,
        })
        .select()
        .single();

      if (error) throw error;

      // Create subtasks if provided
      if (data.subtasks && data.subtasks.length > 0) {
        const subtasksToInsert = data.subtasks.map(description => ({
          demand_id: demand.id,
          description,
          is_completed: false,
        }));

        const { error: subtasksError } = await supabase
          .from('subtasks')
          .insert(subtasksToInsert);

        if (subtasksError) throw subtasksError;
      }

      return demand;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
      toast({ title: 'Demanda criada com sucesso!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao criar demanda', description: error.message, variant: 'destructive' });
    },
  });

  const updateDemand = useMutation({
    mutationFn: async (data: { id: string; title?: string; description?: string; status?: DemandStatus; category?: string; priority?: DemandPriority }) => {
      const updateData: Record<string, unknown> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.status !== undefined) {
        updateData.status = data.status;
        if (data.status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }
      if (data.category !== undefined) updateData.category = data.category;
      if (data.priority !== undefined) updateData.priority = data.priority;

      const { error } = await supabase
        .from('demands')
        .update(updateData)
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
      toast({ title: 'Demanda atualizada!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar demanda', description: error.message, variant: 'destructive' });
    },
  });

  const deleteDemand = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('demands')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
      toast({ title: 'Demanda excluída!' });
    },
    onError: (error) => {
      toast({ title: 'Erro ao excluir demanda', description: error.message, variant: 'destructive' });
    },
  });

  const addSubtask = useMutation({
    mutationFn: async (data: { demand_id: string; description: string }) => {
      const { error } = await supabase
        .from('subtasks')
        .insert({
          demand_id: data.demand_id,
          description: data.description,
          is_completed: false,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
    onError: (error) => {
      toast({ title: 'Erro ao adicionar subtarefa', description: error.message, variant: 'destructive' });
    },
  });

  const toggleSubtask = useMutation({
    mutationFn: async (data: { id: string; is_completed: boolean; demand_id: string }) => {
      const { error } = await supabase
        .from('subtasks')
        .update({ is_completed: data.is_completed })
        .eq('id', data.id);

      if (error) throw error;

      // Get current demand status
      const { data: demand, error: demandError } = await supabase
        .from('demands')
        .select('status')
        .eq('id', data.demand_id)
        .single();

      if (demandError) throw demandError;

      // If demand is "open", move it to "in_progress" when any subtask is toggled
      if (demand.status === 'open') {
        const { error: updateError } = await supabase
          .from('demands')
          .update({ status: 'in_progress' })
          .eq('id', data.demand_id);

        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
    onError: (error) => {
      toast({ title: 'Erro ao atualizar subtarefa', description: error.message, variant: 'destructive' });
    },
  });

  const deleteSubtask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
    },
    onError: (error) => {
      toast({ title: 'Erro ao excluir subtarefa', description: error.message, variant: 'destructive' });
    },
  });

  return {
    demands: demandsQuery.data || [],
    isLoading: demandsQuery.isLoading,
    error: demandsQuery.error,
    createDemand,
    updateDemand,
    deleteDemand,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };
}

export function useMonthlyMetrics() {
  const { demands } = useDemands();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyDemands = demands.filter(d => {
    const date = new Date(d.created_at);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const completedThisMonth = monthlyDemands.filter(d => d.status === 'completed');
  const pendingThisMonth = monthlyDemands.filter(d => d.status !== 'completed');
  const inProgressThisMonth = monthlyDemands.filter(d => d.status === 'in_progress');

  const metrics: DashboardMetrics = {
    totalDemands: monthlyDemands.length,
    completedDemands: completedThisMonth.length,
    pendingDemands: pendingThisMonth.length,
    inProgressDemands: inProgressThisMonth.length,
    completionRate: monthlyDemands.length > 0 
      ? Math.round((completedThisMonth.length / monthlyDemands.length) * 100) 
      : 0,
  };

  // Calculate previous month metrics for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const lastMonthDemands = demands.filter(d => {
    const date = new Date(d.created_at);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  const lastMonthCompleted = lastMonthDemands.filter(d => d.status === 'completed').length;
  const lastMonthTotal = lastMonthDemands.length;
  const lastMonthRate = lastMonthTotal > 0 ? Math.round((lastMonthCompleted / lastMonthTotal) * 100) : 0;

  const improvement = metrics.completionRate - lastMonthRate;

  return {
    metrics,
    lastMonthMetrics: {
      total: lastMonthTotal,
      completed: lastMonthCompleted,
      rate: lastMonthRate,
    },
    improvement,
    monthlyDemands,
  };
}
