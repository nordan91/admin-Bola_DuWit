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

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        redirect: 'manual', // Prevent automatic redirect following
      });

      if (!response.ok) {
        if (response.status === 302) {
          // Handle redirect as authentication error
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
      
      // Check if login was successful
      if (!data.success) {
        throw {
          message: data.message || 'Login gagal.',
          status: response.status,
        } as ApiError;
      }
      
      // Store token and user data in localStorage
      if (data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        // Ensure user role is set to admin
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

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.logout();
          throw {
            message: 'Sesi Anda telah berakhir. Silakan login kembali.',
            status: 401,
          } as ApiError;
        }
        throw {
          message: 'Gagal mengambil data pengguna.',
          status: response.status,
        } as ApiError;
      }

      return await response.json();
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