import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import ApiClient, { User, CrimeReport } from '../api';
import PageTransition from '../components/PageTransition';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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

  const handleReportSubmit = async (data: { title: string; description: string; category: string; location: string; priority: string; files: FileList | null }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('priority', data.priority);
    
    try {
      await apiClient.createCrimeReport(formData);
      toast.success('Report submitted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      if (userData.role !== 'citizen') {
        navigate('/admin');
        return;
      }
      fetchDashboardData();
    } else {
      navigate('/login');
    }

    setIsDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [navigate]);

  // Real-time polling
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const reportsRes = await apiClient.getMyReports();
      setMyReports(Array.isArray(reportsRes) ? reportsRes : reportsRes.data || []);
      setNotifications([
        // Mock notifications for now
        { id: 1, title: 'Report #123 Status Updated', message: 'Your report is now under investigation', type: 'status', timestamp: new Date().toISOString(), read: false },
        { id: 2, title: 'New Message', message: 'Officer replied to your report', type: 'response', timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
      ]);

      // Mock stats
      setStats({
        totalReports: reportsRes.length || 0,
        pending: reportsRes.filter((r: CrimeReport) => r.status === 'pending').length,
        resolved: reportsRes.filter((r: CrimeReport) => r.status === 'resolved' || r.status === 'closed').length,
        recentActivity: 3
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updateTab = (tab: string) => {
    setSearchParams({ tab });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full"
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
        return <SubmitReport onSubmit={handleReportSubmit} />;
      case 'profile':
        return <ProfileSettings user={user} />;
      case 'notifications':
        return <Notifications notifications={notifications} />;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900/80">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header 
              user={user}
              onLogout={handleLogout}
              notificationsCount={notifications.filter(n => !n.read).length}
              onToggleDarkMode={toggleDarkMode}
            />

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
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


