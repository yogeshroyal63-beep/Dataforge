import React from 'react';

/**
 * Reusable SectionHeader component for academic and laboratory section introductions.
 */
export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) => {
  const alignStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-10 ${alignStyles[align] || alignStyles.center} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-mono font-semibold tracking-widest uppercase text-lab-accent mb-2 px-2.5 py-0.5 rounded bg-lab-accent/10 border border-lab-accent/20">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-lab-text-primary mt-1">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-sm sm:text-base text-lab-text-secondary mt-3 leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
