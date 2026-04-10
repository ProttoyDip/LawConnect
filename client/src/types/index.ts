import type { UserRole } from '../utils/roles';

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  national_id?: string;
  role: UserRole;
  phone?: string;
  address?: string;
  created_at?: string;
}

// Crime Report Types
export interface CrimeReport {
  id: number;
  case_id: string;
  user_id: number;
  title: string;
  description: string;
  category: 'theft' | 'assault' | 'fraud' | 'vandalism' | 'cyber' | 'other';
  location: string;
  occurred_at: string;
  status: 'pending' | 'under_review' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  user?: User;
  evidence?: EvidenceFile[];
  status_updates?: CaseStatusUpdate[];
  created_at: string;
  updated_at: string;
}

// Evidence File Types
export interface EvidenceFile {
  id: number;
  crime_report_id: number;
  uploaded_by: number;
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  description?: string;
  created_at: string;
}

// Status Update Types
export interface CaseStatusUpdate {
  id: number;
  crime_report_id: number;
  created_by: number;
  status: string;
  notes?: string;
  created_at: string;
}

// Investigation Note Types
export interface InvestigationNote {
  id: number;
  crime_report_id: number;
  user_id: number;
  note: string;
  user?: User;
  created_at: string;
  is_owner: boolean;
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  related_id?: number;
  read: boolean;
  created_at: string;
}

// Police Assignment Types
export interface PoliceAssignment {
  id: number;
  crime_report_id: number;
  officer_id: number;
  assigned_at: string;
  completed_at?: string;
  remarks?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  role_type: UserRole;
  admin_id?: string;
  security_code?: string;
  badge_number?: string;
  police_station?: string;
  national_id?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  national_id?: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone?: string;
  address?: string;
}

export interface CreateReportFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  occurred_at?: string;
  priority: string;
  evidence?: FileList;
}

export interface StatusUpdateFormData {
  status: string;
  remarks?: string;
}

