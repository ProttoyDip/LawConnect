import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import toast from 'react-hot-toast';

interface SubmitReportProps {
  onSubmit?: (data: { title: string; description: string; category: string; location: string; priority: string; files: FileList | null }) => void;
}

export default function SubmitReport({ onSubmit }: SubmitReportProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      onSubmit?.({
        title,
        description,
        category,
        location,
        priority,
        files,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setLocation('');
      setPriority('medium');
      setFiles(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <h4 className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
        Submit New Report
      </h4>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title / Subject *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Brief summary of the incident"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category *</Form.Label>
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="fraud">Fraud</option>
            <option value="vandalism">Vandalism</option>
            <option value="cyber">Cyber Crime</option>
            <option value="other">Other</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Describe the incident in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location *</Form.Label>
          <Form.Control
            type="text"
            placeholder="Where did it happen?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Priority</Form.Label>
          <Form.Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Evidence (optional)</Form.Label>
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
            Max 10 MB per file. Accepted: images, PDF, Word docs.
          </Form.Text>
        </Form.Group>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </motion.div>
      </Form>
    </GlassCard>
  );
}
