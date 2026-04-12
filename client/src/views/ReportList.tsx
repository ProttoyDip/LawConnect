import { useEffect, useState } from 'react';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { FormGroup, FormLabel, FormSelect, FormTextarea } from '../components/ui/Form';
import ApiClient, { CrimeReport, User } from '../api';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import { isAdminRole } from '../utils/roles';

const apiClient = new ApiClient();

function statusBadge(status: string) {
  const variants: Record<string, 'warning' | 'info' | 'success' | 'secondary' | 'danger'> = {
    pending: 'warning',
    investigating: 'info',
    resolved: 'success',
    closed: 'secondary',
    rejected: 'danger',
  };
  return (
    <Badge variant={variants[status?.toLowerCase()] || 'secondary'} className="capitalize">
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

  const canUpdateStatus = user && (user.role === 'police' || isAdminRole(user.role));

  if (loading) {
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
      <h3 className="mb-4">{myReports ? 'My Reports' : 'All Crime Reports'}</h3>

      {reports.length === 0 ? (
        <p className="text-muted">No reports found.</p>
      ) : (
        <Table responsive striped hover>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              {canUpdateStatus && <TableHead>Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.location}</TableCell>
                <TableCell className="text-capitalize">{r.priority}</TableCell>
                <TableCell>{statusBadge(r.status)}</TableCell>
                <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                {canUpdateStatus && (
                  <TableCell>
                    <Button size="sm" variant="outline-primary" onClick={() => openStatusModal(r)}>
                      Update
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} title={`Update Status — #${selectedReport?.id}`}>
        <FormGroup>
          <FormLabel>Status</FormLabel>
          <FormSelect value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </FormSelect>
        </FormGroup>
        <FormGroup>
          <FormLabel>Remarks (optional)</FormLabel>
          <FormTextarea 
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add remarks..."
          />
        </FormGroup>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate} loading={updating} disabled={updating}>
            Save
          </Button>
        </div>
      </Modal>
    </div>
    </PageTransition>
  );
}
