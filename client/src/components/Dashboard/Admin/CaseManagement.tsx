import { useState } from 'react';
import { Button, Table, Modal, Form, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { CrimeReport, User } from '../../../api';
import toast from 'react-hot-toast';

interface CaseManagementProps {
  cases: CrimeReport[];
  investigators: User[];
  onAssignInvestigator?: (caseId: number, investigatorId: number) => void;
  onUpdateStatus?: (caseId: number, status: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  investigating: 'info',
  resolved: 'success',
  closed: 'secondary',
};

export default function CaseManagement({ 
  cases, 
  investigators,
  onAssignInvestigator,
  onUpdateStatus 
}: CaseManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CrimeReport | null>(null);

  const handleAssign = (caseItem: CrimeReport) => {
    setSelectedCase(caseItem);
    setShowModal(true);
  };

  const handleStatusChange = (caseId: number, status: string) => {
    onUpdateStatus?.(caseId, status);
    toast.success('Case status updated');
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'dark',
    };
    return <Badge bg={colors[priority] || 'secondary'} className="text-uppercase">{priority}</Badge>;
  };

  return (
    <GlassCard>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M10.5 8.5a.5.5 0 0 1-1 0V5.707l-4.146 4.147a.5.5 0 0 1-.708-.708L8.793 5H6.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V8.5z"/>
          </svg>
          Case Management
        </h4>
      </div>

      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {cases.map((caseItem: CrimeReport, index: number) => (
                <motion.tr
                  key={caseItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="text-muted font-monospace">#{String(caseItem.id).substring(0, 8)}</td>
                  <td className="fw-medium">{caseItem.title}</td>
                  <td>{getPriorityBadge(caseItem.priority)}</td>
                  <td>
                    <Badge bg={statusColors[caseItem.status] || 'secondary'}>
                      {caseItem.status?.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td>{(caseItem as any).assignedTo?.name || 'Unassigned'}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleAssign(caseItem)}
                    >
                      Assign
                    </Button>
                    <Form.Select
                      size="sm"
                      value={caseItem.status}
                      onChange={(e) => handleStatusChange(caseItem.id, e.target.value)}
                      style={{ width: 'auto', display: 'inline-block' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </Form.Select>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assign Investigator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select an investigator for case: <strong>{selectedCase?.title}</strong></p>
          <Form>
            <Form.Group>
              <Form.Label>Investigator</Form.Label>
              <Form.Select
                onChange={(e) => {
                  if (selectedCase && e.target.value) {
                    onAssignInvestigator?.(selectedCase.id, parseInt(e.target.value));
                    toast.success('Investigator assigned');
                    setShowModal(false);
                  }
                }}
              >
                <option value="">Select Investigator...</option>
                {investigators.map((inv) => (
                  <option key={inv.id} value={inv.id}>{inv.name} ({inv.email})</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </GlassCard>
  );
}
