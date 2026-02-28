import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      toast.success('Password reset instructions sent!');
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              Check Your Email
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              We've sent password reset instructions to
            </p>
            <p className="mt-1 font-medium text-navy-800 dark:text-navy-400">
              {email}
            </p>
            
            <div className="mt-8 space-y-4">
              <Link
                to="/login"
                className="block w-full py-3 px-6 bg-navy-800 hover:bg-navy-900 text-white font-medium rounded-lg transition-colors text-center"
              >
                Back to Login
              </Link>
              <button
                onClick={() => { setEmailSent(false); setEmail(''); }}
                className="block w-full py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-center"
              >
                Try a different email
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Subtle Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-navy-800 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              Forgot Password?
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Enter your email to receive reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-navy-800 hover:bg-navy-900 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </motion.button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-navy-800 dark:hover:text-navy-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} LawConnect. Official Government System.
        </p>
      </motion.div>
    </div>
  );
}
