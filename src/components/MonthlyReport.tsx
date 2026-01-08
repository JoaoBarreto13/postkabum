import { useMemo } from 'react';
import { useMonthlyMetrics } from '@/hooks/useDemands';
import { MetricCard } from './MetricCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Target, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDemands } from '@/hooks/useDemands';

export function MonthlyReport() {
  const { metrics, lastMonthMetrics, improvement } = useMonthlyMetrics();
  const { demands } = useDemands();

  // Calculate last 6 months data for charts
  const chartData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();
      
      const monthDemands = demands.filter(d => {
        const date = new Date(d.created_at);
        return date.getMonth() === month && date.getFullYear() === year;
      });
      
      const completed = monthDemands.filter(d => d.status === 'completed').length;
      const total = monthDemands.length;
      
      months.push({
        month: format(monthDate, 'MMM', { locale: ptBR }),
        criadas: total,
        concluidas: completed,
        taxa: total > 0 ? Math.round((completed / total) * 100) : 0,
      });
    }
    
    return months;
  }, [demands]);

  const currentMonthName = format(new Date(), 'MMMM yyyy', { locale: ptBR });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Relatório Mensal</h2>
          <p className="text-muted-foreground capitalize text-lg">{currentMonthName}</p>
        </div>
        {improvement !== 0 && (
          <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full font-semibold shadow-sm ${
            improvement >= 0 
              ? 'bg-gradient-to-r from-success/15 to-success/10 text-success ring-1 ring-success/20' 
              : 'bg-gradient-to-r from-destructive/15 to-destructive/10 text-destructive ring-1 ring-destructive/20'
          }`}>
            {improvement >= 0 ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span>
              {improvement >= 0 ? '+' : ''}{improvement}% vs mês anterior
            </span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total de Demandas"
          value={metrics.totalDemands}
          icon={<ListTodo className="w-6 h-6" />}
          variant="info"
          subtitle={`${lastMonthMetrics.total} no mês anterior`}
        />
        <MetricCard
          title="Concluídas"
          value={metrics.completedDemands}
          icon={<CheckCircle2 className="w-6 h-6" />}
          variant="success"
          trend={lastMonthMetrics.completed > 0 ? {
            value: Math.round(((metrics.completedDemands - lastMonthMetrics.completed) / lastMonthMetrics.completed) * 100),
            label: 'vs anterior'
          } : undefined}
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
          variant="default"
          trend={improvement !== 0 ? {
            value: improvement,
            label: 'melhoria'
          } : undefined}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Demands Created vs Completed */}
        <div className="metric-card p-6">
          <h3 className="font-semibold text-lg mb-5">Demandas por Mês</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar 
                  dataKey="criadas" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]}
                  name="Criadas"
                />
                <Bar 
                  dataKey="concluidas" 
                  fill="hsl(var(--success))" 
                  radius={[6, 6, 0, 0]}
                  name="Concluídas"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Completion Rate Trend */}
        <div className="metric-card p-6">
          <h3 className="font-semibold text-lg mb-5">Taxa de Conclusão (%)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value) => [`${value}%`, 'Taxa']}
                />
                <Line 
                  type="monotone" 
                  dataKey="taxa" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--card))', stroke: 'hsl(var(--primary))', strokeWidth: 3, r: 5 }}
                  activeDot={{ r: 7, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Text */}
      <div className="metric-card p-6 bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border-primary/20">
        <h3 className="font-semibold text-lg mb-3">📈 Resumo da Melhoria Contínua</h3>
        <p className="text-muted-foreground leading-relaxed">
          {metrics.totalDemands === 0 ? (
            'Nenhuma demanda criada neste mês. Comece criando sua primeira demanda!'
          ) : improvement > 0 ? (
            `Excelente progresso! A taxa de conclusão melhorou ${improvement}% em relação ao mês anterior. 
            Foram concluídas ${metrics.completedDemands} de ${metrics.totalDemands} demandas.`
          ) : improvement < 0 ? (
            `A taxa de conclusão diminuiu ${Math.abs(improvement)}% em relação ao mês anterior. 
            Considere revisar as prioridades ou dividir demandas complexas em subtarefas menores.`
          ) : (
            `A taxa de conclusão se manteve estável. 
            ${metrics.completedDemands} demandas foram concluídas de um total de ${metrics.totalDemands}.`
          )}
        </p>
      </div>
    </div>
  );
}
