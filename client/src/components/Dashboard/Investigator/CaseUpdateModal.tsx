import { useState } from 'react';
import { Button, Modal, Form, Badge } from 'react-bootstrap';
import { CrimeReport } from '../../../api';
import toast from 'react-hot-toast';

interface CaseUpdateModalProps {
  show: boolean;
  onHide: () => void;
  caseItem: CrimeReport | null;
  onUpdateStatus?: (caseId: number, status: string, remarks?: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  investigating: 'info',
  resolved: 'success',
  closed: 'secondary',
};

export default function CaseUpdateModal({ 
  show, 
  onHide, 
  caseItem,
  onUpdateStatus 
}: CaseUpdateModalProps) {
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = () => {
    if (caseItem) {
      onUpdateStatus?.(caseItem.id, status, notes);
      toast.success('Case updated successfully');
      setStatus('');
      setNotes('');
      setFiles(null);
      onHide();
    }
  };

  if (!caseItem) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Case: {caseItem.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h6>Case Details</h6>
          <p className="text-muted mb-1">ID: <span className="font-monospace">#{String(caseItem.id).substring(0, 8)}</span></p>
          <p className="text-muted mb-1">Status: <Badge bg={statusColors[caseItem.status]}>{caseItem.status}</Badge></p>
          <p className="text-muted mb-0">Priority: <Badge bg="danger">{caseItem.priority}</Badge></p>
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Update Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select new status...</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Add Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about the case progress..."
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Evidence</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setFiles(target.files);
              }}
            />
            <Form.Text className="text-muted">
              Upload supporting documents, images, or evidence files.
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!status && !notes}
        >
          Update Case
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
