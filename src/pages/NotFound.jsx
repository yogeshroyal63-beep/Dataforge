import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, Play } from 'lucide-react';
import { ROUTES } from '../routes/routes';
import Button from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-lab-secondary border border-lab-danger/40 flex items-center justify-center text-lab-danger mb-6 shadow-card">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-lab-danger/10 border border-lab-danger/30 text-lab-danger text-xs font-mono mb-4">
        ERROR_STATE_UNREACHABLE
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-lab-text-primary tracking-tight mb-3">
        404 — This state doesn't exist.
      </h1>

      <p className="text-sm sm:text-base text-lab-text-secondary max-w-md mb-8 leading-relaxed">
        The page you're looking for could not be found. The requested memory coordinate is empty or unallocated.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link to={ROUTES.HOME}>
          <Button variant="secondary" icon={Home}>
            Back Home
          </Button>
        </Link>
        <Link to={ROUTES.EXPERIMENT}>
          <Button variant="primary" icon={Play}>
            Run Experiment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
