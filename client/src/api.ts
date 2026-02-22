import axios, { AxiosInstance } from 'axios';
import { secrets } from './secrets';
import toast from 'react-hot-toast';

/* ──────────────────────────── Types ──────────────────────────── */

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'citizen' | 'police' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CrimeReport {
  id: number;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

/* ──────────────────────────── Client ─────────────────────────── */

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: secrets.backendEndpoint,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Attach token from localStorage on every request
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /* ── Auth ───────────────────────────────────────────────── */

  async register(name: string, email: string, password: string, password_confirmation: string, role: string = 'citizen') {
    try {
      const response = await this.client.post('/api/auth/register', {
        name,
        email,
        password,
        password_confirmation,
        role,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await this.client.post('/api/auth/login', { email, password });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.client.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async me() {
    try {
      const response = await this.client.get('/api/auth/me');
      return response.data;
    } catch (error) {
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
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /** Citizen: get own reports */
  async getMyReports() {
    try {
      const response = await this.client.get('/api/my-reports');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /** Police / Admin: get all reports */
  async getAllReports() {
    try {
      const response = await this.client.get('/api/crime-reports');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /** Get single report */
  async getReport(id: number) {
    try {
      const response = await this.client.get(`/api/crime-report/${id}`);
      return response.data;
    } catch (error) {
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
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /* ── Error Handling ────────────────────────────────────── */

  handleError(error: any) {
    if (error.response) {
      const msg =
        error.response.data?.message ||
        error.response.data?.error ||
        `Error ${error.response.status}`;
      console.error(`API Error: ${error.response.status} – ${msg}`);
      toast.error(msg);
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
      toast.error('No response from server');
    } else {
      console.error('API Error:', error.message);
      toast.error(error.message || 'Something went wrong');
    }
  }
}

export default ApiClient;
