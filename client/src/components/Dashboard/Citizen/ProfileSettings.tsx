import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { User } from '../../../api';
import toast from 'react-hot-toast';

interface ProfileSettingsProps {
  user: User;
  onUpdate?: (data: { name: string; email: string; phone?: string; address?: string }) => void;
  onPasswordChange?: (currentPassword: string, newPassword: string) => void;
}

export default function ProfileSettings({ user, onUpdate, onPasswordChange }: ProfileSettingsProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const handleProfileUpdate = () => {
    onUpdate?.({ name, email, phone, address });
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    onPasswordChange?.(currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password changed successfully');
  };

  return (
    <GlassCard>
      <h4 className="mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
        </svg>
        Profile Settings
      </h4>

      <div className="settings-tabs mb-4">
        <button
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile Info
        </button>
        <button
          className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
      </div>

      {activeTab === 'profile' && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone (optional)</Form.Label>
            <Form.Control
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Address (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </Form.Group>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="primary" onClick={handleProfileUpdate}>
              Save Changes
            </Button>
          </motion.div>
        </Form>
      )}

      {activeTab === 'password' && (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="primary" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </motion.div>
        </Form>
      )}
    </GlassCard>
  );
}
