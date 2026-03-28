import { Button } from '../../ui/Button';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import toast from 'react-hot-toast';

interface ReportsSectionProps {
  analytics: {
    total_reports: number;
    resolved_reports: number;
    closed_reports: number;
  };
}

export default function ReportsSection({ analytics }: ReportsSectionProps) {
  const handleDownload = (type: string) => {
    toast.success(`${type} report download started!`);
  };

  return (
    <GlassCard>
      <h4 className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
          <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z"/>
        </svg>
        Reports & Analytics
      </h4>

      <div className="row g-3">
        <div className="col-md-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-summary-card"
          >
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="mb-1">Total Reports</h6>
                <span className="h3 mb-0">{analytics.total_reports}</span>
              </div>
              <Button variant="outline-primary" size="sm" onClick={() => handleDownload('Total')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Download
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="col-md-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-summary-card"
          >
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="mb-1">Resolved Cases</h6>
                <span className="h3 mb-0 text-success">{analytics.resolved_reports}</span>
              </div>
              <Button variant="outline-primary" size="sm" onClick={() => handleDownload('Resolved')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Download
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="col-md-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-summary-card"
          >
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="mb-1">Closed Cases</h6>
                <span className="h3 mb-0 text-secondary">{analytics.closed_reports}</span>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => handleDownload('Closed')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>
                Download
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="col-md-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="analytics-summary-card"
          >
            <div className="d-flex justify-content-between align-items-center p-3">
              <div>
                <h6 className="mb-1">Analytics Summary</h6>
                <span className="h3 mb-0 text-info">View</span>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={() => handleDownload('Analytics')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                  <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                </svg>
                View Analytics
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
