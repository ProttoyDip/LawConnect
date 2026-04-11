import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  User, 
  Bell, 
  Settings, 
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Users,
  BarChart3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { getRoleHomePath, isAdminRole, isPoliceRole, type UserRole } from '../../utils/roles';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
  user?: any;
  assignedCasesCount?: number;
  role?: UserRole;
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, onCloseMobile, onLogout, user, assignedCasesCount, role }: SidebarProps) {
  const location = useLocation();
  const showExpandedContent = !isCollapsed || isMobileOpen;
  
  // Role-based navigation items
  const investigatorNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/police', active: true },
    { icon: ClipboardList, label: 'Assigned Cases', href: '/police?tab=assigned' },
    { icon: Bell, label: 'Notifications', href: '/police?tab=notifications' },
    { icon: User, label: 'Profile', href: '/police?tab=profile' },
    { icon: Settings, label: 'Settings', href: '/police?tab=settings' },
  ];

  const citizenNavItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', active: true },
    { icon: FileText, label: 'My Reports', href: '/dashboard?tab=reports' },
    { icon: Plus, label: 'Submit Report', href: '/dashboard?tab=submit' },
    { icon: User, label: 'Profile', href: '/dashboard?tab=profile' },
    { icon: Bell, label: 'Notifications', href: '/dashboard?tab=notifications' },
    { icon: Settings, label: 'Settings', href: '/dashboard?tab=settings' },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', active: true },
    { icon: ClipboardList, label: 'Case Management', href: '/admin?tab=cases' },
    { icon: Users, label: 'User Management', href: '/admin?tab=users' },
    { icon: BarChart3, label: 'Analytics', href: '/admin?tab=analytics' },
    { icon: Bell, label: 'Notifications', href: '/admin?tab=notifications' },
    { icon: Settings, label: 'Settings', href: '/admin?tab=settings' },
  ];

  const navItems = isAdminRole(role) ? adminNavItems : isPoliceRole(role) ? investigatorNavItems : citizenNavItems;

  // Get the base route prefix based on role
  const routePrefix = getRoleHomePath(role);

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.button
            type="button"
            aria-label="Close sidebar overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-slate-900/60 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        className={cn(
          'fixed md:fixed top-0 h-screen w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/80 dark:border-white/20 shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 z-50',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          isCollapsed ? 'md:w-20' : 'md:w-72'
        )}
      >
      {/* Header */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-slate-200/70 dark:border-white/10 flex items-center justify-between gap-2">
        <div className={cn('flex items-center gap-3 overflow-hidden', !showExpandedContent && 'w-full justify-center')}>
          {showExpandedContent && (
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          )}
          <AnimatePresence>
            {showExpandedContent && (
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
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/20 rounded-lg transition-all duration-200 md:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5 text-slate-700 dark:text-white/80" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="hidden md:inline-flex p-2 hover:bg-slate-100 dark:hover:bg-white/20 rounded-lg transition-all duration-200 group"
            aria-label="Toggle sidebar"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5 text-slate-700 dark:text-white/80" /> : <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-white/80" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          
          // Determine active state based on role and current route
          const isActive = (() => {
            const currentPath = location.pathname;
            const currentSearch = location.search || '';
            
            // Check if we're on the correct base path for this role
            if (!currentPath.startsWith(routePrefix)) return false;
            
            // For base route (no tab), check if this item is marked active
            if (!currentSearch.includes('tab=')) {
              return item.active;
            }
            
            // Extract tab value from URL
            const tabMatch = currentSearch.match(/tab=([^&]*)/);
            const currentTab = tabMatch ? tabMatch[1] : '';
            
            // Map label to tab value
            const labelToTab: Record<string, string> = {
              'Dashboard': '',
              'Overview': '',
              'Assigned Cases': 'assigned',
              'Case Management': 'cases',
              'My Reports': 'reports',
              'Submit Report': 'submit',
              'User Management': 'users',
              'Profile': 'profile',
              'Notifications': 'notifications',
              'Settings': 'settings',
              'Analytics': 'analytics',
            };
            
            const itemTab = labelToTab[item.label] || item.label.toLowerCase().replace(/ /g, '');
            
            // Check if the current tab matches this item's tab
            return currentTab === itemTab;
          })();

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onCloseMobile}
              className={cn(
                'group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 h-14',
                'hover:bg-white dark:hover:bg-white/20 hover:border-slate-300 dark:hover:border-white/30 hover:shadow-lg hover:-translate-x-1',
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-300/60 dark:border-white/30 shadow-lg font-semibold text-slate-900 dark:text-white' 
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              )}
            >
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md', 
                isActive ? 'bg-white/70 dark:bg-white/20 backdrop-blur-sm' : 'bg-slate-200/70 dark:bg-white/10 group-hover:bg-white/70 dark:group-hover:bg-white/20'
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {showExpandedContent && (
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
      <div className="p-4 border-t border-slate-200/70 dark:border-white/10">
        <button
          type="button"
          onClick={() => {
            onCloseMobile();
            onLogout?.();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-white/20 transition-all duration-200 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <User className="w-5 h-5 text-white font-bold" />
          </div>
          <AnimatePresence>
            {showExpandedContent && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col text-sm text-slate-600 dark:text-white/80 min-w-0"
              >
                {isAdminRole(user?.role) ? (
                  <>
                    <span id="portal-role" className="font-medium truncate">{user?.name || 'Admin'}</span>
                    <span className="text-xs opacity-75">Administrator</span>
                    <span className="text-xs text-rose-600 dark:text-rose-400">🔒 Admin Access</span>
                  </>
                ) : isPoliceRole(user?.role) ? (
                  <>
                    <span id="portal-role" className="font-medium truncate">Investigator Workspace</span>
                    <span className="text-xs opacity-75">
                      Active Case Monitoring ({assignedCasesCount ?? 0})
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400">🟢 Active</span>
                  </>
                ) : (
                  <>
                    <span id="portal-role" className="font-medium truncate">Citizen Portal</span>
                    <span className="text-xs opacity-75">Secure Reporting</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {showExpandedContent && (
            <LogOut className="w-4 h-4 text-red-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>

      </div>
      </motion.aside>
    </>
  );
}
