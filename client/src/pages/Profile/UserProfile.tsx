import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Phone, MapPin, Save } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import ApiClient, { User } from '../../api';
import PageTransition from '../../components/PageTransition';

const apiClient = new ApiClient();

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const { loading, execute } = useApi();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      setFormData(userData);
    }
  }, []);

  const handleSave = async () => {
    try {
      await execute(
        apiClient.updateProfile(formData),
        'Profile updated successfully'
      );
      if (user) {
        const updated = { ...user, ...formData };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6"
        >
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-navy-800 to-navy-600 flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 capitalize">
              {user.role}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-slate-100 dark:disabled:bg-slate-700"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-100 dark:bg-slate-700 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-slate-100 dark:disabled:bg-slate-700"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  value={formData.address || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  disabled={!isEditing}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-slate-100 dark:disabled:bg-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white font-semibold rounded-lg transition"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                  className="flex-1 px-4 py-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
