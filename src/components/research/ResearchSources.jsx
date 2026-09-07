import React from 'react';
import { ExternalLink, BookOpen, Layers } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { PRIMARY_SOURCES } from '../../data/bdhResearch.js';

/**
 * ResearchSources — Displays primary research sources and papers with verifiable links.
 */
export const ResearchSources = () => {
  return (
    <Card variant="standard" className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lab-border pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-lab-accent" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-lab-text-primary">
            Primary Research Sources & Documentation
          </h2>
        </div>
        <Badge variant="research" size="sm">
          Auditable Literature
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs">
        {PRIMARY_SOURCES.map((source) => (
          <div
            key={source.id}
            className="p-4 rounded-xl bg-lab-secondary/50 border border-lab-border hover:border-lab-border-light transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] text-lab-text-muted">
                <span>{source.organization}</span>
                <span>{source.date}</span>
              </div>

              <h3 className="text-sm font-bold text-lab-text-primary leading-snug">
                {source.title}
              </h3>

              <p className="text-[11px] text-lab-text-secondary leading-relaxed">
                {source.description}
              </p>
            </div>

            <div className="pt-2 border-t border-lab-border/50">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-lab-accent hover:text-lab-accent/80 transition-colors"
                aria-label={`Open external primary source: ${source.title}`}
              >
                <span>Read Research</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ResearchSources;
