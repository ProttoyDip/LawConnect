import { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Table, TableHeader, TableHead, TableBody, TableCell, TableRow } from '../../ui/Table';
import { FormGroup, FormLabel, FormSelect } from '../../ui/Form';
import { AnimatePresence } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import type { CrimeReport, User } from '../../../api';
import toast from 'react-hot-toast';
import { Search, Filter, ClipboardList } from 'lucide-react';

interface CaseManagementProps {
  cases: CrimeReport[];
  investigators: User[];
  onAssignInvestigator?: (caseId: number, investigatorId: number) => Promise<void> | void;
  onUpdateStatus?: (caseId: number, status: string) => Promise<void> | void;
}

const statusColors: Record<string, string> = {
  pending: 'warning',
  under_review: 'info',
  investigating: 'info',
  resolved: 'success',
  closed: 'secondary',
};

export default function CaseManagement({ 
  cases, 
  investigators,
  onAssignInvestigator,
  onUpdateStatus 
}: CaseManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CrimeReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch = 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(c.id).includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [cases, searchTerm, statusFilter, priorityFilter]);

  const handleAssign = (caseItem: CrimeReport) => {
    setSelectedCase(caseItem);
    setShowModal(true);
  };

  const handleStatusChange = async (caseId: number, status: string) => {
    if (!onUpdateStatus) {
      return;
    }

    try {
      await onUpdateStatus(caseId, status);
      toast.success('Case status updated');
    } catch {
      toast.error('Failed to update case status');
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'dark',
    };
    return <Badge variant={colors[priority] || 'secondary'} className="uppercase">{priority}</Badge>;
  };

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="mb-0 font-semibold text-lg">Case Management</h4>
            <p className="text-sm text-slate-500 mb-0">{filteredCases.length} of {cases.length} cases</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {/* Clear Filters */}
        {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setPriorityFilter('all');
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <Table className="mb-0"> 
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead>Case ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No cases match your filters
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {filteredCases.map((caseItem: CrimeReport, index: number) => (
                  <TableRow
                    key={caseItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="text-slate-500 font-mono text-sm">#{String(caseItem.id).padStart(8, '0')}</TableCell>
                    <TableCell className="font-medium">{caseItem.title}</TableCell>
                    <TableCell>{getPriorityBadge(caseItem.priority)}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[caseItem.status] || 'secondary'}>
                        {caseItem.status?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {(caseItem as any).assignedTo?.name ||
                        (caseItem as any).assigned_to?.name ||
                        (caseItem as any).police_assignment?.officer?.name || (
                        <span className="text-slate-400">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAssign(caseItem)}
                        >
                          Assign
                        </Button>
                        <FormSelect
                          value={caseItem.status || ''}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            void handleStatusChange(caseItem.id!, e.target.value);
                          }}
                          className="py-1 px-2 text-sm bg-white dark:bg-slate-700"
                          style={{ minWidth: '120px' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="under_review">Under Review</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </FormSelect>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} title="Assign Investigator">
        <p>Select an investigator for case: <strong>{selectedCase?.title}</strong></p>
        <FormGroup>
          <FormLabel>Investigator</FormLabel>
          <FormSelect
            onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
              if (selectedCase && e.target.value) {
                try {
                  await onAssignInvestigator?.(selectedCase.id!, parseInt(e.target.value, 10));
                  toast.success('Investigator assigned');
                  setShowModal(false);
                } catch {
                  toast.error('Failed to assign investigator');
                }
              }
            }}
          >
            <option value="">Select Investigator...</option>
            {investigators.map((inv) => (
              <option key={inv.id} value={inv.id}>{inv.name} ({inv.email})</option>
            ))}
          </FormSelect>
        </FormGroup>
      </Modal>
    </GlassCard>
  );
}
