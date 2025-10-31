import type { ApiResponse, ApiPendingUMKMUser, ApiUMKMProfileWithUser, ApiUser, ApiUMKMProfile } from '../types/admin';

const API_BASE_URL = 'https://bola-duwit.my.id/api';

export interface LoginCredentials {
  email: string;
  kata_sandi: string;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  kata_sandi: string;
  nomor_hp: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('authToken');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw {
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          status: 401,
        } as ApiError;
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || errorData.error || 'Terjadi kesalahan pada server.',
        status: response.status,
      } as ApiError;
    }

    return await response.json();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        redirect: 'manual',
      });

      if (!response.ok) {
        if (response.status === 302) {
          throw {
            message: 'Authentication required. Please check your credentials.',
            status: 401,
          } as ApiError;
        }
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || 'Login gagal. Periksa email dan password Anda.',
          status: response.status,
        } as ApiError;
      }

      const data: LoginResponse = await response.json();
      
      if (!data.success) {
        throw {
          message: data.message || 'Login gagal.',
          status: response.status,
        } as ApiError;
      }
      
      if (data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        const userData = { ...data.data.user, role: 'admin' };
        localStorage.setItem('userData', JSON.stringify(userData));
      }

      return data;
    } catch (error) {
      if ((error as ApiError).message) {
        throw error;
      }
      throw {
        message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      } as ApiError;
    }
  }

  async getUsers(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Admin UMKM Management APIs
  // GET /admin/pending-umkm - Returns users with umkmProfile relation
  async getPendingUMKM(): Promise<ApiResponse<ApiPendingUMKMUser[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/pending-umkm`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      return await this.handleResponse<ApiResponse<ApiPendingUMKMUser[]>>(response);
    } catch (error) {
      throw error;
    }
  }

  // GET /admin/umkm-profiles - Returns profiles with user relation
  async getAllUMKMProfiles(): Promise<ApiResponse<ApiUMKMProfileWithUser[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/umkm-profiles`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      return await this.handleResponse<ApiResponse<ApiUMKMProfileWithUser[]>>(response);
    } catch (error) {
      throw error;
    }
  }

  async approveUMKM(userId: string): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/approve-umkm/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      return await this.handleResponse<ApiResponse<ApiUser>>(response);
    } catch (error) {
      throw error;
    }
  }

  async rejectUMKM(userId: string, reason?: string): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/reject-umkm/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ reason }),
      });

      return await this.handleResponse<ApiResponse<ApiUser>>(response);
    } catch (error) {
      throw error;
    }
  }

  async verifyUMKMProfile(profileId: string): Promise<ApiResponse<ApiUMKMProfile>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/verify-profile/${profileId}`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      return await this.handleResponse<ApiResponse<ApiUMKMProfile>>(response);
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  getUser(): User | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const apiService = new ApiService(API_BASE_URL);