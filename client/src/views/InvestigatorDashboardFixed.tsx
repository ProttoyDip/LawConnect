import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import ApiClient, { User, CrimeReport, StatusUpdate } from '../api';
import PageTransition from '../components/PageTransition';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import OverviewStats from '../components/Dashboard/common/OverviewStats';

import EmptyState from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Card } from '../components/ui/Card';

import { FileText } from 'lucide-react';
import CaseUpdateModal from '../components/Dashboard/Investigator/CaseUpdateModal';

const apiClient = new ApiClient();

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'update' | 'assignment' | 'status';
  timestamp: string;
  read: boolean;
}

interface InvestigatorStats {
  totalAssigned: number;
  investigating: number;
  pendingReview: number;
  resolved: number;
  recentUpdates: number;
}

export default function InvestigatorDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [assignedCases, setAssignedCases] = useState<CrimeReport[]>([]);
  const [allCases, setAllCases] = useState<CrimeReport[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [stats, setStats] = useState<InvestigatorStats>({
    totalAssigned: 0,
    investigating: 0,
    pendingReview: 0,
    resolved: 0,
    recentUpdates: 0,
  });
  const [selectedCase, setSelectedCase] = useState<CrimeReport | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const currentTab = searchParams.get('tab') || 'overview';

  const fetchDashboardData = useCallback(
    async (showLoader = false) => {
      if (showLoader) setInitialLoading(true);

      try {
        const allReportsRes = await apiClient.getAllReports();
        const allReports = Array.isArray(allReportsRes) ? allReportsRes : allReportsRes.data || [];
        setAllCases(allReports);

        const assigned = allReports.filter((report: CrimeReport & { police_assignment?: { officer_id?: number; police_id?: number } }) => {
          const assignedOfficerId = report.police_assignment?.officer_id ?? report.police_assignment?.police_id;
          return assignedOfficerId === user?.id || report.status === 'investigating';
        });

        setAssignedCases(assigned);

        setStats({
          totalAssigned: assigned.length,
          investigating: assigned.filter((report: CrimeReport) => report.status === 'investigating').length,
          pendingReview: assigned.filter((report: CrimeReport) => report.status === 'under_review').length,
          resolved: assigned.filter((report: CrimeReport) => report.status === 'resolved' || report.status === 'closed').length,
          recentUpdates: 5,
        });

        const generatedNotifications: NotificationItem[] = [];
        const readNotifications: string[] = JSON.parse(localStorage.getItem('readNotifications') || '[]');

        assigned.forEach((report: CrimeReport) => {
          const updates = report.status_updates || [];

          updates.forEach((update: StatusUpdate) => {
            generatedNotifications.push({
              id: update.id,
              title: `Case ${report.id}: ${update.status}`,
              message: update.notes || update.remarks || '',
              type: 'status',
              timestamp: update.created_at || update.createdAt || new Date().toISOString(),
              read: readNotifications.includes(String(update.id)),
            });
          });
        });

        generatedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(generatedNotifications.slice(0, 10));
      } catch (error) {
        console.error('Investigator dashboard error:', error);
      } finally {
        if (showLoader) setInitialLoading(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await apiClient.getMe(true);

        if (userData.role !== 'police') {
          navigate('/dashboard');
          return;
        }

        setUser(userData);
        void fetchDashboardData(true);
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
  }, [fetchDashboardData, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      void fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.logout();
      toast.success('Logged out successfully');
    } catch {
      // ignore logout request errors and continue clearing client state
    }

    localStorage.clear();
    navigate('/login', { replace: true });
  }, [navigate]);

  const openCaseUpdate = (report: CrimeReport) => {
    setSelectedCase(report);
    setShowUpdateModal(true);
  };

  if (initialLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-blue-300 dark:border-blue-500 border-t-blue-600 dark:border-t-blue-400 rounded-full"
        />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <OverviewStats
              stats={{
                totalReports: stats.totalAssigned,
                pending: stats.investigating + stats.pendingReview,
                resolved: stats.resolved,
                recentActivity: stats.recentUpdates,
              }}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <Card.Header>
                  <Card.Title>Recent Activity</Card.Title>
                </Card.Header>
                <Card.Content>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notif) => (
                      <div key={notif.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{notif.title}</div>
                          <div className="text-sm text-slate-500">{new Date(notif.timestamp).toLocaleString()}</div>
                        </div>
                        {!notif.read && <Badge variant="destructive">New</Badge>}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No recent activity yet.</p>
                  )}
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Quick Actions</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-3">
                  <Button onClick={() => setSearchParams({ tab: 'assigned' })} className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View Assigned Cases
                  </Button>
                  <Button
                    onClick={() => setSearchParams({ tab: 'all' })}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    All Open Cases
                  </Button>
                </Card.Content>
              </Card>
            </div>
          </div>
        );

      case 'assigned':
        return (
          <Card className="overflow-hidden">
            <Card.Header>
              <Card.Title>Assigned Cases ({stats.totalAssigned})</Card.Title>
            </Card.Header>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {assignedCases.length > 0 ? (
                  assignedCases.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>#{report.id}</TableCell>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === 'investigating'
                              ? 'default'
                              : report.status === 'resolved'
                                ? 'success'
                                : 'secondary'
                          }
                        >
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.priority?.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="secondary" size="sm" onClick={() => openCaseUpdate(report)}>
                          Update Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                      No assigned cases found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        );

      case 'all':
        return (
          <Card>
            <Card.Header>
              <Card.Title>All Open Cases ({allCases.length})</Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-slate-500">All cases view (enhance with filters).</p>
            </Card.Content>
          </Card>
        );

      case 'profile':
        return <div>Investigator Profile (reuse UserProfile)</div>;

      default:
        return <EmptyState title="Investigator Dashboard" description="Manage assigned cases and updates." />;
    }
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const updateTab = (tab: string) => setSearchParams({ tab });

  return (
    <PageTransition>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.15),transparent_50%)]" />

        <div className="relative flex min-w-0 h-screen overflow-hidden w-full">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobile={closeMobileSidebar}
            onLogout={handleLogout}
            user={user}
            assignedCasesCount={assignedCases.length}
            role="police"
          />

          {/* Content - offset for fixed sidebar on desktop */}
          <div
            className={cn(
              'flex min-w-0 flex-1 flex-col overflow-hidden transition-all duration-300',
              isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
            )}
          >
            <Header
              user={user}
              onLogout={handleLogout}
              notificationsCount={notifications.filter((n) => !n.read).length}
              isDarkMode={theme === 'dark'}
              onToggleDarkMode={toggleTheme}
              onOpenMobileMenu={openMobileSidebar}
              onOpenNotifications={() => updateTab('overview')}
            />

            <main className="flex-1 overflow-y-auto p-6" onClick={closeMobileSidebar}>
              <motion.div key={currentTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-7xl mx-auto">
                {renderTabContent()}
              </motion.div>
            </main>
          </div>
        </div>

        {selectedCase && (
          <CaseUpdateModal
            caseItem={selectedCase}
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
            onUpdateStatus={async (caseId, status, remarks) => {
              await apiClient.updateReportStatus(caseId, status, remarks);
              await fetchDashboardData();
            }}
          />
        )}
      </div>
    </PageTransition>
  );
}
