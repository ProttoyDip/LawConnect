import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Download, Clock, FileText, MessageCircle, Image, Edit3, Trash2, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';

import ApiClient from '../../api';
import type { CrimeReport, InvestigationNote, EvidenceFile } from '../../types/index';
import { secrets } from '../../secrets';

import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import CaseUpdateModal from '../../components/Dashboard/Investigator/CaseUpdateModal';

const apiClient = new ApiClient();

interface ActivityItem {
  type: 'status' | 'note' | 'evidence';
  title: string;
  description: string;
  timestamp: string;
  icon: ReactNode;
}

export default function CaseDetailsInvestigator() {
  const { caseId } = useParams<{ caseId: string }>();
  const [caseData, setCaseData] = useState<CrimeReport | null>(null);
  const [notes, setNotes] = useState<InvestigationNote[]>([]);
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [editingNote, setEditingNote] = useState<InvestigationNote | null>(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchCaseDetails = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try {
      const data = await apiClient.getCaseDetails(Number(caseId));
      setCaseData(data.case);
      setNotes(data.notes || []);
      setEvidence(data.case.evidenceFiles || []);
      
      // Build activity timeline
      const timeline: ActivityItem[] = [];
      
      // Status updates
      (data.case.status_updates || []).forEach((update: any) => {
        timeline.push({
          type: 'status',
          title: `Status updated to ${update.status}`,
          description: update.notes || '',
          timestamp: update.created_at,
          icon: <Clock className="h-4 w-4 text-blue-500" />,
        });
      });

      // Notes
      notes.forEach((note) => {
        timeline.push({
          type: 'note',
          title: 'Investigation note added',
          description: note.note.slice(0, 100) + '...',
          timestamp: note.created_at,
          icon: <MessageCircle className="h-4 w-4 text-green-500" />,
        });
      });

      setActivity(timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (error) {
      console.error('Failed to fetch case details:', error);
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCaseDetails();
  }, [fetchCaseDetails]);

  const handleAddNote = async () => {
    if (!caseId || !newNote.trim()) return;
    try {
      const note = await apiClient.createNote(Number(caseId), newNote);
      setNotes([note, ...notes]);
      setNewNote('');
      setShowNotesModal(false);
      toast.success('Note added');
      fetchCaseDetails(); // Refresh timeline
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const handleEditNote = async () => {
    if (!editingNote || !newNote.trim()) return;
    try {
      const updated = await apiClient.updateNote(editingNote.id, newNote);
      setNotes(notes.map(n => n.id === updated.id ? updated : n));
      setEditingNote(null);
      setNewNote('');
      toast.success('Note updated');
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Delete this note?')) return;
    try {
      await apiClient.deleteNote(noteId);
      setNotes(notes.filter(n => n.id !== noteId));
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const downloadEvidence = (file: EvidenceFile) => {
    window.open(`${secrets.backendEndpoint || ''}/storage/${file.file_path}`, '_blank');
  };

  if (loading) {
    return <div className="space-y-6"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>;
  }

  if (!caseData) {
    return <div className="text-center py-12 text-slate-500">Case not found</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Case Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                Case #{caseData.id} - {caseData.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">{caseData.status.replace('_', ' ')}</Badge>
                <Badge variant={caseData.priority === 'high' || caseData.priority === 'critical' ? 'destructive' : 'outline'}>
                  {caseData.priority?.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button onClick={() => setShowUpdateModal(true)} className="gap-2">
              <Edit3 className="h-4 w-4" />
              Update Status
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h6 className="text-sm font-medium text-slate-500 mb-2">Location</h6>
              <p className="flex items-center gap-2 text-lg font-medium">
                <MapPin className="h-5 w-5 text-blue-500" />
                <a href={`https://maps.google.com?q=${encodeURIComponent(caseData.location)}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {caseData.location}
                </a>
              </p>
            </div>
            <div>
              <h6 className="text-sm font-medium text-slate-500 mb-2">Reported</h6>
              <p>{new Date(caseData.created_at).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Details */}
        <Card>
          <CardHeader>
            <CardTitle>Case Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h6 className="text-sm font-medium text-slate-500">Description</h6>
              <p className="mt-2 whitespace-pre-wrap">{caseData.description}</p>
            </div>
            <div>
              <h6 className="text-sm font-medium text-slate-500">Category</h6>
              <p className="capitalize">{caseData.category}</p>
            </div>
            <div>
              <h6 className="text-sm font-medium text-slate-500">Occurred</h6>
              <p>{new Date(caseData.occurred_at).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Evidence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Evidence ({evidence.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evidence.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No evidence uploaded</p>
              ) : (
                evidence.map((file) => {
                  const isImage = file.mime_type?.startsWith('image/');
                  const isPdf = file.mime_type === 'application/pdf';
                  const fileUrl = `${secrets.backendEndpoint || ''}/storage/${file.file_path}`;
                  
                  return (
                    <div key={file.id} className="border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                      {/* Preview Section */}
                      {isImage && (
                        <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
                          <img 
                            src={fileUrl} 
                            alt={file.file_name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {isPdf && (
                        <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-16 w-16 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-slate-600 dark:text-slate-400">PDF Document</p>
                          </div>
                        </div>
                      )}
                      
                      {/* File Info Section */}
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isImage ? (
                              <Image className="h-6 w-6 text-blue-500" />
                            ) : isPdf ? (
                              <FileText className="h-6 w-6 text-red-500" />
                            ) : (
                              <FileText className="h-6 w-6 text-slate-400" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{file.file_name}</p>
                              <p className="text-xs text-slate-500">{(file.file_size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => downloadEvidence(file)}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Upload Evidence
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={() => setShowNotesModal(true)} variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Add Note
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Upload Evidence
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BadgeCheck className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Investigation Notes ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{note.note}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {note.user?.name || 'Investigator'} • {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                  {note.is_owner && (
                    <div className="flex gap-1 ml-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingNote(note);
                        setNewNote(note.note);
                      }}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => setShowNotesModal(true)} className="w-full">
            + Add Note
          </Button>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activity.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center w-8 flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="w-px h-full bg-slate-200 dark:bg-slate-700 mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{item.description}</p>
                  <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <Modal show={showNotesModal || !!editingNote} onHide={() => {
        setShowNotesModal(false);
        setEditingNote(null);
        setNewNote('');
      }} title={editingNote ? 'Edit Note' : 'Add Investigation Note'}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter investigation note..."
          rows={6}
          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-600"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => {
            setShowNotesModal(false);
            setEditingNote(null);
            setNewNote('');
          }}>
            Cancel
          </Button>
          <Button onClick={editingNote ? handleEditNote : handleAddNote}>
            {editingNote ? 'Update' : 'Add Note'}
          </Button>
        </div>
      </Modal>

      {caseData && (
        <CaseUpdateModal
          caseItem={caseData}
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          onUpdateStatus={async (id, status, remarks) => {
            await apiClient.updateReportStatus(id, status, remarks);
            toast.success('Status updated');
            fetchCaseDetails();
          }}
        />
      )}
    </div>
  );
}

