import React from 'react';
import { CheckCircle2, XCircle, Eye, Layers } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const ModelComparisonCard = ({
  fullAttention,
  linearAttention,
  expectedValue,
  title = 'Model Performance Comparison',
}) => {
  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-lab-border pb-3">
        <h3 className="font-bold uppercase tracking-wider text-lab-text-primary text-xs">
          {title}
        </h3>
        <Badge variant="research" size="sm">Side-by-Side Recall</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-lab-border text-[11px] text-lab-text-muted">
              <th className="py-2 px-3 font-semibold">Evaluation Metric</th>
              <th className="py-2 px-3 font-semibold text-lab-purple">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Full Attention
                </span>
              </th>
              <th className="py-2 px-3 font-semibold text-lab-accent">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Linear Attention
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lab-border/40 text-xs">
            <tr>
              <td className="py-2.5 px-3 text-lab-text-secondary">Predicted Recall</td>
              <td className="py-2.5 px-3 font-bold text-lab-text-primary">
                {fullAttention ? fullAttention.prediction : 'Not evaluated'}
              </td>
              <td className="py-2.5 px-3 font-bold text-lab-text-primary">
                {linearAttention ? linearAttention.prediction : 'Not evaluated'}
              </td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-lab-text-secondary">Expected Ground Truth</td>
              <td className="py-2.5 px-3 text-lab-text-secondary">{expectedValue ?? '—'}</td>
              <td className="py-2.5 px-3 text-lab-text-secondary">{expectedValue ?? '—'}</td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-lab-text-secondary">Verification Status</td>
              <td className="py-2.5 px-3">
                {fullAttention ? (
                  fullAttention.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-lab-accent font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-lab-danger font-semibold text-[11px]">
                      <XCircle className="w-3.5 h-3.5" />
                      ✕ Incorrect
                    </span>
                  )
                ) : (
                  <span className="text-lab-text-muted">—</span>
                )}
              </td>
              <td className="py-2.5 px-3">
                {linearAttention ? (
                  linearAttention.isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-lab-accent font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ✓ Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-lab-warning font-semibold text-[11px]">
                      <XCircle className="w-3.5 h-3.5" />
                      ✕ Interference / Mismatch
                    </span>
                  )
                ) : (
                  <span className="text-lab-text-muted">—</span>
                )}
              </td>
            </tr>

            <tr>
              <td className="py-2.5 px-3 text-lab-text-secondary">Confidence / Distribution</td>
              <td className="py-2.5 px-3 font-bold text-lab-purple">
                {fullAttention?.confidence !== undefined ? `${fullAttention.confidence}%` : '—'}
              </td>
              <td className="py-2.5 px-3 font-bold text-lab-accent">
                {linearAttention?.confidence !== undefined ? `${linearAttention.confidence}%` : '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ModelComparisonCard;
