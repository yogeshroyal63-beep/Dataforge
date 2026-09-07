import React from 'react';
import { Sparkles, Info, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { getExperimentInsights } from '../../utils/experimentAnalytics';

export const ResearchInsights = ({ experiments = [] }) => {
  const insights = getExperimentInsights(experiments);

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-lab-warning shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-lab-accent shrink-0" />;
      case 'notice':
        return <AlertCircle className="w-4 h-4 text-lab-purple shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-lab-accent shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-lab-warning/30 bg-lab-warning/5';
      case 'success':
        return 'border-lab-accent/30 bg-lab-accent/5';
      case 'notice':
        return 'border-lab-purple/30 bg-lab-purple/5';
      default:
        return 'border-lab-border bg-lab-secondary/40';
    }
  };

  return (
    <Card variant="standard" className="p-5 space-y-4 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-lab-accent" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-lab-text-primary">
            Personal Research Observations
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Saved Data Analysis
        </Badge>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${getBorderColor(
              insight.type
            )}`}
          >
            {getIcon(insight.type)}
            <div className="space-y-1">
              <h4 className="font-bold text-lab-text-primary text-xs">{insight.title}</h4>
              <p className="text-lab-text-secondary text-[11px] leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-lab-border pt-2 text-[10px] text-lab-text-muted">
        <span>Framed strictly as descriptive observations of your personal saved dataset.</span>
      </div>
    </Card>
  );
};

export default ResearchInsights;
