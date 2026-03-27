import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  ChevronDown, 
  Moon, 
  Sun,
  User,
  LogOut 
} from 'lucide-react';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  notificationsCount: number;
  onToggleDarkMode: () => void;
}

export default function Header({ user, onLogout, notificationsCount, onToggleDarkMode }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl px-6 py-4 flex items-center justify-between"
    >
      {/* Left: Quick Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-white/80">
          <span className="text-sm font-medium">Welcome back,</span>
          <span className="font-semibold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            {user?.name || 'Citizen'}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all duration-200 shadow-lg"
        >
          <Bell className="w-5 h-5 text-white/80" />
          {notificationsCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
            >
              {notificationsCount > 9 ? '9+' : notificationsCount}
            </motion.span>
          )}
        </motion.button>

        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleDarkMode}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all duration-200 shadow-lg"
          title="Toggle Dark Mode"
        >
          <Sun className="w-5 h-5 text-white/80 dark:hidden" />
          <Moon className="w-5 h-5 text-white/80 hidden dark:block" />
        </motion.button>

        {/* Profile Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 rounded-2xl border border-white/30 backdrop-blur-sm transition-all duration-200 shadow-xl"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white font-bold" />
            </div>
            {!showProfileMenu && (
              <ChevronDown className="w-4 h-4 text-white/80 transition-transform duration-200" />
            )}
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl py-2 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="font-semibold text-white text-sm">{user?.name || 'Citizen'}</div>
                  <div className="text-white/70 text-xs">{user?.email || 'citizen@lawconnect.com'}</div>
                </div>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white/90 hover:bg-white/20 transition-all duration-200 text-sm font-medium"
                  onClick={() => {
                    setShowProfileMenu(false);
                    // Navigate to profile tab
                  }}
                >
                  <User className="w-4 h-4" />
                  View Profile
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-white/90 hover:bg-white/20 transition-all duration-200 text-sm font-medium"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}

