export type DemandStatus = 'open' | 'in_progress' | 'completed';

export interface Subtask {
  id: string;
  demand_id: string;
  description: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Demand {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: DemandStatus;
  category: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  subtasks?: Subtask[];
}

export interface MonthlyReport {
  id: string;
  user_id: string;
  year: number;
  month: number;
  total_created: number;
  total_completed: number;
  total_pending: number;
  completion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  totalDemands: number;
  completedDemands: number;
  pendingDemands: number;
  inProgressDemands: number;
  completionRate: number;
}
