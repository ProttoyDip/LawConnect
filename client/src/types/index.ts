// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'citizen' | 'police' | 'admin';
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
  role_type: 'citizen' | 'police' | 'admin';
  admin_id?: string;
  security_code?: string;
  badge_number?: string;
  police_station?: string;
  national_id?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'citizen' | 'police' | 'admin';
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

