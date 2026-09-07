import React from 'react';

/**
 * FactSlider: Interactive control to select number of facts packed into memory.
 */
export const FactSlider = ({
  value = 5,
  min = 2,
  max = 20,
  step = 1,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor="fact-count-slider" className="text-xs font-mono font-medium text-lab-text-secondary uppercase tracking-wider">
          Number of Facts to Remember
        </label>
        <span className="font-mono text-sm font-bold px-2.5 py-0.5 rounded bg-lab-secondary border border-lab-border text-lab-accent">
          {value} facts
        </span>
      </div>

      <div className="relative">
        <input
          id="fact-count-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange && onChange(Number(e.target.value))}
          aria-label="Number of facts to remember in associative recall sequence"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} facts`}
          className="w-full h-2 bg-lab-secondary rounded-lg appearance-none cursor-pointer accent-lab-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-[10px] font-mono text-lab-text-muted mt-1.5 px-0.5" aria-hidden="true">
          <span>{min} (Low Interference)</span>
          <span>{Math.round((min + max) / 2)}</span>
          <span>{max} (High Saturation)</span>
        </div>
      </div>
    </div>
  );
};

export default FactSlider;
