import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { calculateFactCountDistribution } from '../../utils/experimentAnalytics';

export const FactCountTrend = ({ experiments = [] }) => {
  const distribution = useMemo(() => {
    return calculateFactCountDistribution(experiments).map((d) => ({
      name: `N=${d.factCount}`,
      factCount: d.factCount,
      count: d.count,
    }));
  }, [experiments]);

  if (distribution.length === 0) {
    return (
      <Card variant="standard" className="p-5 font-mono space-y-3">
        <div className="flex items-center justify-between border-b border-lab-border pb-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Sequence Length Exploration
          </h2>
          <Badge variant="default" size="sm">No Data</Badge>
        </div>
        <p className="text-xs text-lab-text-muted py-8 text-center">
          No sequence distribution recorded yet.
        </p>
      </Card>
    );
  }

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-lab-border pb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Sequence Length Exploration
          </h2>
          <p className="text-[11px] text-lab-text-muted mt-0.5">
            Distribution of saved experiments across fact counts.
          </p>
        </div>
        <Badge variant="research" size="sm">
          {distribution.length} Condition{distribution.length === 1 ? '' : 's'}
        </Badge>
      </div>

      <div className="h-48 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252D3A" vertical={false} opacity={0.6} />
            <XAxis dataKey="name" stroke="#9AA5B5" fontSize={11} tickLine={false} />
            <YAxis
              allowDecimals={false}
              stroke="#9AA5B5"
              fontSize={11}
              tickLine={false}
              domain={[0, maxCount + 1]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const item = payload[0].payload;
                return (
                  <div className="p-2.5 rounded-lg bg-lab-secondary border border-lab-border text-xs space-y-1 shadow-lg font-mono">
                    <span className="font-bold text-lab-text-primary block">
                      Sequence N = {item.factCount} facts
                    </span>
                    <span className="text-lab-accent block font-semibold">
                      {item.count} saved run{item.count === 1 ? '' : 's'}
                    </span>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {distribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.factCount >= 16 ? '#8B7CFF' : '#38D9C5'}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[10px] text-lab-text-muted flex justify-between items-center border-t border-lab-border pt-2">
        <span>Higher N values test longer associative recall retention.</span>
        <span>Max Tested: N = {Math.max(...distribution.map((d) => d.factCount))}</span>
      </div>
    </Card>
  );
};

export default FactCountTrend;
