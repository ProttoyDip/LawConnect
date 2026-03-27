import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { Tabs } from '../components/ui/Tabs';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import PageTransition from '../components/PageTransition';
import ApiClient, { User, CrimeReport } from '../api';

// Common Components
import ProfileHeader from '../components/Dashboard/common/ProfileHeader';

// Admin Components
import OverviewCards from '../components/Dashboard/Admin/OverviewCards';
import UserManagement from '../components/Dashboard/Admin/UserManagement';
import CaseManagement from '../components/Dashboard/Admin/CaseManagement';
import ReportsSection from '../components/Dashboard/Admin/ReportsSection';

// Investigator Components
import AssignedCases from '../components/Dashboard/Investigator/AssignedCases';
import CaseUpdateModal from '../components/Dashboard/Investigator/CaseUpdateModal';
import PerformanceStats from '../components/Dashboard/Investigator/PerformanceStats';
import ActivityTimeline from '../components/Dashboard/Investigator/ActivityTimeline';

// Citizen Components
import MyReports from '../components/Dashboard/Citizen/MyReports';
import SubmitReport from '../components/Dashboard/Citizen/SubmitReport';
import ProfileSettings from '../components/Dashboard/Citizen/ProfileSettings';
import Notifications from '../components/Dashboard/Citizen/Notifications';

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

interface ActivityItem {
  id: number;
  action: string;
  caseTitle?: string;
  timestamp: string;
  type: 'status' | 'note' | 'evidence' | 'assignment';
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: 'update' | 'response' | 'status';
  timestamp: string;
  read: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [myReports, setMyReports] = useState<CrimeReport[]>([]);
  const [allReports, setAllReports] = useState<CrimeReport[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [investigators, setInvestigators] = useState<User[]>([]);
  
  const [selectedCase, setSelectedCase] = useState<CrimeReport | null>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      fetchData(userData.role);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async (role: string) => {
    setLoading(true);
    try {
      if (role === 'citizen') {
        const reports = await apiClient.getMyReports();
        setMyReports(reports);
      } else if (role === 'police') {
        const reports = await apiClient.getAllReports();
        setAllReports(reports);
        setActivities([
          { id: 1, action: 'Case status updated', caseTitle: 'Theft Report', timestamp: new Date().toISOString(), type: 'status' },
          { id: 2, action: 'Evidence uploaded', caseTitle: 'Fraud Investigation', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'evidence' },
          { id: 3, action: 'New case assigned', caseTitle: 'Vandalism Case', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'assignment' },
        ]);
      } else if (role === 'admin') {
        const [analyticsData, reportsData] = await Promise.all([
          apiClient.getAdminAnalytics(),
          apiClient.getAllReports(),
        ]);
        setAnalytics(analyticsData);
        setAllReports(reportsData);
        setInvestigators([
          { id: 2, name: 'John Investigator', email: 'john@lawconnect.com', role: 'police' },
          { id: 3, name: 'Jane Smith', email: 'jane@lawconnect.com', role: 'police' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch {
      // Clear even if API fails
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

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
      const reports = await apiClient.getMyReports();
      setMyReports(reports);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleCaseUpdate = async (caseId: number, status: string, remarks?: string) => {
    try {
      await apiClient.updateReportStatus(caseId, status, remarks);
      toast.success('Case updated successfully');
      const reports = await apiClient.getAllReports();
      setAllReports(reports);
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  if (!user || loading) {
    return (
      <div className="text-center py-5">
        <Skeleton className="w-12 h-12 mx-auto rounded-full" />
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  // Admin Dashboard
  if (user.role === 'admin') {
    return (
      <PageTransition>
        <div className="dashboard-container">
          <ProfileHeader user={user} onLogout={handleLogout} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="dashboard-content"
          >
            <div className="dashboard-section">
              <h3 className="section-title">Overview</h3>
              {analytics && <OverviewCards analytics={analytics} />}
            </div>

            <div className="dashboard-section">
              <h3 className="section-title">Case Management</h3>
              <CaseManagement
                cases={allReports}
                investigators={investigators}
                onAssignInvestigator={(caseId: number, investigatorId: number) => {
                  toast.success(`Case assigned to investigator #${investigatorId}`);
                  handleCaseUpdate(caseId, 'investigating');
                }}
                onUpdateStatus={handleCaseUpdate}
              />
            </div>

            <div className="dashboard-section">
              <h3 className="section-title">User Management</h3>
              <UserManagement
                users={analytics?.recent_reports?.map((r: CrimeReport) => r.user).filter(Boolean) as User[] || []}
              />
            </div>

            <div className="dashboard-section">
              <h3 className="section-title">Reports</h3>
              {analytics && <ReportsSection analytics={analytics} />}
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  // Investigator Dashboard
  if (user.role === 'police') {
    const assignedCases = allReports;
    const completedCases = assignedCases.filter((c: CrimeReport) => c.status === 'resolved' || c.status === 'closed').length;
    const ongoingCases = assignedCases.filter((c: CrimeReport) => c.status === 'investigating').length;

    return (
      <PageTransition>
        <div className="dashboard-container">
          <ProfileHeader user={user} onLogout={handleLogout} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="dashboard-content"
          >
            <div className="dashboard-section">
              <h3 className="section-title">Performance Stats</h3>
              <PerformanceStats
                stats={{
                  totalAssigned: assignedCases.length,
                  completed: completedCases,
                  ongoing: ongoingCases,
                }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <div className="dashboard-section">
                  <h3 className="section-title">Assigned Cases</h3>
                  <AssignedCases
                    cases={assignedCases}
                    onCaseClick={(c: CrimeReport) => {
                      setSelectedCase(c);
                      setShowCaseModal(true);
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="dashboard-section">
                  <h3 className="section-title">Activity</h3>
                  <ActivityTimeline activities={activities} />
                </div>
              </div>
            </div>
          </motion.div>

          <CaseUpdateModal
            show={showCaseModal}
            onHide={() => setShowCaseModal(false)}
            caseItem={selectedCase}
            onUpdateStatus={handleCaseUpdate}
          />
        </div>
      </PageTransition>
    );
  }

  // Citizen Dashboard
  return (
    <PageTransition>
      <div className="dashboard-container">
        <ProfileHeader user={user} onLogout={handleLogout} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="dashboard-content"
        >
          <Tabs items={[
              { key: 'reports', label: 'My Reports', content: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <MyReports
                    reports={myReports}
                    onViewDetails={(report: CrimeReport) => {
                      toast.success(`Viewing report: ${report.title}`);
                    }}
                  />
                  <SubmitReport onSubmit={handleReportSubmit} />
                </div>
              ) },
              { key: 'submit', label: 'Submit Report', content: (
                <SubmitReport onSubmit={handleReportSubmit} />
              ) },
              { key: 'settings', label: 'Profile Settings', content: (
                <ProfileSettings user={user} />
              ) },
              { key: 'notifications', label: 'Notifications', content: (
                <Notifications notifications={notifications} />
              ) }
            ]} />
        </motion.div>
      </div>
    </PageTransition>
  );
}
