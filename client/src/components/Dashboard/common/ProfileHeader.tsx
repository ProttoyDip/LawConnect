import { motion } from 'framer-motion';
import { Button } from '../../ui/Button';
import { User } from '../../../api';
import toast from 'react-hot-toast';

interface ProfileHeaderProps {
  user: User;
  onLogout: () => void;
}

const roleColors: Record<string, string> = {
  admin: 'bg-gradient-purple',
  police: 'bg-gradient-teal',
  citizen: 'bg-gradient-orange',
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  police: 'Investigator',
  citizen: 'Citizen',
};

export default function ProfileHeader({ user, onLogout }: ProfileHeaderProps) {
  const handleEditProfile = () => {
    toast.success('Edit profile feature coming soon!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="profile-header-wrapper"
    >
      <div className="profile-header-glass">
        <div className="profile-header-content">
          {/* Avatar */}
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User Info */}
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <span className={`role-badge ${roleColors[user.role] || 'bg-gradient-orange'}`}>
              {roleLabels[user.role] || user.role}
            </span>
          </div>

          {/* Actions */}
          <div className="profile-actions">
            <Button
              variant="outline-secondary"
              className="profile-btn"
              onClick={handleEditProfile}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
              Edit Profile
            </Button>
            <Button
              variant="outline-secondary"
              className="profile-btn profile-btn-logout"
              onClick={onLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
