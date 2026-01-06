import { useState } from 'react';
import { useDemands, useMonthlyMetrics } from '@/hooks/useDemands';
import { MetricCard } from './MetricCard';
import { DemandCard } from './DemandCard';
import { CreateDemandDialog } from './CreateDemandDialog';
import { MonthlyReport } from './MonthlyReport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  Target, 
  Search,
  Plus,
  BarChart3,
  Inbox
} from 'lucide-react';
import { DemandStatus } from '@/types/demand';

export function Dashboard() {
  const { demands, isLoading } = useDemands();
  const { metrics } = useMonthlyMetrics();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DemandStatus | 'all'>('all');

  const filteredDemands = demands.filter(demand => {
    const matchesSearch = demand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demand.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || demand.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="w-fit">
              <TabsTrigger value="dashboard" className="gap-2">
                <ListTodo className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="report" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Relatório</span>
              </TabsTrigger>
            </TabsList>
            
            <CreateDemandDialog>
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nova Demanda
              </Button>
            </CreateDemandDialog>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total do Mês"
                value={metrics.totalDemands}
                icon={<ListTodo className="w-6 h-6" />}
                variant="info"
              />
              <MetricCard
                title="Concluídas"
                value={metrics.completedDemands}
                icon={<CheckCircle2 className="w-6 h-6" />}
                variant="success"
              />
              <MetricCard
                title="Em Andamento"
                value={metrics.inProgressDemands}
                icon={<Clock className="w-6 h-6" />}
                variant="warning"
              />
              <MetricCard
                title="Taxa de Conclusão"
                value={`${metrics.completionRate}%`}
                icon={<Target className="w-6 h-6" />}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar demandas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as DemandStatus | 'all')}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="open">Abertas</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluídas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Demands List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredDemands.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {demands.length === 0 ? 'Nenhuma demanda ainda' : 'Nenhum resultado encontrado'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {demands.length === 0 
                      ? 'Crie sua primeira demanda para começar a organizar suas tarefas.'
                      : 'Tente ajustar os filtros ou a busca.'}
                  </p>
                  {demands.length === 0 && (
                    <CreateDemandDialog>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeira Demanda
                      </Button>
                    </CreateDemandDialog>
                  )}
                </div>
              ) : (
                filteredDemands.map(demand => (
                  <DemandCard key={demand.id} demand={demand} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="report">
            <MonthlyReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
