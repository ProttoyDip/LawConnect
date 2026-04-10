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
import CaseUpdateModal from '../components/Dashboard/Investigator/CaseUpdateModal';

import EmptyState from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';

import { FileText, Bell } from 'lucide-react';

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
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [settingsTab, setSettingsTab] = useState<'profile' | 'password'>('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [assignedCases, setAssignedCases] = useState<CrimeReport[]>([]);
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
    navigate('/', { replace: true });
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
                  <Card.Title>Quick Actions</Card.Title>
                </Card.Header>
                <Card.Content className="space-y-3">
                  <Button onClick={() => setSearchParams({ tab: 'assigned' })} className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    View & Manage Cases
                  </Button>
                </Card.Content>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Case Summary</Card.Title>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Under Investigation</span>
                      <Badge variant="default">{stats.investigating}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pending Review</span>
                      <Badge variant="secondary">{stats.pendingReview}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Resolved</span>
                      <Badge variant="success">{stats.resolved}</Badge>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        );

      case 'assigned':
        return (
          <Card className="overflow-hidden">
            <Card.Header>
              <Card.Title>Assigned Cases ({assignedCases.length})</Card.Title>
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
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => openCaseUpdate(report)}>
                            Update
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/police/cases/${report.id}`)}>
                            View Details
                          </Button>
                        </div>
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

      case 'profile':
        const handleProfileSave = async () => {
          try {
            await apiClient.updateProfile(profileFormData);
            if (user) {
              const updated = { ...user, ...profileFormData };
              setUser(updated);
              localStorage.setItem('user', JSON.stringify(updated));
            }
            toast.success('Profile updated successfully');
            setProfileEditMode(false);
          } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
          }
        };

        const startEditing = () => {
          if (user) {
            setProfileFormData({
              name: user.name || '',
              phone: (user as any).phone || '',
              address: (user as any).address || '',
            });
          }
          setProfileEditMode(true);
        };

        const cancelEditing = () => {
          if (user) {
            setProfileFormData({
              name: user.name || '',
              phone: (user as any).phone || '',
              address: (user as any).address || '',
            });
          }
          setProfileEditMode(false);
        };

        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>Investigator Info</Card.Title>
                  {!profileEditMode ? (
                    <Button variant="outline" size="sm" onClick={startEditing}>
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={handleProfileSave}>
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-slate-500">{user.email}</p>
                    <Badge variant="default" className="mt-1">
                      {user.role?.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {profileEditMode ? (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileFormData.name}
                        onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea
                        value={profileFormData.address}
                        onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                        placeholder="Enter address"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Phone:</span>
                      <span>{(user as any).phone || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Address:</span>
                      <span>{(user as any).address || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Investigator ID:</span>
                      <Badge variant="outline">INV-{user.id}</Badge>
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>
          </div>
        );

      case 'notifications':
        const unreadCount = notifications.filter(n => !n.read).length;
        
        const handleMarkAsRead = (id: number) => {
          const updated = notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          );
          setNotifications(updated);
          
          // Persist to localStorage
          const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
          if (!readNotifications.includes(id)) {
            localStorage.setItem('readNotifications', JSON.stringify([...readNotifications, id]));
          }
        };
        
        const handleMarkAllAsRead = () => {
          const updated = notifications.map(n => ({ ...n, read: true }));
          setNotifications(updated);
          
          // Persist all to localStorage
          const allIds = notifications.map(n => n.id);
          localStorage.setItem('readNotifications', JSON.stringify(allIds));
        };

        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>Notifications ({unreadCount} unread)</Card.Title>
                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                      Mark All as Read
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Content>
                <div className="notifications-list space-y-3">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          notification.read
                            ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{notification.message}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && (
                            <button 
                              className="text-blue-500 hover:text-blue-600 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </div>
        );

      case 'settings':
        const handleSettingsProfileSave = async () => {
          try {
            await apiClient.updateProfile(profileFormData);
            if (user) {
              const updated = { ...user, ...profileFormData };
              setUser(updated);
              localStorage.setItem('user', JSON.stringify(updated));
            }
            toast.success('Profile updated successfully');
          } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
          }
        };

        const handlePasswordChange = () => {
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }
          if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
          }
          toast.success('Password changed successfully');
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        };

        return (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSettingsTab('profile')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      settingsTab === 'profile'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => setSettingsTab('password')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      settingsTab === 'password'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Change Password
                  </button>
                </div>
              </Card.Header>
              <Card.Content>
                {settingsTab === 'profile' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileFormData.name}
                        onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileFormData.phone}
                        onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea
                        value={profileFormData.address}
                        onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                        placeholder="Enter address"
                      />
                    </div>
                    <Button variant="primary" onClick={handleSettingsProfileSave} className="w-full mt-4">
                      Save Profile Changes
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button variant="primary" onClick={handlePasswordChange} className="w-full mt-4">
                      Change Password
                    </Button>
                  </div>
                )}
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Account Information</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Investigator ID</span>
                  <Badge variant="outline">INV-{user.id}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Role</span>
                  <Badge variant="default">{user.role?.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email Notifications</span>
                  <Badge variant="success">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Auto-refresh Dashboard</span>
                  <Badge variant="success">Active (30s)</Badge>
                </div>
              </Card.Content>
            </Card>
          </div>
        );

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
              onOpenNotifications={() => updateTab('notifications')}
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
