// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'police' | 'citizen';
  national_id?: string;
  badge_number?: string;
  police_station?: string;
  admin_id?: string;
}

// Crime report types
export interface CrimeReport {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
  evidence_files?: EvidenceFile[];
  status_updates?: StatusUpdate[];
}

export interface EvidenceFile {
  id: number;
  filename: string;
  filepath: string;
  mime_type: string;
  report_id: number;
  uploaded_at: string;
}

export interface StatusUpdate {
  id: number;
  report_id: number;
  status: string;
  remarks?: string;
  updated_by: number;
  created_at: string;
}

// Analytics types
export interface AnalyticsData {
  total_reports: number;
  pending_reports: number;
  investigating: number;
  resolved_reports: number;
  total_users: number;
  total_officers: number;
  closed_reports: number;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  recent_reports: CrimeReport[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  user?: User;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  role_type: string;
  national_id?: string;
  badge_number?: string;
  admin_id?: string;
  security_code?: string;
  police_station?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  national_id?: string;
  badge_number?: string;
  police_station?: string;
  role_type?: string;
}

export interface ReportFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  files: FileList | null;
}
