import axios, { AxiosInstance } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';

/* ──────────────────────────── Types ──────────────────────────── */

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  national_id?: string;
  badge_number?: string;
  police_station?: string;
  role: 'citizen' | 'police' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface EvidenceFile {
  id: number;
  file_name: string;
  file_size: number;
  file_path?: string;
  mime_type?: string;
}

export interface StatusUpdate {
  id: number;
  status: string;
  notes?: string;
  remarks?: string;
  created_at: string;
  createdAt?: string;
  created_by?: number;
  createdBy?: number;
  crime_report_id?: number;
  crimeReportId?: number;
}

export interface CrimeReport {
  id: number;
  title: string;
  description: string;
  category?: string;
  location: string;
  priority: string;
  status: string;
  occurred_at?: string;
  occurredAt?: string;
  user_id: number;
  userId?: number;
  created_at: string;
  createdAt?: string;
  updated_at: string;
  updatedAt?: string;
  user?: User;
  evidence?: EvidenceFile[];
  status_updates?: StatusUpdate[];
  statusUpdates?: StatusUpdate[];
}

/* ──────────────────────────── Client ─────────────────────────── */

class ApiClient {
  private client: AxiosInstance;
  private csrfToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: secrets.backendEndpoint,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    // Fetch CSRF token on initialization
    this.fetchCsrfToken();

    // Attach token and CSRF token on every request
    this.client.interceptors.request.use(async (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Ensure CSRF token is present for mutating requests.
      if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
        if (!this.csrfToken) {
          await this.fetchCsrfToken();
        }
        if (this.csrfToken) {
          config.headers['X-CSRF-TOKEN'] = this.csrfToken;
        }
      }

      return config;
    });
  }

  private async fetchCsrfToken() {
    try {
      const response = await axios.get(`${secrets.backendEndpoint || ''}/api/csrf-token`, {
        withCredentials: true,
      });
      this.csrfToken = response.data.csrf_token;
    } catch (error) {
      console.warn('Failed to fetch CSRF token:', error);
      // Fallback: try to get from meta tag
      const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (metaToken) {
        this.csrfToken = metaToken;
      }
    }
  }

  /* ── Auth ───────────────────────────────────────────────── */

  async register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    nationalId?: string,
    role: string = 'citizen',
    phone?: string,
    address?: string,
    badgeNumber?: string,
    policeStation?: string
  ) {
    try {
      const response = await this.client.post('/api/auth/register', {
        name,
        email,
        ...(nationalId && { national_id: nationalId }),
        ...(badgeNumber && { badge_number: badgeNumber }),
        ...(policeStation && { police_station: policeStation }),
        password,
        password_confirmation,
        role,
        phone,
        address,
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async loginWithRole(loginData: Record<string, string>) {
    try {
      const response = await this.client.post('/api/auth/login', loginData);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.client.post('/api/auth/logout');
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async me() {
    try {
      const response = await this.client.get('/api/auth/me');
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async updateProfile(data: Partial<User>) {
    try {
      const response = await this.client.put('/api/auth/me', data);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Crime Reports ─────────────────────────────────────── */

  /** Create a crime report (citizen). Accepts FormData for file uploads. */
  async createCrimeReport(formData: FormData) {
    try {
      const response = await this.client.post('/api/crime-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /** Citizen: get own reports */
  async getMyReports() {
    try {
      const response = await this.client.get('/api/my-reports');
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /** Police / Admin: get all reports */
  async getAllReports() {
    try {
      const response = await this.client.get('/api/crime-reports');
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /** Get single report */
  async getReport(id: number) {
    try {
      const response = await this.client.get(`/api/crime-report/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Status Updates ────────────────────────────────────── */

  async updateReportStatus(id: number, status: string, remarks?: string) {
    try {
      const response = await this.client.put(`/api/crime-report/${id}/status`, {
        status,
        remarks,
      });
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Admin Analytics ─────────────────────────────────── */

  async getAdminAnalytics() {
    try {
      const response = await this.client.get('/api/admin/analytics');
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Error Handling ────────────────────────────────────── */

  handleError(error: any) {
    if (error.response) {
      const status = error.response.status;
      const requestUrl = String(error.config?.url || '');
      const isAuthAttempt = /\/api\/auth\/(login|register)/.test(requestUrl);

      if (status === 401 && !isAuthAttempt) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please sign in again.');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return;
      }

      const msg =
        error.response.data?.message ||
        error.response.data?.error ||
        (error.response.data?.errors ? Object.values(error.response.data.errors).flat().join(', ') : null) ||
        `Error ${error.response.status}`;
      console.error(`API Error: ${error.response.status} – ${msg}`);
      console.error('Full response:', error.response.data);
      toast.error(msg);
    } else if (error.request) {
      const apiBase = this.client.defaults.baseURL || window.location.origin;
      console.error('API Error: No response received', error.request);
      toast.error(`Cannot reach API server (${apiBase}). Make sure backend is running.`);
    } else {
      console.error('API Error:', error.message);
      toast.error(error.message || 'Something went wrong');
    }
  }
}

export default ApiClient;
