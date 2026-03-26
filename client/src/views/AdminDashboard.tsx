import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Table } from '../components/ui/Table';
import { Skeleton } from '../components/ui/Skeleton';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApiClient, { CrimeReport, User } from '../api';
import PageTransition from '../components/PageTransition';

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      if (userData.role !== 'admin') {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAdminAnalytics();
      setAnalytics(data);
    } catch {
      // Error handled by ApiClient
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading || !analytics) {
    return (
      <div className="text-center py-5">
        <Skeleton className="w-12 h-12 mx-auto rounded-full" />
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="py-4">
        <h2 className="mb-4">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full text-center shadow-sm">
              <Card.Content>
                <div className="text-4xl font-bold text-blue-600">{analytics.total_reports}</div>
                <div className="text-gray-500">Total Reports</div>
              </Card.Content>
            </Card>
          </motion.div>
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="h-full text-center shadow-sm">
              <Card.Content>
                <div className="text-4xl font-bold text-yellow-600">{analytics.pending_reports}</div>
                <div className="text-gray-500">Pending</div>
              </Card.Content>
            </Card>
          </motion.div>
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="h-full text-center shadow-sm">
              <Card.Content>
                <div className="text-4xl font-bold text-blue-600">{analytics.investigating}</div>
                <div className="text-gray-500">Investigating</div>
              </Card.Content>
            </Card>
          </motion.div>
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="h-full text-center shadow-sm">
              <Card.Content>
                <div className="text-4xl font-bold text-green-600">{analytics.resolved_reports}</div>
                <div className="text-gray-500">Resolved</div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>

        {/* By Category and By Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-gray-100 font-bold">Reports by Category</Card.Header>
            <Card.Content>
              <ul className="space-y-0">
                {Object.entries(analytics.by_category || {}).map(([category, count]) => (
                  <li key={category} className="flex justify-between py-2 border-b">
                    <span className="capitalize">{category}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
          <Card className="shadow-sm">
            <Card.Header className="bg-gray-100 font-bold">Reports by Priority</Card.Header>
            <Card.Content>
              <ul className="space-y-0">
                {Object.entries(analytics.by_priority || {}).map(([priority, count]) => (
                  <li key={priority} className="flex justify-between py-2 border-b">
                    <span className="capitalize">{priority}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card className="text-center shadow-sm">
            <Card.Content>
              <div className="text-2xl font-bold">{analytics.total_users}</div>
              <div className="text-gray-500">Total Users</div>
            </Card.Content>
          </Card>
          <Card className="text-center shadow-sm">
            <Card.Content>
              <div className="text-2xl font-bold">{analytics.total_officers}</div>
              <div className="text-gray-500">Police Officers</div>
            </Card.Content>
          </Card>
          <Card className="text-center shadow-sm">
            <Card.Content>
              <div className="text-2xl font-bold text-gray-600">{analytics.closed_reports}</div>
              <div className="text-gray-500">Closed</div>
            </Card.Content>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="shadow-sm">
          <Card.Header className="bg-light fw-bold">Recent Reports</Card.Header>
          <Card.Content className="p-0">
            <Table responsive className="mb-0 table-hover">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Title</th>
                  <th>By</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recent_reports?.map((report) => (
                  <tr key={report.id}>
                    <td className="font-monospace text-muted" style={{ fontSize: '0.75rem' }}>
                      {String(report.id).substring(0, 8)}
                    </td>
                    <td>{report.title}</td>
                    <td>{(report as any).user?.name || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        report.status === 'pending' ? 'bg-warning' :
                        report.status === 'investigating' ? 'bg-info' :
                        report.status === 'resolved' ? 'bg-success' :
                        'bg-secondary'
                      }`}>
                        {report.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Content>
        </Card>
      </div>
    </PageTransition>
  );
}
