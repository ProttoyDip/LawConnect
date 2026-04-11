import { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Table } from '../../ui/Table';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { User } from '../../../api';
import toast from 'react-hot-toast';
import { Search, Filter, Users, UserPlus, UserCircle } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  activeUsers?: Set<number>;
  onUserUpdate?: (user: User) => void | Promise<void>;
  onUserDelete?: (userId: number) => void | Promise<void>;
  onUserAdd?: (user: { name: string; email: string; role: string }) => void | Promise<void>;
}

export default function UserManagement({ 
  users, 
  activeUsers = new Set(),
  onUserUpdate, 
  onUserDelete,
  onUserAdd 
}: UserManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'investigator' });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await onUserDelete?.(userId);
        toast.success('User deleted successfully');
      } catch {
        // error handled upstream
      }
    }
  };

  const handleAdd = () => {
    setNewUser({ name: '', email: '', role: 'investigator' });
    setEditingUser(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await onUserUpdate?.(editingUser);
      } else {
        await onUserAdd?.(newUser);
      }
      setShowModal(false);
    } catch {
      // error handled upstream
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'danger' | 'info' | 'success' | 'secondary'> = {
      admin: 'danger',
      police: 'info',
      citizen: 'success',
    };
    return <Badge variant={variants[role] || 'secondary'}>{role}</Badge>;
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="mb-0 font-semibold text-lg">User Management</h4>
            <p className="text-sm text-slate-500 mb-0">{filteredUsers.length} of {users.length} users</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          <UserPlus className="w-4 h-4 mr-1" />
          Add User
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all"
          />
        </div>
        
        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="police">Investigator</option>
            <option value="citizen">Citizen</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || roleFilter !== 'all') && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Active Users Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-xl border border-emerald-200 dark:border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Currently Active</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeUsers.size} users online</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <Table className="mb-0">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
                  <tbody>
            <AnimatePresence>
              {filteredUsers.map((user: User, index: number) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-slate-500">#{user.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`relative flex h-2.5 w-2.5`}>
                        {activeUsers.has(user.id) ? (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        ) : null}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeUsers.has(user.id) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                      </span>
                      <span className={`text-xs font-medium ${activeUsers.has(user.id) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                        {activeUsers.has(user.id) ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
        footer={(
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editingUser ? 'Update' : 'Add User'}
            </Button>
          </div>
        )}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={editingUser?.name || newUser.name}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, name: e.target.value });
                } else {
                  setNewUser({ ...newUser, name: e.target.value });
                }
              }}
              placeholder="Enter name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={editingUser?.email || newUser.email}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, email: e.target.value });
                } else {
                  setNewUser({ ...newUser, email: e.target.value });
                }
              }}
              placeholder="Enter email"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select
              value={editingUser?.role || newUser.role}
              onChange={(e) => {
                if (editingUser) {
                  setEditingUser({ ...editingUser, role: e.target.value as User['role'] });
                } else {
                  setNewUser({ ...newUser, role: e.target.value });
                }
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="investigator">Investigator</option>
              <option value="officer">Officer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>
    </GlassCard>
  );
}
