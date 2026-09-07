import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { groupExperimentsByFactCount } from '../../utils/experimentAnalytics';

export const SavedAccuracyChart = ({ experiments = [] }) => {
  const chartData = useMemo(() => {
    const grouped = groupExperimentsByFactCount(experiments);
    return grouped.map((g) => ({
      name: `N=${g.factCount}`,
      factCount: g.factCount,
      totalRuns: g.totalRuns,
      'Full Attention': g.fullAccuracy !== null ? g.fullAccuracy : undefined,
      'Linear Attention': g.linearAccuracy !== null ? g.linearAccuracy : undefined,
      fullEvaluated: g.fullEvaluated,
      linearEvaluated: g.linearEvaluated,
    }));
  }, [experiments]);

  if (chartData.length === 0) {
    return (
      <Card variant="standard" className="p-5 font-mono space-y-3">
        <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Saved Run Accuracy vs Fact Count
          </h2>
          <Badge variant="default" size="sm">No Data</Badge>
        </div>
        <p className="text-xs text-lab-text-muted py-8 text-center">
          Save experiments across different sequence lengths to plot your empirical accuracy curve.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Saved Run Accuracy vs Fact Count
          </h2>
          <p className="text-[11px] text-lab-text-muted mt-0.5">
            Empirical accuracy across tested sequence lengths (N) from your saved runs.
          </p>
        </div>
        <Badge variant="research" size="sm">
          Source: Saved StateLens Experiments
        </Badge>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252D3A" opacity={0.6} />
            <XAxis
              dataKey="name"
              stroke="#9AA5B5"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#9AA5B5"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="p-3 rounded-lg bg-lab-secondary border border-lab-border text-xs space-y-1.5 shadow-xl font-mono">
                    <span className="font-bold text-lab-text-primary block border-b border-lab-border pb-1">
                      Sequence Length: N = {data.factCount} ({data.totalRuns} run{data.totalRuns === 1 ? '' : 's'})
                    </span>
                    {data['Full Attention'] !== undefined && (
                      <div className="flex items-center justify-between gap-4 text-lab-purple">
                        <span>Full Attention:</span>
                        <span className="font-bold">{data['Full Attention']}%</span>
                      </div>
                    )}
                    {data['Linear Attention'] !== undefined && (
                      <div className="flex items-center justify-between gap-4 text-lab-accent">
                        <span>Linear Attention:</span>
                        <span className="font-bold">{data['Linear Attention']}%</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-lab-text-secondary font-semibold">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="Full Attention"
              stroke="#8B7CFF"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#8B7CFF' }}
              activeDot={{ r: 6 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="Linear Attention"
              stroke="#38D9C5"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#38D9C5' }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[10px] text-lab-text-muted flex justify-between items-center border-t border-lab-border pt-2">
        <span>Discrete data points represent actual saved runs only.</span>
        <span>{chartData.length} sequence condition{chartData.length === 1 ? '' : 's'} tested</span>
      </div>
    </Card>
  );
};

export default SavedAccuracyChart;
