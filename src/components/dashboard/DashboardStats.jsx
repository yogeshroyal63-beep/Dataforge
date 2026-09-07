import React from 'react';
import { Database, Binary, Scale, Clock } from 'lucide-react';
import Card from '../common/Card';

export const DashboardStats = ({ experiments = [] }) => {
  const totalRuns = experiments.length;
  const uniqueFactCounts = [...new Set(experiments.map((e) => e.factCount))];
  const dualModelRuns = experiments.filter((e) => e.fullAttention && e.linearAttention).length;
  const latestRun = experiments[0];

  const latestDateString = latestRun
    ? new Date(latestRun.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : '—';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {/* Total Saved Runs */}
      <Card variant="standard" className="p-4 space-y-2">
        <div className="flex items-center justify-between text-lab-text-muted">
          <span className="text-[10px] uppercase font-bold tracking-wider">Saved Runs</span>
          <Database className="w-4 h-4 text-lab-accent" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-lab-text-primary">{totalRuns}</span>
          <span className="text-xs text-lab-text-muted">records</span>
        </div>
        <p className="text-[10px] text-lab-text-secondary">
          Personal runs saved locally
        </p>
      </Card>

      {/* Unique Fact Counts Tested */}
      <Card variant="standard" className="p-4 space-y-2">
        <div className="flex items-center justify-between text-lab-text-muted">
          <span className="text-[10px] uppercase font-bold tracking-wider">Fact Counts Tested</span>
          <Binary className="w-4 h-4 text-lab-purple" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-lab-purple">{uniqueFactCounts.length}</span>
          <span className="text-xs text-lab-text-muted">lengths</span>
        </div>
        <p className="text-[10px] text-lab-text-secondary">
          {uniqueFactCounts.length > 0 ? `N = [${uniqueFactCounts.sort((a,b)=>a-b).join(', ')}]` : 'No sequence lengths'}
        </p>
      </Card>

      {/* Dual Model Comparative Runs */}
      <Card variant="standard" className="p-4 space-y-2">
        <div className="flex items-center justify-between text-lab-text-muted">
          <span className="text-[10px] uppercase font-bold tracking-wider">Runs Compared</span>
          <Scale className="w-4 h-4 text-lab-accent" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-lab-accent">{dualModelRuns}</span>
          <span className="text-xs text-lab-text-muted">dual runs</span>
        </div>
        <p className="text-[10px] text-lab-text-secondary">
          Evaluated both Full & Linear
        </p>
      </Card>

      {/* Latest Experiment */}
      <Card variant="standard" className="p-4 space-y-2">
        <div className="flex items-center justify-between text-lab-text-muted">
          <span className="text-[10px] uppercase font-bold tracking-wider">Latest Experiment</span>
          <Clock className="w-4 h-4 text-lab-text-secondary" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-lab-text-primary truncate">
            {latestRun ? `${latestRun.query} (N=${latestRun.factCount})` : '—'}
          </span>
        </div>
        <p className="text-[10px] text-lab-text-secondary truncate">
          {latestRun ? `${latestDateString} · ${new Date(latestRun.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No runs recorded'}
        </p>
      </Card>
    </div>
  );
};

export default DashboardStats;
