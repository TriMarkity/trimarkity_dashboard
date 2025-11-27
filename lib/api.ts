const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
}

export interface ProfileUpdate {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  bio?: string;
}

export interface CompanyUpdate {
  name: string;
  address?: string;
  website?: string;
  phone?: string;
}

export interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials) {
    return this.request<{
      access_token: string;
      token_type: string;
      expires_in: number;
      user: any;
    }>('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', ...credentials }),
    });
  }

  async signup(userData: SignupData) {
    return this.request<{
      access_token: string;
      token_type: string;
      expires_in: number;
      user: any;
    }>('/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'signup', ...userData }),
    });
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string; success: boolean }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request<{ message: string; success: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string }>('/health');
  }

  // -------------------------
  // Authenticated requests
  // -------------------------
  private authRequest<T>(endpoint: string, token: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Profile update
  async updateProfile(token: string, data: ProfileUpdate) {
    return this.authRequest('/users/profile', token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Company update
  async updateCompany(token: string, data: CompanyUpdate) {
    return this.authRequest('/users/company', token, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Password update
  async updatePassword(token: string, data: PasswordUpdate) {
    return this.authRequest('/users/password', token, {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
