import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Plus, Clock } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import ApiClient, { CrimeReport } from '../../api';
import PageTransition from '../../components/PageTransition';
import { formatDate, formatCaseId, getStatusColor } from '../../utils/formatting';
import toast from 'react-hot-toast';

const apiClient = new ApiClient();

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { loading, error, data: report, execute } = useApi<CrimeReport>();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    if (caseId) {
      execute(apiClient.getReport(parseInt(caseId)));
    }
  }, [caseId]);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
        </div>
      </PageTransition>
    );
  }

  if (error || !report) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load case details</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-navy-800 text-white rounded hover:bg-navy-900"
            >
              Go Back
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">{report.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Report Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6"
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Case ID
                  </p>
                  <p className="font-mono font-semibold">
                    {formatCaseId(report.id.toString())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Category
                  </p>
                  <p className="font-semibold capitalize">{report.category}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Priority
                  </p>
                  <p className="font-semibold capitalize">{report.priority}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Description
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  {report.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Location
                  </p>
                  <p>{report.location || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    Occurred
                  </p>
                  <p>{formatDate(report.occurred_at)}</p>
                </div>
              </div>
            </motion.div>

            {/* Evidence Section */}
            {report.evidence && report.evidence.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-bold mb-4">Evidence Files</h2>
                <div className="space-y-3">
                  {report.evidence.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{file.file_name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {(file.file_size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </h3>
              <div className="space-y-4">
                {report.status_updates && report.status_updates.length > 0 ? (
                  report.status_updates.map((update) => (
                    <div key={update.id} className="pb-4 border-b dark:border-slate-700 last:border-b-0">
                      <p className="text-sm font-semibold text-navy-800 dark:text-navy-400 capitalize">
                        {update.status.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {formatDate(update.created_at)}
                      </p>
                      {update.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                          {update.notes}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No updates yet
                  </p>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-3"
            >
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-lg transition">
                <Plus className="w-5 h-5" />
                Add Evidence
              </button>
              {(report.status === 'pending' || report.status === 'under_review') && (
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Update Status
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
