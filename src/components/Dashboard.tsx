import { useState } from 'react';
import { useDemands, useMonthlyMetrics } from '@/hooks/useDemands';
import { MetricCard } from './MetricCard';
import { KanbanBoard } from './KanbanBoard';
import { CreateDemandDialog } from './CreateDemandDialog';
import { MonthlyReport } from './MonthlyReport';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  Target, 
  Search,
  Plus,
  BarChart3,
  Inbox,
  Sparkles
} from 'lucide-react';

export function Dashboard() {
  const { demands, isLoading } = useDemands();
  const { metrics } = useMonthlyMetrics();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="w-fit bg-card/80 border border-border/40 shadow-sm p-1">
              <TabsTrigger 
                value="dashboard" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <ListTodo className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger 
                value="report" 
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Relatório</span>
              </TabsTrigger>
            </TabsList>
            
            <CreateDemandDialog>
              <Button className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow bg-gradient-to-r from-primary to-primary/90 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Nova Demanda
              </Button>
            </CreateDemandDialog>
          </div>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar demandas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border/50 shadow-sm focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Kanban Board */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground font-medium">Carregando demandas...</span>
                </div>
              </div>
            ) : demands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-5 shadow-lg">
                  <Inbox className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Nenhuma demanda ainda</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Crie sua primeira demanda para começar a organizar suas tarefas no estilo Post-it.
                </p>
                <CreateDemandDialog>
                  <Button size="lg" className="shadow-md hover:shadow-lg transition-shadow font-semibold">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Criar Primeira Demanda
                  </Button>
                </CreateDemandDialog>
              </div>
            ) : (
              <KanbanBoard demands={demands} searchQuery={searchQuery} />
            )}
          </TabsContent>

          <TabsContent value="report">
            <MonthlyReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
