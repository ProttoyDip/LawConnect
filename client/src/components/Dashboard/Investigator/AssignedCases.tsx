import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';

import ApiClient from '../../../api';
import type { CrimeReport } from '../../../types';

import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/Table';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/FormInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/FormSelect';
import Pagination from '../../ui/Pagination';
import { Skeleton } from '../../ui/Skeleton';

const apiClient = new ApiClient();

const statusOptions = ['pending', 'under_review', 'investigating', 'resolved', 'closed'] as const;
const priorityOptions = ['low', 'medium', 'high', 'critical'] as const;

export default function AssignedCases() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState<CrimeReport[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');

  const fetchCases = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const filters = {
        page,
        status: statusFilter,
        priority: priorityFilter,
        search,
      };
      const response = await apiClient.getInvestigatorCases(filters);
      setCases(response.data);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch assigned cases:', error);
    } finally {
      setIsLoading(false);
    }
  }, [priorityFilter, search, statusFilter]);

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const nextSearch = searchParams.get('search') || '';
    const nextStatus = searchParams.get('status') || '';
    const nextPriority = searchParams.get('priority') || '';

    setCurrentPage(page);
    setSearch(nextSearch);
    setStatusFilter(nextStatus);
    setPriorityFilter(nextPriority);
  }, [searchParams]);

  useEffect(() => {
    fetchCases(currentPage);
  }, [currentPage, fetchCases]);

  const updateParams = (updates: Record<string, string>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }
    });

    setSearchParams(nextParams);
  };

  const handleFilterChange = (key: 'status' | 'priority', value: string) => {
    if (key === 'status') {
      setStatusFilter(value);
    }

    if (key === 'priority') {
      setPriorityFilter(value);
    }

    updateParams({ page: '1', [key]: value });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateParams({
      page: String(page),
      search,
      status: statusFilter,
      priority: priorityFilter,
    });
  };

  const statusBadge = (status: string) => {
    const variants = {
      pending: 'warning' as const,
      under_review: 'secondary' as const,
      investigating: 'default' as const,
      resolved: 'success' as const,
      closed: 'secondary' as const,
    };

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <Card.Header>
          <Skeleton className="h-8 w-48" />
        </Card.Header>
        <Card.Content>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assigned Cases ({total})
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
                leftIcon={<Search className="h-4 w-4" />}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(1);
                  updateParams({
                    page: '1',
                    search,
                    status: statusFilter,
                    priority: priorityFilter,
                  });
                }}
              >
                Search
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(value) => handleFilterChange('priority', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priority</SelectItem>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setPriorityFilter('');
                  setCurrentPage(1);
                  setSearchParams({});
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No assigned cases match your filters.</p>
                </TableCell>
              </TableRow>
            ) : (
              cases.map((report) => (
                <TableRow
                  key={report.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  onClick={() => {
                    window.location.href = `/investigator/cases/${report.id}`;
                  }}
                >
                  <TableCell className="font-mono font-medium">#{report.id}</TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{statusBadge(report.status)}</TableCell>
                  <TableCell>
                    <Badge variant={report.priority === 'high' || report.priority === 'critical' ? 'destructive' : 'outline'}>
                      {report.priority?.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <a
                      href={`https://maps.google.com?q=${encodeURIComponent(report.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {report.location}
                    </a>
                  </TableCell>
                  <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" onClick={(e) => e.stopPropagation()}>
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {total > 15 && (
          <div className="p-4 border-t">
            <Pagination totalPages={Math.ceil(total / 15)} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        )}
      </Card>
    </div>
  );
}