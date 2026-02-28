import { Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { CrimeReport } from '../../../api';

interface AssignedCasesProps {
  cases: CrimeReport[];
  onCaseClick?: (caseItem: CrimeReport) => void;
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  investigating: 'info',
  resolved: 'success',
  closed: 'secondary',
};

const priorityColors: Record<string, string> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
  critical: 'dark',
};

export default function AssignedCases({ cases, onCaseClick }: AssignedCasesProps) {
  return (
    <GlassCard>
      <h4 className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
        </svg>
        Assigned Cases
      </h4>

      <div className="cases-list">
        <AnimatePresence>
          {cases.map((caseItem: CrimeReport, index: number) => (
            <motion.div
              key={caseItem.id}
              className="case-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => onCaseClick?.(caseItem)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 className="mb-0 case-title">{caseItem.title}</h6>
                <Badge bg={priorityColors[caseItem.priority] || 'secondary'} className="text-uppercase">
                  {caseItem.priority}
                </Badge>
              </div>
              <p className="text-muted mb-2 case-description">
                {caseItem.description?.substring(0, 100)}...
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <Badge bg={statusColors[caseItem.status] || 'secondary'}>
                  {caseItem.status?.replace('_', ' ')}
                </Badge>
                <small className="text-muted">
                  {new Date(caseItem.created_at).toLocaleDateString()}
                </small>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {cases.length === 0 && (
          <div className="text-center py-4 text-muted">
            <p>No cases assigned yet</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
