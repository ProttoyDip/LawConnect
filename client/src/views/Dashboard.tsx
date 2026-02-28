import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { User } from '../api';
import PageTransition from '../components/PageTransition';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  const isCitizen = user.role === 'citizen';
  const isPoliceOrAdmin = user.role === 'police' || user.role === 'admin';

  return (
    <PageTransition>
      <div className="py-4">
        <h2 className="mb-4">Welcome, {user.name}</h2>
        <p className="text-muted mb-4">
          Role: <strong className="text-capitalize">{user.role}</strong>
        </p>

        <Row className="g-4">
          {isCitizen && (
            <>
              <Col md={6} lg={4}>
                <motion.div
                  whileInView={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>Report a Crime</Card.Title>
                      <Card.Text className="flex-grow-1">
                        Submit a new crime report with details and evidence.
                      </Card.Text>
                      <Button variant="danger" onClick={() => navigate('/report-crime')}>
                        File Report
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              <Col md={6} lg={4}>
                <motion.div
                  whileInView={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>My Reports</Card.Title>
                      <Card.Text className="flex-grow-1">
                        View the status and history of your submitted reports.
                      </Card.Text>
                      <Button variant="primary" onClick={() => navigate('/my-reports')}>
                        View Reports
                      </Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </>
          )}

          {isPoliceOrAdmin && (
            <Col md={6} lg={4}>
              <motion.div
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>All Crime Reports</Card.Title>
                    <Card.Text className="flex-grow-1">
                      Browse, review and update the status of all crime reports.
                    </Card.Text>
                    <Button variant="primary" onClick={() => navigate('/reports')}>
                      View All Reports
                    </Button>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          )}
        </Row>
      </div>
    </PageTransition>
  );
}
