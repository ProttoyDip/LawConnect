import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Shield, Users } from 'lucide-react';
import ApiClient from '../api';
import toast from 'react-hot-toast';

const apiClient = new ApiClient();

type RoleType = 'admin' | 'investigator' | 'general';

const roleTabs = [
  { id: 'general' as RoleType, label: 'Citizen', icon: Users },
  { id: 'investigator' as RoleType, label: 'Investigator', icon: Shield },
  { id: 'admin' as RoleType, label: 'Admin', icon: Shield },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleType, setRoleType] = useState<RoleType>('general');
  const [adminId, setAdminId] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [policeStation, setPoliceStation] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const loginData: Record<string, string> = {
        email,
        password,
        role_type: roleType,
      };

      if (roleType === 'admin') {
        loginData.admin_id = adminId;
        loginData.security_code = securityCode;
      } else if (roleType === 'investigator') {
        loginData.badge_number = badgeNumber;
        loginData.police_station = policeStation;
      } else {
        loginData.national_id = nationalId;
      }

      const data = await apiClient.loginWithRole(loginData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Logged in successfully');
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
              Sign In
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Access your LawConnect account
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex p-1 rounded-lg bg-slate-100 dark:bg-slate-700 mb-6">
            {roleTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleType(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  roleType === tab.id
                    ? 'bg-white dark:bg-slate-600 text-navy-800 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="input-field pl-12 pr-4"
                  placeholder="you@example.com"
                  required
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
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                  required
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

            {/* Role-specific fields */}
            {roleType === 'admin' && (
              <>
                <div>
                  <label htmlFor="adminId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Admin ID
                  </label>
                  <input
                    id="adminId"
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="input-field pl-4 pr-4"
                    placeholder="Enter your Admin ID"
                  />
                </div>
                <div>
                  <label htmlFor="securityCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Security Code
                  </label>
                  <input
                    id="securityCode"
                    type="text"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    className="input-field pl-4 pr-4"
                    placeholder="Enter your Security Code"
                  />
                </div>
              </>
            )}

            {roleType === 'investigator' && (
              <>
                <div>
                  <label htmlFor="badgeNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Badge Number
                  </label>
                  <input
                    id="badgeNumber"
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="input-field pl-4 pr-4"
                    placeholder="Enter your Badge Number"
                  />
                </div>
                <div>
                  <label htmlFor="policeStation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Police Station
                  </label>
                  <input
                    id="policeStation"
                    type="text"
                    value={policeStation}
                    onChange={(e) => setPoliceStation(e.target.value)}
                    className="input-field pl-4 pr-4"
                    placeholder="Enter your Police Station"
                  />
                </div>
              </>
            )}

            {roleType === 'general' && (
              <div>
                <label htmlFor="nationalId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  National ID
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    id="nationalId"
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="input-field pl-12 pr-4"
                    placeholder="Enter your National ID"
                  />
                </div>
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-navy-800 dark:text-navy-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-navy-800 dark:text-navy-400 font-medium hover:underline">
              Register here
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
