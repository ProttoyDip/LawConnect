import { useState } from 'react';
import { Button, Card, Form, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

const apiClient = new ApiClient();

export default function ReportCrime() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [occurredAt, setOccurredAt] = useState('');
  const [priority, setPriority] = useState('medium');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('priority', priority);
    if (occurredAt) {
      formData.append('occurred_at', occurredAt);
    }
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('evidence[]', files[i]);
      }
    }

    setLoading(true);
    try {
      await apiClient.createCrimeReport(formData);
      toast.success('Crime report submitted successfully');
      navigate('/my-reports');
    } catch {
      // error already handled by ApiClient
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="d-flex justify-content-center py-4">
      <Card style={{ width: '100%', maxWidth: 700 }} className="shadow">
        <Card.Body className="p-4">
          <h3 className="mb-4">Submit a Crime Report</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="crimeTitle">
              <Form.Label>Title / Subject *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brief summary of the incident"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="crimeCategory">
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

            <Form.Group className="mb-3" controlId="crimeDescription">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Describe the incident in detail…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="crimeLocation">
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Where did it happen?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="crimeOccurredAt">
                  <Form.Label>Date / Time of Incident</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={occurredAt}
                    onChange={(e) => setOccurredAt(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="crimePriority">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="crimeEvidence">
              <Form.Label>Evidence (images / documents, max 5 files)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.mp4,.avi"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setFiles(target.files);
                }}
              />
              <Form.Text className="text-muted">
                Max 10 MB per file. Accepted: images, PDF, Word docs, videos.
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2 mt-4">
              <Button variant="danger" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Submit Report'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
    </PageTransition>
  );
}
