import { useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ApiClient from '../api';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

const apiClient = new ApiClient();

export default function ReportCrime() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('priority', priority);
    if (image) {
      formData.append('image', image);
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
      <Card style={{ width: '100%', maxWidth: 600 }} className="shadow">
        <Card.Body className="p-4">
          <h3 className="mb-4">Report a Crime</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="crimeTitle">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Brief title of the incident"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="crimeDescription">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Detailed description of the incident"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="crimeLocation">
              <Form.Label>Location *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Where did it happen?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="crimePriority">
              <Form.Label>Priority</Form.Label>
              <Form.Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="crimeImage">
              <Form.Label>Evidence Image (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setImage(target.files?.[0] ?? null);
                }}
              />
            </Form.Group>

            <div className="d-flex gap-2">
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
