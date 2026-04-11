import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import ApiClient from '../api';
import PageTransition from '../components/PageTransition';
import GlassCard from '../components/Dashboard/common/GlassCard';
import { redirectAuthenticatedUser } from '../utils/authRedirect';

const apiClient = new ApiClient();

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();

  const email = useMemo(() => searchParams.get('email')?.trim() ?? '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const runRedirectCheck = async () => {
      if (!isMounted) {
        return;
      }
      await redirectAuthenticatedUser(navigate);
    };

    void runRedirectCheck();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !email) {
      toast.error('Invalid or expired reset link.');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.resetPassword(token, email, password, confirmPassword);
      toast.success('Password reset successful. You can now sign in.');
      navigate('/login', { replace: true });
    } catch {
      // error already handled by ApiClient
    } finally {
      setLoading(false);
    }
  };

  const invalidLink = !token || !email;

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <GlassCard>
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </Link>
              <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                Reset Password
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {invalidLink
                  ? 'This reset link is invalid. Please request a new one.'
                  : `Set a new password for ${email}`}
              </p>
            </div>

            {invalidLink ? (
              <div className="space-y-4">
                <Link
                  to="/forgot-password"
                  className="block w-full py-3 px-6 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-lg transition-colors text-center"
                >
                  Request New Reset Link
                </Link>
                <Link
                  to="/login"
                  className="block text-center text-sm text-navy-800 dark:text-navy-400 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      className="input-field pl-12 pr-12"
                      placeholder="Enter new password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      className="input-field pl-12 pr-12"
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Resetting password...' : 'Reset Password'}
                </motion.button>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </PageTransition>
  );
}
