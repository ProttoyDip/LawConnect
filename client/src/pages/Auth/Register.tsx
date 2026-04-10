import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Shield, Phone, MapPin } from 'lucide-react';
import ApiClient from '../../api';
import toast from 'react-hot-toast';
import { redirectAuthenticatedUser } from '../../utils/authRedirect';

const apiClient = new ApiClient();

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect authenticated users away from register page
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

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !nationalId.trim()
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await apiClient.register(
        name,
        email,
        password,
        confirmPassword,
        nationalId,
        'citizen',
        phone,
        address
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Registration successful');
      navigate('/dashboard');
    } catch {
      // error already handled by ApiClient
    } finally {
      setLoading(false);
    }
  };

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
                <Shield className="w-6 h-6 text-white" />
              </div>
            </Link>
            <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Register with LawConnect
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  className="input-field pl-12 pr-4"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="input-field pl-12 pr-4"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* National ID */}
            <div>
              <label htmlFor="nationalId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                National ID *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="nationalId"
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  autoComplete="off"
                  className="input-field pl-12 pr-4"
                  placeholder="Enter your National ID"
                  maxLength={20}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  className="input-field pl-12 pr-4"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  rows={2}
                  className="input-field pl-12 pr-4 py-3 resize-none"
                  placeholder="Your address"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password *
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
                  placeholder="••••••••"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="input-field pl-12 pr-4"
                  placeholder="••••••••"
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
              className="w-full py-3 px-6 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-navy-800 dark:text-navy-400 font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} LawConnect. Official Government System.
        </p>
      </motion.div>
    </div>
  );
}
