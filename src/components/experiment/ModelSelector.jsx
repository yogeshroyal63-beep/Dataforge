import React from 'react';
import { Eye, Layers, Check } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useExperiment } from '../../context/ExperimentContext';

const MODEL_OPTIONS = [
  {
    id: 'both',
    label: 'Both Models',
    description: 'Run Full Attention and Linear Attention side by side.',
    icon: Check,
    accent: 'text-lab-accent',
    border: 'border-lab-accent',
    bg: 'bg-lab-accent/10',
    badge: 'accent',
  },
  {
    id: 'full',
    label: 'Full Attention',
    description: 'Direct pairwise access to all past tokens.',
    icon: Eye,
    accent: 'text-lab-purple',
    border: 'border-lab-purple',
    bg: 'bg-lab-purple/10',
    badge: 'research',
  },
  {
    id: 'linear',
    label: 'Linear Attention',
    description: 'Fixed-size running state accumulation.',
    icon: Layers,
    accent: 'text-lab-accent',
    border: 'border-lab-accent/70',
    bg: 'bg-lab-accent/8',
    badge: 'accent',
  },
];

/**
 * ModelSelector — Choose which attention mechanism(s) to benchmark.
 */
export const ModelSelector = () => {
  const { selectedModels, setSelectedModels, experimentStatus } = useExperiment();
  const isRunning = experimentStatus === 'running';

  return (
    <Card variant="standard" className="p-5 space-y-3">
      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-lab-text-primary border-b border-lab-border pb-2.5">
        Model Selection
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Select attention model(s) to run">
        {MODEL_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedModels === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isRunning}
              onClick={() => setSelectedModels(opt.id)}
              className={`
                text-left p-4 rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-lab-accent focus:ring-offset-1 focus:ring-offset-lab-bg
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isSelected
                  ? `${opt.bg} ${opt.border} shadow-sm`
                  : 'bg-lab-secondary/50 border-lab-border hover:border-lab-border-light'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${isSelected ? opt.accent : 'text-lab-text-muted'}`} />
                <span className={`text-sm font-bold ${isSelected ? opt.accent : 'text-lab-text-primary'}`}>
                  {opt.label}
                </span>
                {isSelected && (
                  <Badge variant={opt.badge} size="sm">selected</Badge>
                )}
              </div>
              <p className="text-[11px] text-lab-text-secondary leading-relaxed font-mono">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default ModelSelector;
