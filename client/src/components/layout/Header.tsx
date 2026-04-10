import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  User,
  LogOut
} from 'lucide-react';
import type { User as ApiUser } from '../../api';

interface HeaderProps {
  user?: ApiUser | null;
  onLogout: () => void;
  notificationsCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMobileMenu: () => void;
  onOpenNotifications?: () => void;
}

export default function Header({ user, onLogout, notificationsCount, isDarkMode, onToggleDarkMode, onOpenMobileMenu, onOpenNotifications }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/20 shadow-xl px-3 py-3 sm:px-4 md:px-6 md:py-4 flex items-center justify-between gap-2 sm:gap-4 relative z-30 overflow-visible transition-colors"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-xl border border-slate-300/70 dark:border-white/20 transition-all duration-200 shadow-lg"
          title="Open navigation"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5 text-slate-700 dark:text-white/80" />
        </motion.button>

        <div className="hidden sm:flex items-center gap-2 text-slate-600 dark:text-white/80 min-w-0">
          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Welcome back,</span>
          <span className="font-semibold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent truncate max-w-[8rem] md:max-w-[14rem]">
            {user?.name || 'Citizen'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <motion.button
          onClick={onOpenNotifications}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 sm:p-3 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-xl sm:rounded-2xl border border-slate-300/70 dark:border-white/20 transition-all duration-200 shadow-lg"
          title="View notifications"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 text-slate-700 dark:text-white/80" />
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleDarkMode}
          className="p-2.5 sm:p-3 bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 rounded-xl sm:rounded-2xl border border-slate-300/70 dark:border-white/20 transition-all duration-200 shadow-lg"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-slate-700 dark:text-white/80" />
          ) : (
            <Moon className="w-5 h-5 text-slate-700 dark:text-white/80" />
          )}
        </motion.button>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 dark:from-indigo-500/20 dark:to-purple-500/20 hover:from-indigo-500/25 hover:to-cyan-500/25 dark:hover:from-indigo-500/30 dark:hover:to-purple-500/30 rounded-xl sm:rounded-2xl border border-indigo-300/60 dark:border-white/30 backdrop-blur-sm transition-all duration-200 shadow-xl"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white font-bold" />
            </div>
            {!showProfileMenu && (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-white/80 transition-transform duration-200" />
            )}
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-[min(16rem,calc(100vw-1rem))] bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-200">
                  <div className="font-semibold text-slate-900 text-sm">{user?.name || 'Citizen'}</div>
                  <div className="text-slate-600 text-xs">{user?.email || 'citizen@lawconnect.com'}</div>
                </div>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(15,23,42,0.08)' }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-100 transition-all duration-200 text-sm font-medium"
                  onClick={() => {
                    setShowProfileMenu(false);
                  }}
                >
                  <User className="w-4 h-4" />
                  View Profile
                </motion.button>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(15,23,42,0.08)' }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-100 transition-all duration-200 text-sm font-medium"
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