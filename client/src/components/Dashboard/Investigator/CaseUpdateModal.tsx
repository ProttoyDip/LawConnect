import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { FormGroup, FormLabel, FormSelect, FormTextarea, FormInput } from '../../ui/Form';

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
    <Modal show={show} onHide={onHide} title={`Update Case: ${caseItem.title}`} className="max-w-4xl">
      <div className="p-6 space-y-4">
        <div className="mb-4">
          <h6>Case Details</h6>
          <p className="text-muted mb-1">ID: <span className="font-monospace">#{String(caseItem.id).substring(0, 8)}</span></p>
          <p className="text-muted mb-1">Status: <Badge variant={statusColors[caseItem.status]}>{caseItem.status}</Badge></p>
          <p className="text-muted mb-0">Priority: <Badge variant="danger">{caseItem.priority}</Badge></p>
        </div>

        <FormGroup>
            <FormLabel>Update Status</FormLabel>
            <FormSelect
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
            >
              <option value="">Select new status...</option>
              <option value="pending">Pending</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Add Notes</FormLabel>
            <FormTextarea
              rows={4}
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              placeholder="Add notes about the case progress..."
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Upload Evidence</FormLabel>
            <FormInput
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setFiles(target.files);
              }}
            />
            <div className="text-muted text-xs mt-1">
              Upload supporting documents, images, or evidence files.
            </div>
          </FormGroup>
      </div>
      <div className="flex gap-2 justify-end p-6 border-t bg-gray-50 dark:bg-slate-800 rounded-b-lg">
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
      </div>
    </Modal>
  );
}
