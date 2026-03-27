import { useState } from 'react';
import React, { ChangeEvent } from 'react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../ui/Table';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import { User } from '../../../api';
import toast from 'react-hot-toast';

interface UserManagementProps {
  users: User[];
  onUserUpdate?: (user: User) => void;
  onUserDelete?: (userId: number) => void;
  onUserAdd?: (user: { name: string; email: string; role: string }) => void;
}

export default function UserManagement({ 
  users, 
  onUserUpdate, 
  onUserDelete,
  onUserAdd 
}: UserManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'citizen' });

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onUserDelete?.(userId);
      toast.success('User deleted successfully');
    }
  };

  const handleAdd = () => {
    setNewUser({ name: '', email: '', role: 'citizen' });
    setEditingUser(null);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingUser) {
      onUserUpdate?.(editingUser);
      toast.success('User updated successfully');
    } else {
      onUserAdd?.(newUser);
      toast.success('User added successfully');
    }
    setShowModal(false);
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      admin: 'danger',
      police: 'info',
      citizen: 'success',
    };
    return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>;
  };

  return (
    <GlassCard>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="me-2">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
            <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
          </svg>
          User Management
        </h4>
        <Button variant="primary" size="sm" onClick={handleAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          Add User
        </Button>
      </div>

      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((user: User, index: number) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="text-muted">#{user.id}</td>
                  <td className="fw-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={editingUser?.role || newUser.role}
                onChange={(e) => {
                  if (editingUser) {
                    setEditingUser({ ...editingUser, role: e.target.value as 'citizen' | 'police' | 'admin' });
                  } else {
                    setNewUser({ ...newUser, role: e.target.value });
                  }
                }}
              >
                <option value="citizen">Citizen</option>
                <option value="police">Investigator</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editingUser ? 'Update' : 'Add User'}
          </Button>
        </Modal.Footer>
      </Modal>
    </GlassCard>
  );
}
