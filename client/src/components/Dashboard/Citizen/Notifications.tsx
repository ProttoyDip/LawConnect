import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'update' | 'response' | 'status';
  timestamp: string;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  onMarkAsRead?: (id: number) => void;
}

const notificationIcons: Record<string, JSX.Element> = {
  update: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a.654.654 0 0 0-.165-.532A6.98 6.98 0 0 0 8 1c0 1.415-.588 2.723-1.59 3.883l.21.207a.654.654 0 0 1 .524.365l.086.1.093.086a.654.654 0 0 1 .447.347l.11.116a.64.64 0 0 1 .12.133l.107.108.088.087.087.087.05.05.05.05.025.025.025.025a2.837 2.837 0 0 1 .1.1.622.622 0 0 1 .06.06.617.617 0 0 1 .033.033.617.617 0 0 1 .02.02.617.617 0 0 1 .014.014.617.617 0 0 1 .006.006.617.617 0 0 1 .002.002.617.617 0 0 1 .001.001.617.617 0 0 1 .001.001zm.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 0-.5-.5h-11z"/>
    </svg>
  ),
  response: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
      <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
    </svg>
  ),
  status: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
    </svg>
  ),
};

export default function Notifications({ notifications, onMarkAsRead }: NotificationsProps) {
  return (
    <GlassCard>
      <h4 className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917z"/>
        </svg>
        Notifications
      </h4>

      <div className="notifications-list">
        <AnimatePresence>
          {notifications.map((notification: Notification, index: number) => (
            <motion.div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => !notification.read && onMarkAsRead?.(notification.id)}
              style={{ cursor: notification.read ? 'default' : 'pointer' }}
            >
              <div className="notification-icon">
                {notificationIcons[notification.type] || notificationIcons.update}
              </div>
              <div className="notification-content">
                <h6 className="mb-1">{notification.title}</h6>
                <p className="mb-1 text-muted">{notification.message}</p>
                <small className="text-muted">
                  {new Date(notification.timestamp).toLocaleString()}
                </small>
              </div>
              {!notification.read && <div className="unread-dot"></div>}
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="text-center py-4 text-muted">
            <p>No notifications</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
