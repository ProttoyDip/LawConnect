import { useEffect, useState } from 'react';
import { Card, Col, Row, Spinner, Table } from 'react-bootstrap';
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
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="py-4">
        <h2 className="mb-4">Admin Dashboard</h2>

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col xs={6} md={3}>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-100 text-center shadow-sm">
                <Card.Body>
                  <div className="display-4 fw-bold text-primary">{analytics.total_reports}</div>
                  <div className="text-muted">Total Reports</div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={6} md={3}>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="h-100 text-center shadow-sm">
                <Card.Body>
                  <div className="display-4 fw-bold text-warning">{analytics.pending_reports}</div>
                  <div className="text-muted">Pending</div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={6} md={3}>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="h-100 text-center shadow-sm">
                <Card.Body>
                  <div className="display-4 fw-bold text-info">{analytics.investigating}</div>
                  <div className="text-muted">Investigating</div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          <Col xs={6} md={3}>
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="h-100 text-center shadow-sm">
                <Card.Body>
                  <div className="display-4 fw-bold text-success">{analytics.resolved_reports}</div>
                  <div className="text-muted">Resolved</div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* By Category and By Priority */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-light fw-bold">Reports by Category</Card.Header>
              <Card.Body>
                <ul className="list-unstyled mb-0">
                  {Object.entries(analytics.by_category || {}).map(([category, count]) => (
                    <li key={category} className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-capitalize">{category}</span>
                      <span className="fw-semibold">{count}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-light fw-bold">Reports by Priority</Card.Header>
              <Card.Body>
                <ul className="list-unstyled mb-0">
                  {Object.entries(analytics.by_priority || {}).map(([priority, count]) => (
                    <li key={priority} className="d-flex justify-content-between py-2 border-bottom">
                      <span className="text-capitalize">{priority}</span>
                      <span className="fw-semibold">{count}</span>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="g-4 mb-4">
          <Col xs={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <div className="h2 fw-bold">{analytics.total_users}</div>
                <div className="text-muted">Total Users</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <div className="h2 fw-bold">{analytics.total_officers}</div>
                <div className="text-muted">Police Officers</div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <div className="h2 fw-bold text-secondary">{analytics.closed_reports}</div>
                <div className="text-muted">Closed</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Reports */}
        <Card className="shadow-sm">
          <Card.Header className="bg-light fw-bold">Recent Reports</Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0">
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
          </Card.Body>
        </Card>
      </div>
    </PageTransition>
  );
}
