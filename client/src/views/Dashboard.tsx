import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import ApiClient, { User, CrimeReport, StatusUpdate } from '../api';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

// New layout & common
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import OverviewStats from '../components/Dashboard/common/OverviewStats';
import EmptyState from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

// Citizen Components (will be enhanced later)
import MyReports from '../components/Dashboard/Citizen/MyReports';
import SubmitReport from '../components/Dashboard/Citizen/SubmitReport';
import ProfileSettings from '../components/Dashboard/Citizen/ProfileSettings';
import Notifications from '../components/Dashboard/Citizen/Notifications';

const apiClient = new ApiClient();

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'update' | 'response' | 'status';
  timestamp: string;
  read: boolean;
}

interface CitizenStats {
  totalReports: number;
  pending: number;
  resolved: number;
  recentActivity: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [myReports, setMyReports] = useState<CrimeReport[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<CitizenStats>({
    totalReports: 0,
    pending: 0,
    resolved: 0,
    recentActivity: 0
  });

  // Tab state from URL
  const currentTab = searchParams.get('tab') || 'overview';

  const handleReportSubmit = async (data: {
    title: string;
    description: string;
    category: string;
    location: string;
    priority: string;
    occurredAt?: string;
    files: File[];
  }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('priority', data.priority);
    if (data.occurredAt) {
      formData.append('occurred_at', data.occurredAt);
    }
    data.files.forEach((file) => {
      formData.append('evidence[]', file);
    });
    
    try {
      await apiClient.createCrimeReport(formData);
      toast.success('Report submitted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await apiClient.getMe(true);
        setUser(userData);
        if (userData.role !== 'citizen') {
          navigate('/dashboard');
          return;
        }
        fetchDashboardData(true);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        setInitialLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      navigate('/login');
      setInitialLoading(false);
    }
  }, [navigate]);

  // Real-time polling
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async (showInitialLoader = false) => {
    if (showInitialLoader) {
      setInitialLoading(true);
    }

    try {
      const reportsRes = await apiClient.getMyReports();
      const reports = Array.isArray(reportsRes) ? reportsRes : reportsRes.data || [];
      setMyReports(reports);

        // Generate notifications from status updates
        const generatedNotifications: NotificationItem[] = [];
        const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');

        reports.forEach((report: CrimeReport) => {
          const updates = report.status_updates || report.statusUpdates || [];
          if (updates.length > 0) {
            updates.forEach((update: StatusUpdate) => {
              const timestamp = update.created_at || update.createdAt || new Date().toISOString();
              generatedNotifications.push({
                id: update.id,
                title: `Report "${report.title}" – Status Changed`,
                message: update.notes || update.remarks || `Status: ${report.status.replace(/_/g, ' ')}`,
                type: 'status',
                timestamp,
                read: readNotifications.includes(update.id),
              });
            });
          }
        });

        generatedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Add a welcome notification if user has no updates
        if (generatedNotifications.length === 0) {
          generatedNotifications.push({
            id: 0,
            title: 'Welcome to LawConnect',
            message: 'Submit your first crime report to get started',
            type: 'update',
            timestamp: new Date().toISOString(),
            read: false,
          });
        }

        setNotifications(generatedNotifications);
      // Mock stats
      setStats({
        totalReports: reports.length,
        pending: reports.filter((r: CrimeReport) => r.status === 'pending').length,
        resolved: reports.filter((r: CrimeReport) => r.status === 'resolved' || r.status === 'closed').length,
        recentActivity: 3
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
      if ((error as any)?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      if (showInitialLoader) {
        setInitialLoading(false);
      }
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  }, [navigate]);

    const handleMarkNotificationAsRead = (notificationId: number) => {
      const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId);
        localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      }
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const updateTab = (tab: string) => {
    setSearchParams({ tab });
  };

  if (initialLoading || !user) {
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

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <OverviewStats stats={stats} />
          </motion.div>
        );
      case 'reports':
        return <MyReports reports={myReports} />;
      case 'submit':
        return <SubmitReport onSubmit={handleReportSubmit} onViewReports={() => updateTab('reports')} />;
      case 'profile':
        return <ProfileSettings user={user} />;
      case 'notifications':
          return <Notifications notifications={notifications} onMarkAsRead={handleMarkNotificationAsRead} />;
      case 'settings':
        return <ProfileSettings user={user} />;
      default:
        return <EmptyState 
          title="Welcome to LawConnect" 
          description="Your secure citizen portal for reporting and tracking cases. Get started by submitting a report or viewing your dashboard overview."
          action={<Button variant="primary" onClick={() => updateTab('submit')}>Submit Report</Button>}
        />;
    }
  };

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
            role="citizen"
          />
           
          {/* Content - offset for fixed sidebar on desktop */}
          <div className={cn(
            'flex min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-300',
            isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
          )}>
            {/* Header */}
            <Header 
              user={user}
              onLogout={handleLogout}
              notificationsCount={notifications.filter(n => !n.read).length}
              isDarkMode={theme === 'dark'}
              onToggleDarkMode={toggleTheme}
              onOpenMobileMenu={openMobileSidebar}
              onOpenNotifications={() => updateTab('notifications')}
            />

            {/* Main Content */}
            <main
              onClick={() => {
                if (isMobileSidebarOpen) {
                  closeMobileSidebar();
                }
              }}
              className={cn('flex-1 p-4 sm:p-6 lg:p-8', currentTab === 'submit' ? 'overflow-hidden' : 'overflow-y-auto')}
            >
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}


