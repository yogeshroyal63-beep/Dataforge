import React from 'react';

/**
 * Reusable Card component for scientific dashboard & learning panels.
 * Variants: standard, elevated, interactive, metric, research
 */
export const Card = ({
  children,
  variant = 'standard',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-all duration-200';

  const variantStyles = {
    standard: 'bg-lab-surface/90 border border-lab-border text-lab-text-primary p-6 backdrop-blur-sm',
    elevated: 'bg-lab-secondary border border-lab-border/80 shadow-elevated text-lab-text-primary p-6',
    interactive: 'bg-lab-surface/90 border border-lab-border hover:border-lab-accent/50 hover:shadow-lab-glow cursor-pointer text-lab-text-primary p-6 backdrop-blur-sm group',
    metric: 'bg-lab-surface/60 border border-lab-border p-5 rounded-lg text-lab-text-primary',
    research: 'bg-gradient-to-br from-lab-surface via-[#121824] to-lab-secondary border border-lab-purple/30 p-6 text-lab-text-primary relative overflow-hidden',
  };

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.standard} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
