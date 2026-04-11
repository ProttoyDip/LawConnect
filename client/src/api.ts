import axios, { AxiosError, AxiosInstance } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';
import type { UserRole } from './utils/roles';


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
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface InvitationPreview {
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
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

interface ErrorResponseData {
  message?: string;
  error?: string;
  errors?: Record<string, string | string[]>;
}

type ApiError = AxiosError<ErrorResponseData>;

/* ──────────────────────────── Client ─────────────────────────── */

class ApiClient {
  private client: AxiosInstance;
  private static meRequest: { token: string | null; promise: Promise<User> } | null = null;
  private static meCache: { data: User; expiresAt: number; token: string | null } | null = null;
  private static readonly ME_CACHE_TTL_MS = 15000;

  constructor() {
    this.client = axios.create({
      baseURL: secrets.backendEndpoint,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Attach bearer token on every request.
    this.client.interceptors.request.use(async (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    this.client.interceptors.response.use((response) => response, (error) => Promise.reject(error));
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
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async getInvitation(token: string): Promise<InvitationPreview> {
    try {
      const response = await this.client.get(`/api/auth/invitations/${encodeURIComponent(token)}`);
      return response.data.invitation;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async registerInvited(token: string, password: string, password_confirmation: string) {
    try {
      const response = await this.client.post('/api/auth/register-invited', {
        token,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await this.client.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async resetPassword(token: string, email: string, password: string, password_confirmation: string) {
    try {
      const response = await this.client.post('/api/auth/reset-password', {
        token,
        email,
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async loginWithRole(loginData: Record<string, string>) {
    try {
      const response = await this.client.post('/api/auth/login', loginData);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async logout() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.clearUserCache();
      return { message: 'Logged out locally.' };
    }

    try {
      const response = await this.client.post('/api/auth/logout');
      this.clearUserCache();
      return response.data;
    } catch (error: unknown) {
      this.clearUserCache();
      if (axios.isAxiosError<ErrorResponseData>(error) && error.response?.status === 401) {
        // Session/token already invalid. Treat logout as completed client-side.
        return { message: 'Logged out locally.' };
      }
      this.handleError(error);
      throw error;
    }
  }

  async getMe(forceRefresh = false): Promise<User> {
    try {
      const now = Date.now();
      const token = localStorage.getItem('token');

      if (!token) {
        this.clearUserCache();
      }

      if (
        !forceRefresh &&
        ApiClient.meCache &&
        ApiClient.meCache.expiresAt > now &&
        ApiClient.meCache.token === token
      ) {
        return ApiClient.meCache.data;
      }

      if (!forceRefresh && ApiClient.meRequest && ApiClient.meRequest.token === token) {
        return await ApiClient.meRequest.promise;
      }

      const mePromise = this.client
        .get('/api/auth/me')
        .then((response) => {
          this.updateUserCache(response.data as User);
          return response.data as User;
        })
        .catch((error: unknown) => {
          const status = axios.isAxiosError<ErrorResponseData>(error) ? error.response?.status : null;
          const currentToken = localStorage.getItem('token');
          if (status === 429 && ApiClient.meCache && ApiClient.meCache.token === currentToken) {
            return ApiClient.meCache.data;
          }
          throw error;
        })
        .finally(() => {
          ApiClient.meRequest = null;
        });

      ApiClient.meRequest = {
        token,
        promise: mePromise,
      };

      return await mePromise;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async me() {
    return this.getMe();
  }

  async updateProfile(data: Partial<User>) {
    try {
      const response = await this.client.put('/api/auth/me', data);
      const userData = (response.data?.user || response.data) as User;
      this.updateUserCache(userData);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  private updateUserCache(userData?: User | null) {
    if (!userData) {
      return;
    }
    const token = localStorage.getItem('token');
    ApiClient.meCache = {
      data: userData,
      expiresAt: Date.now() + ApiClient.ME_CACHE_TTL_MS,
      token,
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }

  private clearUserCache() {
    ApiClient.meCache = null;
    ApiClient.meRequest = null;
    localStorage.removeItem('user');
  }

  /* ── Crime Reports ─────────────────────────────────────── */

  /** Create a crime report (citizen). Accepts FormData for file uploads. */
  async createCrimeReport(formData: FormData) {
    try {
      const response = await this.client.post('/api/crime-report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  /** Citizen: get own reports */
  async getMyReports() {
    try {
      const response = await this.client.get('/api/my-reports');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  /** Police / Admin: get all reports */
  async getAllReports() {
    try {
      const response = await this.client.get('/api/crime-reports');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  /** Get single report */
  async getReport(id: number) {
    try {
      const response = await this.client.get(`/api/crime-report/${id}`);
      return response.data;
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Investigator APIs ────────────────────────────────── */

  async getInvestigatorCases(filters: { page?: number; status?: string; priority?: string; search?: string } = {}) {
    try {
      const params = new URLSearchParams(
        Object.entries({ per_page: '15', ...filters }).reduce<Record<string, string>>((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = String(value);
          }
          return acc;
        }, {})
      );
      const response = await this.client.get(`/api/investigator/cases?${params}`);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async getInvestigatorStats() {
    try {
      const response = await this.client.get('/api/investigator/stats');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async getCaseDetails(caseId: number) {
    try {
      const response = await this.client.get(`/api/investigator/cases/${caseId}`);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async getCaseNotes(caseId: number) {
    try {
      const response = await this.client.get(`/api/cases/${caseId}/notes`);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async createNote(caseId: number, note: string) {
    try {
      const response = await this.client.post(`/api/cases/${caseId}/notes`, { note });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async updateNote(noteId: number, note: string) {
    try {
      const response = await this.client.put(`/api/notes/${noteId}`, { note });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteNote(noteId: number) {
    try {
      const response = await this.client.delete(`/api/notes/${noteId}`);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async getNotifications() {
    try {
      const response = await this.client.get('/api/notifications');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async markNotificationRead(notificationId: number) {
    try {
      const response = await this.client.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async markAllNotificationsRead() {
    try {
      const response = await this.client.put('/api/notifications/read-all');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Admin Analytics ─────────────────────────────────── */

  async getAdminAnalytics() {
    try {
      const response = await this.client.get('/api/admin/analytics');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async getAdminUsers() {
    try {
      const response = await this.client.get('/api/admin/users');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async createAdminUser(payload: {
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    national_id?: string;
    badge_number?: string;
    police_station?: string;
  }) {
    try {
      const response = await this.client.post('/api/admin/users', payload);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteAdminUser(userId: number) {
    try {
      const response = await this.client.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async getOfficers() {
    try {
      const response = await this.client.get('/api/officers');
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  async assignInvestigator(crimeReportId: number, officerId: number, notes?: string) {
    try {
      const response = await this.client.post('/api/assign-police', {
        crime_report_id: crimeReportId,
        officer_id: officerId,
        ...(notes ? { notes } : {}),
      });
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Error Handling ────────────────────────────────────── */

  handleError(error: unknown) {
    if (axios.isAxiosError<ErrorResponseData>(error)) {
      const axiosError = error as ApiError;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const requestUrl = String(axiosError.config?.url || '');
        const isAuthAttempt = /\/api\/auth\/(login|register|register-invited)/.test(requestUrl);

        if (status === 401 && !isAuthAttempt) {
          this.clearUserCache();
          localStorage.removeItem('token');
          toast.error('Session expired. Please sign in again.');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return;
        }

        const responseData = axiosError.response.data;
        const validationErrors = responseData?.errors
          ? Object.values(responseData.errors).flatMap((value) => (Array.isArray(value) ? value : [value])).join(', ')
          : null;
        const msg =
          responseData?.message ||
          responseData?.error ||
          validationErrors ||
          `Error ${status}`;
        console.error(`API Error: ${status} – ${msg}`);
        console.error('Full response:', responseData);
        toast.error(msg);
        return;
      }

      if (axiosError.request) {
        const apiBase = this.client.defaults.baseURL || window.location.origin;
        console.error('API Error: No response received', axiosError.request);
        toast.error(`Cannot reach API server (${apiBase}). Make sure backend is running.`);
        return;
      }

      console.error('API Error:', axiosError.message);
      toast.error(axiosError.message || 'Something went wrong');
      return;
    }

    const message = error instanceof Error ? error.message : 'Something went wrong';
    console.error('API Error:', message);
    toast.error(message);
  }
}

export default ApiClient;
