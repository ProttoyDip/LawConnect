import { useEffect, useState, useCallback } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ApiClient, { CrimeReport, User } from '../api';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import OverviewCards from '../components/Dashboard/Admin/OverviewCards';
import AnalyticsCharts from '../components/Dashboard/Admin/AnalyticsCharts';
import CaseManagement from '../components/Dashboard/Admin/CaseManagement';
import UserManagement from '../components/Dashboard/Admin/UserManagement';
import { 
  Plus, 
  UserPlus, 
  Download, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  LayoutDashboard,
  Bell,
  AlertCircle,
  Info,
  CheckCheck
} from 'lucide-react';

const apiClient = new ApiClient();

interface AnalyticsData {
  total_reports: number;
  pending_reports: number;
  investigating: number;
  resolved_reports: number;
  total_users: number;
  total_officers: number;
  closed_reports: number;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  recent_reports: CrimeReport[];
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'new_user' | 'new_report' | 'case_update' | 'system';
  read: boolean;
  created_at: string;
  related_id?: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'users' | 'analytics' | 'notifications' | 'settings'>('overview');
  const [cases, setCases] = useState<CrimeReport[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [investigators, setInvestigators] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeUsers, setActiveUsers] = useState<Set<number>>(new Set());
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  useEffect(() => {
    // Check URL params for tab
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'cases' || tab === 'users' || tab === 'analytics' || tab === 'notifications' || tab === 'settings') {
      setActiveTab(tab as 'overview' | 'cases' | 'users' | 'analytics' | 'notifications' | 'settings');
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await apiClient.getMe(true);
        setUser(userData);
        if (userData.role !== 'admin') {
          navigate('/dashboard');
        }
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics();
      fetchData();
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const notificationInterval = setInterval(fetchNotifications, 30000);
      const activeUsersInterval = setInterval(() => {
        void fetchActiveUsers();
      }, 60000);
      return () => {
        clearInterval(notificationInterval);
        clearInterval(activeUsersInterval);
      };
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const reportsData = await apiClient.getAllReports();
      setCases(reportsData.data || reportsData);
      
      // Fetch users for user management
      try {
        const usersData = await apiClient.getAdminUsers();
        // Normalize users: role can be an object or string from the API
        const normalizedUsers = (usersData.users || []).map((user: any) => ({
          ...user,
          role: typeof user.role === 'object' ? user.role.name : user.role,
        }));
        setAllUsers(normalizedUsers as User[]);
        const activeIds = Array.isArray(usersData.active_user_ids)
          ? usersData.active_user_ids.map((id: number | string) => Number(id)).filter((id: number) => !Number.isNaN(id))
          : [];
        setActiveUsers(new Set(activeIds));
      } catch (userError) {
        console.error('Failed to fetch users:', userError);
      }
      
      // Fetch officers for case assignment
      try {
        const officersData = await apiClient.getOfficers();
        // Normalize officers: role can be an object or string from the API
        const normalizedOfficers = (officersData || []).map((officer: any) => ({
          ...officer,
          role: typeof officer.role === 'object' ? officer.role.name : officer.role,
        }));
        setInvestigators(normalizedOfficers as User[]);
      } catch (officerError) {
        console.error('Failed to fetch officers:', officerError);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const fetchAnalytics = async (background = false) => {
    if (!background) {
      setLoading(true);
    }
    try {
      const data = await apiClient.getAdminAnalytics();
      setAnalytics(data);
    } catch (error) {
      // Error handled by ApiClient
      // Set default analytics data to prevent infinite loading
      setAnalytics({
        total_reports: 0,
        pending_reports: 0,
        investigating: 0,
        resolved_reports: 0,
        closed_reports: 0,
        total_users: 0,
        total_officers: 0,
        by_category: {},
        by_priority: {},
        recent_reports: [],
      });
    } finally {
      if (!background) {
        setLoading(false);
      }
    }
  };

  const fetchActiveUsers = async () => {
    try {
      const usersData = await apiClient.getAdminUsers();
      const activeIds = Array.isArray(usersData.active_user_ids)
        ? usersData.active_user_ids.map((id: number | string) => Number(id)).filter((id: number) => !Number.isNaN(id))
        : [];
      setActiveUsers(new Set(activeIds));
    } catch (error) {
      console.error('Failed to fetch active users:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await apiClient.getNotifications();
      // API returns { data: [...notifications array], unread_count: X, ... }
      setNotifications(Array.isArray(data.data) ? data.data : []);
    } catch {
      // Error handled by ApiClient
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await apiClient.markNotificationRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch {
      // Error handled by ApiClient
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await apiClient.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch {
      // Error handled by ApiClient
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_user':
        return <UserPlus className="w-5 h-5 text-emerald-500" />;
      case 'new_report':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'case_update':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  if (!user || loading || !analytics) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex items-center justify-center p-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-slate-300 dark:border-white/20 border-t-slate-700 dark:border-t-white rounded-full"
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-x-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_55%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_55%)]" />
        <div className="relative flex min-w-0 w-full">
          {/* Sidebar - fixed, overlaps content on desktop */}
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={closeMobileSidebar}
            onLogout={handleLogout}
            user={user}
            role="admin"
          />
          
          {/* Content - with margin to account for fixed sidebar */}
          <div className={cn(
            "flex min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-300",
            isSidebarCollapsed ? "md:ml-20" : "md:ml-72"
          )}>
            {/* Header */}
            <Header 
              user={user}
              onLogout={handleLogout}
              notificationsCount={unreadNotificationsCount}
              isDarkMode={theme === 'dark'}
              onToggleDarkMode={toggleTheme}
              onOpenMobileMenu={openMobileSidebar}
              onOpenNotifications={() => setShowNotifications(!showNotifications)}
            />

            {/* Main Content */}
            <main
              onClick={() => {
                if (isMobileSidebarOpen) {
                  closeMobileSidebar();
                }
              }}
              className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
            >
              <div className="py-6 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of system statistics and management</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('cases')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'cases'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Cases
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'users'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Users
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'analytics'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap relative ${
                      activeTab === 'notifications'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                </div>

        {/* Tab Content */}
        {activeTab === 'cases' ? (
          <CaseManagement 
            cases={cases} 
            investigators={investigators}
            onAssignInvestigator={async (caseId, investigatorId) => {
              const assignmentResult = await apiClient.assignInvestigator(caseId, investigatorId);
              const assignedOfficer = investigators.find((inv) => inv.id === investigatorId);

              setCases((prevCases) =>
                prevCases.map((caseItem) =>
                  caseItem.id === caseId
                    ? {
                        ...caseItem,
                        status: caseItem.status === 'pending' ? 'under_review' : caseItem.status,
                        assignedTo: assignedOfficer
                          ? { id: assignedOfficer.id, name: assignedOfficer.name, email: assignedOfficer.email }
                          : (caseItem as any).assignedTo,
                        assigned_to: assignedOfficer
                          ? { id: assignedOfficer.id, name: assignedOfficer.name, email: assignedOfficer.email }
                          : (caseItem as any).assigned_to,
                        police_assignment: assignmentResult?.assignment
                          ? {
                              id: assignmentResult.assignment.id,
                              officer_id: assignmentResult.assignment.officer_id,
                              assigned_at: assignmentResult.assignment.assigned_at,
                            }
                          : (caseItem as any).police_assignment,
                      }
                    : caseItem
                )
              );

              void fetchAnalytics(true);
            }}
            onUpdateStatus={async (caseId, status) => {
              await apiClient.updateReportStatus(caseId, status);

              // Optimistically sync the table with the latest status.
              setCases((prevCases) =>
                prevCases.map((caseItem) =>
                  caseItem.id === caseId ? { ...caseItem, status } : caseItem
                )
              );

              // Refresh aggregate cards/charts from source of truth.
              void fetchAnalytics(true);
            }}
          />
        ) : activeTab === 'users' ? (
          <UserManagement
            users={allUsers}
            activeUsers={activeUsers}
            onUserUpdate={(user) => {
              console.log('Update user:', user);
            }}
            onUserDelete={(userId) => {
              console.log('Delete user:', userId);
            }}
            onUserAdd={async (user) => {
              const response = await apiClient.createAdminUser(user);
              const createdUser = response?.user?.data ?? response?.user;

              if (createdUser) {
                setAllUsers((prevUsers) => [
                  {
                    ...createdUser,
                    role: typeof createdUser.role === 'object' ? createdUser.role.name : createdUser.role,
                  } as User,
                  ...prevUsers,
                ]);
              } else {
                await fetchData();
              }

              await fetchAnalytics(true);

              if (response?.mail_sent) {
                toast.success('User created and account email sent.');
              } else {
                toast.success('User created, but account email could not be sent.');
              }
            }}
          />
        ) : activeTab === 'analytics' ? (
          <>
            <AnalyticsCharts 
              byCategory={analytics.by_category}
              byPriority={analytics.by_priority}
              totalReports={analytics.total_reports}
              resolvedReports={analytics.resolved_reports}
              investigating={analytics.investigating}
              pending={analytics.pending_reports}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Reports by Category */}
              <Card>
                <Card.Header className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-white">Reports by Category</span>
                </Card.Header>
                <Card.Content className="pt-4">
                  <div className="space-y-3">
                    {Object.entries(analytics.by_category || {}).map(([category, count]) => {
                      const percentage = analytics.total_reports > 0 
                        ? (count / analytics.total_reports) * 100 
                        : 0;
                      return (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize text-slate-700 dark:text-slate-300">{category}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: 0.8, duration: 0.6 }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Content>
              </Card>

              {/* Reports by Priority */}
              <Card>
                <Card.Header className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-white">Reports by Priority</span>
                </Card.Header>
                <Card.Content className="pt-4">
                  <div className="space-y-3">
                    {Object.entries(analytics.by_priority || {}).map(([priority, count]) => {
                      const colors: Record<string, string> = {
                        low: 'bg-emerald-500',
                        medium: 'bg-amber-500',
                        high: 'bg-orange-500',
                        critical: 'bg-rose-500',
                      };
                      return (
                        <div key={priority} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${colors[priority] || 'bg-slate-500'}`} />
                          <span className="flex-1 capitalize text-sm text-slate-700 dark:text-slate-300">{priority}</span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </>
        ) : activeTab === 'notifications' ? (
          <Card>
            <Card.Header className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">All Notifications</span>
              </div>
              {unreadNotificationsCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all as read
                </Button>
              )}
            </Card.Header>
            <Card.Content className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                  <p className="text-sm mt-1">You'll be notified when something happens</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        'p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer',
                        !notification.read && 'bg-indigo-50/50 dark:bg-indigo-900/10'
                      )}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        !notification.read ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-700'
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn(
                            'text-sm font-medium',
                            notification.read ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        ) : (
        <>
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => navigate('/report-crime')}>
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
          <Button variant="outline" onClick={() => {
            setActiveTab('users');
          }}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin?tab=analytics')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Full Analytics
          </Button>
        </div>

        {/* Stats Cards using OverviewCards */}
        <OverviewCards analytics={{
          total_users: analytics.total_users,
          total_reports: analytics.total_reports,
          investigating: analytics.investigating,
          closed_reports: analytics.resolved_reports
        }} />

        {/* Additional Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <Card.Content className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.pending_reports}</p>
                  <p className="text-sm text-slate-500">Pending Reports</p>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <Card.Content className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.total_officers}</p>
                  <p className="text-sm text-slate-500">Police Officers</p>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="h-full">
              <Card.Content className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{analytics.closed_reports}</p>
                  <p className="text-sm text-slate-500">Closed Cases</p>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <AnalyticsCharts 
          byCategory={analytics.by_category}
          byPriority={analytics.by_priority}
          totalReports={analytics.total_reports}
          resolvedReports={analytics.resolved_reports}
          investigating={analytics.investigating}
          pending={analytics.pending_reports}
        />

        {/* Category and Priority Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="h-full">
              <Card.Header className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">Reports by Category</span>
              </Card.Header>
              <Card.Content className="pt-4">
                <div className="space-y-3">
                  {Object.entries(analytics.by_category || {}).map(([category, count]) => {
                    const percentage = analytics.total_reports > 0 
                      ? (count / analytics.total_reports) * 100 
                      : 0;
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-slate-700 dark:text-slate-300">{category}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{count}</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>
          </motion.div>

          {/* Reports by Priority */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="h-full">
              <Card.Header className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">Reports by Priority</span>
              </Card.Header>
              <Card.Content className="pt-4">
                <div className="space-y-3">
                  {Object.entries(analytics.by_priority || {}).map(([priority, count]) => {
                    const colors: Record<string, string> = {
                      low: 'bg-emerald-500',
                      medium: 'bg-amber-500',
                      high: 'bg-orange-500',
                      critical: 'bg-rose-500',
                    };
                    return (
                      <div key={priority} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[priority] || 'bg-slate-500'}`} />
                        <span className="flex-1 capitalize text-sm text-slate-700 dark:text-slate-300">{priority}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <Card.Header className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-white">Recent Reports</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin?tab=cases')}>
                View All
              </Button>
            </Card.Header>
            <Card.Content className="p-0">
              <div className="overflow-x-auto">
                <Table className="mb-0">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Case ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">By</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recent_reports?.slice(0, 5).map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-500 font-mono">
                          #{String(report.id).substring(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                          {report.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                          {(report as any).user?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            report.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                            report.status === 'investigating' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            report.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {report.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
        </>
        )}
          </div>
        </main>
          </div>
        </div>
      </div>
    </PageTransition>
    );
  }
