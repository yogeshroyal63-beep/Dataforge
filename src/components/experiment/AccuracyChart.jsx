import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Custom Tooltip for the retention curve line chart.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-lab-secondary border border-lab-border rounded-lg shadow-lg font-mono text-xs space-y-1.5">
        <div className="font-bold text-lab-text-primary border-b border-lab-border pb-1">
          Sequence Length: {label} facts
        </div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span style={{ color: entry.color }} className="font-semibold">
              {entry.name}:
            </span>
            <span className="font-bold text-lab-text-primary">
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * AccuracyChart — Recharts visualization of measured toy recall retention curves
 * across varying sequence lengths (N = 2..20).
 *
 * @param {{
 *   data: Array<{
 *     factCount: number,
 *     fullAttentionAccuracy: number,
 *     linearAttentionAccuracy: number
 *   }> | null
 * }} props
 */
export const AccuracyChart = ({ data }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <Card variant="standard" className="p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-2.5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-lab-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Recall Retention Curve (Measured Accuracy)
          </h3>
        </div>
        <Badge variant={hasData ? 'success' : 'default'} size="sm" dot={hasData}>
          {hasData ? 'Benchmark Data Plotted' : 'Awaiting Benchmark Run'}
        </Badge>
      </div>

      <p className="text-[11px] font-mono text-lab-text-secondary leading-relaxed">
        Compares measured associative recall accuracy across sequence lengths from 2 to 20 facts.
      </p>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis
                dataKey="factCount"
                stroke="#737373"
                tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
                unit=" facts"
              />
              <YAxis
                domain={[0, 100]}
                stroke="#737373"
                tick={{ fill: '#737373', fontSize: 11, fontFamily: 'monospace' }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: '10px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="fullAttentionAccuracy"
                name="Full Attention (O(N) KV cache)"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#a855f7' }}
                activeDot={{ r: 6, fill: '#a855f7' }}
              />
              <Line
                type="monotone"
                dataKey="linearAttentionAccuracy"
                name="Linear Attention (O(1) State)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#10b981' }}
                activeDot={{ r: 6, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-lab-border rounded-xl p-6 text-center space-y-2">
            <Info className="w-6 h-6 text-lab-text-muted" />
            <p className="text-xs font-mono text-lab-text-secondary">
              No benchmark has been computed yet.
            </p>
            <p className="text-[11px] font-mono text-lab-text-muted max-w-sm">
              Click &ldquo;Run Accuracy Benchmark&rdquo; below to evaluate both attention mechanisms across sequence lengths from 2 to 20 facts.
            </p>
          </div>
        )}
      </div>

      {hasData && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-lab-secondary/50 border border-lab-border text-[10px] font-mono text-lab-text-muted">
          <Info className="w-3.5 h-3.5 text-lab-accent shrink-0 mt-0.5" />
          <span>
            Every point on this curve represents measured performance testing every fact as a query in that sequence condition.
          </span>
        </div>
      )}
    </Card>
  );
};

export default AccuracyChart;
