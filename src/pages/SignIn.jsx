import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, LogIn, Sparkles } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes/routes';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2 font-mono">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-lab-accent/15 border border-lab-accent/40 flex items-center justify-center text-lab-accent font-bold text-base">
              SL
            </div>
            <span className="text-xl font-bold tracking-tight text-lab-text-primary">
              StateLens
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-lab-text-primary">Welcome back</h1>
          <p className="text-xs text-lab-text-secondary">
            Sign in to access your personal experiment history and saved benchmarks.
          </p>
        </div>

        <Card variant="standard" className="p-6 sm:p-8 space-y-5 font-mono text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-lab-danger/10 border border-lab-danger/30 text-lab-danger flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="signin-email" className="block text-xs font-semibold text-lab-text-primary">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-lab-text-muted absolute left-3 top-3" />
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@lab.org"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-lab-secondary border border-lab-border rounded-lg text-sm text-lab-text-primary placeholder:text-lab-text-muted/50 focus:outline-none focus:ring-1 focus:ring-lab-accent focus:border-lab-accent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="signin-password" className="block text-xs font-semibold text-lab-text-primary">
                  Password
                </label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-[11px] text-lab-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-lab-text-muted absolute left-3 top-3" />
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-lab-secondary border border-lab-border rounded-lg text-sm text-lab-text-primary placeholder:text-lab-text-muted/50 focus:outline-none focus:ring-1 focus:ring-lab-accent focus:border-lab-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-lab-text-muted hover:text-lab-text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              disabled={isLoading}
              icon={LogIn}
            >
              {isLoading ? 'Signing In…' : 'Sign In'}
            </Button>
          </form>

          <div className="pt-3 border-t border-lab-border text-center space-y-2">
            <p className="text-[11px] text-lab-text-secondary">
              Don&rsquo;t have an account yet?{' '}
              <Link to={ROUTES.SIGN_UP} className="text-lab-accent font-bold hover:underline">
                Create account
              </Link>
            </p>

            <Link
              to={ROUTES.EXPERIMENT}
              className="inline-flex items-center gap-1 text-[11px] text-lab-text-muted hover:text-lab-text-secondary transition-colors"
            >
              <span>← Continue exploring without signing in</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
