import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FormLabel, FormInput, FormSelect, FormTextarea, FormGroup } from '../components/ui/Form';
import { Skeleton } from '../components/ui/Skeleton';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 p-8 space-y-8">
            <div>
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                  Submit Crime Report
                </h1>
                <p className="text-xl text-muted-foreground">
                  Help us protect our community
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <FormGroup>
                  <FormLabel className="text-lg font-semibold">
                    Incident Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    placeholder="e.g., Car stolen from driveway at 123 Main St"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </FormGroup>

                {/* Category & Priority */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormGroup>
                    <FormLabel>
                      Category <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormSelect 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="theft">🛡️ Theft / Robbery</option>
                      <option value="assault">👊 Assault / Violence</option>
                      <option value="fraud">💳 Fraud / Scams</option>
                      <option value="vandalism">🔨 Vandalism / Damage</option>
                      <option value="cyber">💻 Cyber Crime</option>
                      <option value="drug">💊 Drug Related</option>
                      <option value="other">📋 Other</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Priority Level</FormLabel>
                    <FormSelect value={priority} onChange={(e) => setPriority(e.target.value)}>
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🟠 High Priority</option>
                      <option value="critical">🔴 Critical / Emergency</option>
                    </FormSelect>
                  </FormGroup>
                </div>

                {/* Description */}
                <FormGroup>
                  <FormLabel className="text-lg font-semibold">
                    Detailed Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormTextarea
                    placeholder="Please provide as much detail as possible:&#10;&#10;• What exactly happened?&#10;• When did it occur?&#10;• Where exactly?&#10;• Who was involved (description)?&#10;• Any witnesses or suspects?&#10;• Vehicle descriptions?&#10;• Any other relevant information?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    required
                    className="text-lg min-h-[200px]"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    The more details you provide, the faster we can help
                  </p>
                </FormGroup>

                {/* Location & Date */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormGroup>
                    <FormLabel>
                      Location <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormInput
                      type="text"
                      placeholder="Full address, intersection, landmark, GPS coordinates"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Date & Time</FormLabel>
                    <FormInput
                      type="datetime-local"
                      value={occurredAt}
                      onChange={(e) => setOccurredAt(e.target.value)}
                    />
                  </FormGroup>
                </div>

                {/* Evidence Upload */}
                <FormGroup>
                  <FormLabel className="font-semibold">Evidence / Photos (Optional)</FormLabel>
                  <FormInput
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files) setFiles(target.files);
                    }}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    📸 Photos, screenshots, documents (max 10MB per file, up to 5 files)
                  </p>
                </FormGroup>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-destructive to-red-700 hover:from-destructive/90 hover:to-red-700/90 shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Skeleton className="h-5 w-5 mr-3 rounded-full" />
                        Processing Report...
                      </>
                    ) : (
                      '🚨 Submit Report'
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                    className="flex-1 h-14 text-lg border-2"
                  >
                    ← Back to Dashboard
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}

