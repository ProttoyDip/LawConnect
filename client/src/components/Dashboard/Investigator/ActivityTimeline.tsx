import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';

interface ActivityItem {
  id: number;
  action: string;
  caseTitle?: string;
  timestamp: string;
  type: 'status' | 'note' | 'evidence' | 'assignment';
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const activityIcons: Record<string, JSX.Element> = {
  status: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
    </svg>
  ),
  note: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
      <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
    </svg>
  ),
  evidence: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z"/>
    </svg>
  ),
  assignment: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
    </svg>
  ),
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <GlassCard>
      <h4 className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a.654.654 0 0 0-.165-.532A6.98 6.98 0 0 0 8 1c0 1.415-.588 2.723-1.59 3.883l.21.207a.654.654 0 0 1 .524.365l.086.1.093.086a.654.654 0 0 1 .447.347l.11.116a.64.64 0 0 1 .12.133l.107.108.088.087.087.087.05.05.05.05.025.025.025.025a2.837 2.837 0 0 1 .1.1.622.622 0 0 1 .06.06.617.617 0 0 1 .033.033.617.617 0 0 1 .02.02.617.617 0 0 1 .014.014.617.617 0 0 1 .006.006.617.617 0 0 1 .002.002.617.617 0 0 1 .001.001.617.617 0 0 1 .001.001.617.617 0 0 1 .001.001.617.617 0 0 1 .001.001zm.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 0-.5-.5h-11z"/>
          <path d="M1.5 1H14V15H1.5V1zm1 0v14h12V1H2.5z"/>
        </svg>
        Activity Timeline
      </h4>

      <div className="timeline">
        {activities.map((activity: ActivityItem, index: number) => (
          <motion.div
            key={activity.id}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="timeline-icon">
              {activityIcons[activity.type] || activityIcons.note}
            </div>
            <div className="timeline-content">
              <p className="mb-1">{activity.action}</p>
              {activity.caseTitle && (
                <small className="text-muted">{activity.caseTitle}</small>
              )}
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          </motion.div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-4 text-muted">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
