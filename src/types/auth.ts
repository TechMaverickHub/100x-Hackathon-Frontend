export interface User {
  pk: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  role: {
    pk: number;
    name: string;
  };
  linkedin_url?: string;
  github_url?: string;
  resume_file?: string | null;
}

export interface LoginResponse {
  message: string;
  status: number;
  results: {
    refresh: string;
    access: string;
    user: User;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  linkedin_url?: string;
  github_url?: string;
  resume_file?: File;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
