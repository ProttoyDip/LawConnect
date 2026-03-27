import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', active: true },
    { icon: FileText, label: 'My Reports', href: '/dashboard?tab=reports' },
    { icon: Plus, label: 'Submit Report', href: '/dashboard?tab=submit' },
    { icon: User, label: 'Profile', href: '/dashboard?tab=profile' },
    { icon: Bell, label: 'Notifications', href: '/dashboard?tab=notifications' },
    { icon: Settings, label: 'Settings', href: '/dashboard?tab=settings' },
  ];

  return (
    <motion.aside
      initial={{ width: isCollapsed ? '80px' : '280px' }}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className={cn(
        'h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl flex flex-col overflow-hidden',
        'dark:bg-slate-900/80',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className={cn('flex items-center gap-3 overflow-hidden', isCollapsed && 'w-full justify-center')}>
          {!isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"
              >
                LawConnect
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200 group"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 text-white/80" /> : <ChevronLeft className="w-5 h-5 text-white/80" />}
          </motion.div>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === '/dashboard' && (location.search?.includes('tab=') ? 
            location.search.includes(`tab=${item.label.toLowerCase().replace(' ', '')}`) : item.active);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 h-14',
                'hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:-translate-x-1',
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/30 shadow-lg font-semibold' 
                  : 'text-white/70 hover:text-white'
              )}
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md', 
                isActive ? 'bg-white/20 backdrop-blur-sm' : 'bg-white/10 group-hover:bg-white/20'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/20 transition-all duration-200 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <User className="w-5 h-5 text-slate-900 font-bold" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col text-sm text-white/80 min-w-0"
              >
                <span className="font-medium truncate">Citizen Portal</span>
                <span className="text-xs opacity-75">Secure Reporting</span>
              </motion.div>
            )}
          </AnimatePresence>
          {!isCollapsed && (
            <LogOut className="w-4 h-4 text-red-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
    </motion.aside>
  );
}

