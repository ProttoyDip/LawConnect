import { Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { CrimeReport } from '../../../api';

interface MyReportsProps {
  reports: CrimeReport[];
  onViewDetails?: (report: CrimeReport) => void;
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  investigating: 'info',
  resolved: 'success',
  closed: 'secondary',
};

export default function MyReports({ reports, onViewDetails }: MyReportsProps) {
  return (
    <GlassCard>
      <h4 className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M10.5 8.5a.5.5 0 0 1-1 0V5.707l-4.146 4.147a.5.5 0 0 1-.708-.708L8.793 5H6.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V8.5z"/>
        </svg>
        My Reports
      </h4>

      <div className="reports-list">
        <AnimatePresence>
          {reports.map((report: CrimeReport, index: number) => (
            <motion.div
              key={report.id}
              className="report-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => onViewDetails?.(report)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-0 report-title">{report.title}</h6>
                <Badge bg={statusColors[report.status] || 'secondary'}>
                  {report.status?.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-muted mb-2 report-description">
                {report.description?.substring(0, 80)}...
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                  </svg>
                  {new Date(report.created_at).toLocaleDateString()}
                </small>
                <small className="text-capitalize text-muted">
                  {report.priority} priority
                </small>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {reports.length === 0 && (
          <div className="text-center py-4 text-muted">
            <p>You haven't submitted any reports yet</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
