import { useEffect, useState } from 'react';
import { Badge, Button, Form, Modal, Spinner, Table } from 'react-bootstrap';
import ApiClient, { CrimeReport, User } from '../api';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

const apiClient = new ApiClient();

function statusBadge(status: string) {
  const variants: Record<string, string> = {
    pending: 'warning',
    investigating: 'info',
    resolved: 'success',
    closed: 'secondary',
    rejected: 'danger',
  };
  return (
    <Badge bg={variants[status?.toLowerCase()] || 'secondary'} className="text-capitalize">
      {status}
    </Badge>
  );
}

interface Props {
  /** When true, shows only the logged-in citizen's reports via /my-reports */
  myReports?: boolean;
}

export default function ReportList({ myReports = false }: Props) {
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Status-update modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    fetchReports();
  }, [myReports]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = myReports ? await apiClient.getMyReports() : await apiClient.getAllReports();
      setReports(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      // handled by ApiClient
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (report: CrimeReport) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setRemarks('');
    setShowModal(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedReport) return;
    setUpdating(true);
    try {
      await apiClient.updateReportStatus(selectedReport.id, newStatus, remarks);
      toast.success('Status updated');
      setShowModal(false);
      fetchReports();
    } catch {
      // handled
    } finally {
      setUpdating(false);
    }
  };

  const canUpdateStatus = user && (user.role === 'police' || user.role === 'admin');

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="py-4">
      <h3 className="mb-4">{myReports ? 'My Reports' : 'All Crime Reports'}</h3>

      {reports.length === 0 ? (
        <p className="text-muted">No reports found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              {canUpdateStatus && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.title}</td>
                <td>{r.location}</td>
                <td className="text-capitalize">{r.priority}</td>
                <td>{statusBadge(r.status)}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                {canUpdateStatus && (
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => openStatusModal(r)}>
                      Update
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Status — #{selectedReport?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="rejected">Rejected</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Remarks (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate} disabled={updating}>
            {updating ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </PageTransition>
  );
}
