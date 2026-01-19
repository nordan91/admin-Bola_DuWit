import type { ApiResponse, ApiPendingUMKMUser, ApiUMKMProfileWithUser, ApiUser, ApiUMKMProfile, Transaction } from '../types/admin';

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

  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      const response = await fetch(`${this.baseUrl}/user/profile`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Don't automatically logout - just return false
          // Let the calling code decide what to do
          return false;
        }
        return false;
      }

      const data = await response.json();
      return data && data.id; // Pastikan response memiliki user data
    } catch (error) {
      console.error('Token validation error:', error);
      // Don't automatically logout - just return false
      // Let the calling code decide what to do
      return false;
    }
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

  async suspendUMKM(userId: string, data: { reason: string; duration_days: number | null }): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/suspend-umkm/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({
          reason: data.reason,
          duration_days: data.duration_days
        })
      });

      return await this.handleResponse<ApiResponse<ApiUser>>(response);
    } catch (error) {
      throw error;
    }
  }

  async activateUMKM(userId: string): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/activate-umkm/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      return await this.handleResponse<ApiResponse<ApiUser>>(response);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Membatalkan penangguhan akun UMKM
   * @param userId ID pengguna UMKM yang akan dibatalkan penangguhannya
   */
  async unsuspendUMKM(userId: string): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/unsuspend-umkm/${userId}`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      return await this.handleResponse<ApiResponse<ApiUser>>(response);
    } catch (error) {
      console.error('Error unsuspending UMKM account:', error);
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

  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${this.baseUrl}/admin/transactions`, {
      headers: this.getAuthHeader(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch transactions');
    }
    return data.data || [];
  }

  // Get completed transactions for UMKM payment
  async getCompletedTransactionsForPayment(): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: string;
      total_harga: number;
      status_transaksi: string;
      status_pembayaran: string;
      tanggal_transaksi: string;
      nama_pembeli: string;
      umkm_payment_info: Array<{
        umkm_id: string;
        nama_toko: string;
        owner: string;
        nomor_rekening: string;
        nama_bank: string;
        total_pembayaran: number;
        status_pembayaran: 'belum_dibayarkan' | 'sudah_dibayarkan';
        tanggal_pembayaran: string | null;
        bukti_transfer_path: string | null;
        admin_pembayaran: string | null;
      }>;
    }>;
  }> {
    const response = await fetch(`${this.baseUrl}/admin/payments/completed-transactions`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse(response);
  }

  // Upload payment proof for specific UMKM
  async uploadPaymentProof(transactionId: string, umkmId: string, file: File): Promise<{
    success: boolean;
    message: string;
    data: {
      transaction_id: string;
      umkm_id: string;
      bukti_transfer_path: string;
      status_pembayaran: 'belum_dibayarkan' | 'sudah_dibayarkan';
      tanggal_pembayaran: string;
      jumlah_pembayaran: number;
    };
  }> {
    const formData = new FormData();
    formData.append('bukti_transfer', file);

    // For file uploads, we only need Authorization header
    // Don't set Content-Type as browser will set it with boundary
    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.getToken()}`,
    };

    const response = await fetch(`${this.baseUrl}/admin/payments/${transactionId}/umkm/${umkmId}/upload-proof`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return this.handleResponse(response);
  }
}





export const apiService = new ApiService(API_BASE_URL);