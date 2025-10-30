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

export interface LoginCredentials {
  email: string;
  kata_sandi: string;
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