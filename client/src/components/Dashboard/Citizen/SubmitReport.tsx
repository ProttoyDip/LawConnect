import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import toast from 'react-hot-toast';
import { AlertCircle, FileText, Upload, X } from 'lucide-react';

interface SubmitReportProps {
  onSubmit?: (data: {
    title: string;
    description: string;
    category: string;
    location: string;
    priority: string;
    occurredAt?: string;
    files: File[];
  }) => Promise<void> | void;
  onViewReports?: () => void;
}

const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];

function getFileExtension(name: string) {
  const ext = name.split('.').pop();
  return ext ? ext.toLowerCase() : '';
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmitReport({ onSubmit, onViewReports }: SubmitReportProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [occurredAt, setOccurredAt] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    location?: string;
    files?: string;
  }>({});

  const validateForm = () => {
    const nextErrors: {
      title?: string;
      description?: string;
      category?: string;
      location?: string;
      files?: string;
    } = {};

    if (!title.trim()) {
      nextErrors.title = 'Title is required.';
    } else if (title.trim().length < 5) {
      nextErrors.title = 'Title should be at least 5 characters.';
    }

    if (!description.trim()) {
      nextErrors.description = 'Description is required.';
    } else if (description.trim().length < 20) {
      nextErrors.description = 'Description should be at least 20 characters.';
    }

    if (!category) {
      nextErrors.category = 'Please select a category.';
    }

    if (!location.trim()) {
      nextErrors.location = 'Location is required.';
    }

    if (files.length > MAX_FILES) {
      nextErrors.files = `You can upload up to ${MAX_FILES} files.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) {
      return;
    }

    const merged = [...files, ...selected];
    const filtered = merged.filter((file) => {
      const ext = getFileExtension(file.name);
      return ACCEPTED_EXTENSIONS.includes(ext);
    });

    const invalidTypeCount = merged.length - filtered.length;
    if (invalidTypeCount > 0) {
      toast.error('Some files were skipped due to unsupported format.');
    }

    const oversized = filtered.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (oversized) {
      setErrors((prev) => ({ ...prev, files: `${oversized.name} is larger than 10 MB.` }));
      event.target.value = '';
      return;
    }

    if (filtered.length > MAX_FILES) {
      setErrors((prev) => ({ ...prev, files: `You can upload up to ${MAX_FILES} files.` }));
      toast.error(`Only ${MAX_FILES} files are allowed.`);
      event.target.value = '';
      return;
    }

    setFiles(filtered);
    setErrors((prev) => ({ ...prev, files: undefined }));
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForNewSubmission = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setLocation('');
    setPriority('medium');
    setOccurredAt('');
    setFiles([]);
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await Promise.resolve(onSubmit?.({
        title: title.trim(),
        description: description.trim(),
        category,
        location: location.trim(),
        priority,
        occurredAt: occurredAt || undefined,
        files,
      }));
      setSubmitted(true);
    } catch {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <GlassCard className="max-w-3xl mx-auto">
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20 border border-emerald-300/40">
            <FileText className="h-6 w-6 text-emerald-300" />
          </div>
          <h4 className="text-xl font-semibold text-slate-900 dark:text-white">Report Submitted Successfully</h4>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Your report was received. You can track status changes from your reports list.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onViewReports}
              className="w-full rounded-lg bg-orange-400 text-slate-900 font-semibold py-2.5 px-4 transition hover:bg-orange-300"
            >
              View My Reports
            </button>
            <button
              type="button"
              onClick={resetForNewSubmission}
              className="w-full rounded-lg border border-slate-300 bg-white/80 text-slate-800 dark:border-white/30 dark:bg-white/10 dark:text-white font-semibold py-2.5 px-4 transition hover:bg-white dark:hover:bg-white/20"
            >
              Submit Another
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-4xl mx-auto flex flex-col max-h-[calc(100vh-200px)]">
      <div className="mb-6 border-b border-slate-200 dark:border-white/10 pb-4 flex-shrink-0">
        <h4 className="flex items-center gap-2 text-slate-900 dark:text-white text-xl font-semibold">
          <FileText className="h-5 w-5 text-orange-300" />
          Submit New Report
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Share accurate details so the case can be verified and processed quickly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto flex-1 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Title / Subject *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Brief summary of the incident"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-300 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Category *</label>
            <select
              className="form-select glass-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors((prev) => ({ ...prev, category: undefined }));
              }}
            >
              <option value="">-- Select --</option>
              <option value="theft">Theft</option>
              <option value="assault">Assault</option>
              <option value="fraud">Fraud</option>
              <option value="vandalism">Vandalism</option>
              <option value="cyber">Cyber Crime</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.category}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Description *</label>
          <textarea
            className="form-control"
            rows={5}
            placeholder="Describe the incident in detail (what happened, who was involved, and any notable details)..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.description ? (
              <p className="text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.description}
              </p>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">Minimum 20 characters recommended.</span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400">{description.length} chars</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Location *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Where did it happen?"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setErrors((prev) => ({ ...prev, location: undefined }));
              }}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">Incident Date / Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={occurredAt}
              max={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setOccurredAt(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Priority</label>
            <select
              className="form-select glass-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Evidence (optional)</label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-white/30 bg-white/70 dark:bg-white/5 p-5 text-center transition hover:bg-white dark:hover:bg-white/10">
            <Upload className="h-5 w-5 text-orange-300" />
            <span className="mt-2 text-sm text-slate-800 dark:text-slate-200 font-medium">Click to upload evidence files</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Up to 5 files, max 10 MB each</span>
            <input
              type="file"
              className="hidden"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>

          {errors.files && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-300 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.files}
            </p>
          )}

          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg bg-white/75 dark:bg-white/10 border border-slate-300/80 dark:border-white/15 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-800 dark:text-slate-100">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-3 rounded-md p-1 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-orange-400 text-slate-900 font-semibold py-2.5 px-4 transition hover:bg-orange-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </motion.div>
      </form>
    </GlassCard>
  );
}
