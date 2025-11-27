"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  mobile?: string;
  phone?: string;
  bio?: string;
  company?: string;
  position?: string;
  department?: string;
  website?: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
}

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
}

interface AuthContextType {
  signup: (userData: SignupData) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Helper function to get API base URL
  const getApiBaseUrl = () => {
    return '' // This uses relative paths like /api/auth
  }

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        if (!localStorage.getItem('token') && localStorage.getItem('access_token')) {
          localStorage.setItem('token', localStorage.getItem('access_token')!);
        }
        
        const userData = JSON.parse(storedUser)
        if (userData.full_name && !userData.firstName) {
          const nameParts = userData.full_name.split(' ')
          userData.firstName = nameParts[0] || ''
          userData.lastName = nameParts.slice(1).join(' ') || ''
        }
        setUser(userData)
        setIsAuthenticated(true)
        
        console.log('✅ Authentication restored on page load');
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }, [])

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const backendData = {
        action: 'signup',
        email: userData.email,
        password: userData.password,
        full_name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.mobile
      };

      console.log('Sending signup data to backend:', backendData);

      const response = await fetch(`${getApiBaseUrl()}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Signup error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('Signup success:', result);
      
      if (result.access_token && result.user) {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('token_type', result.token_type || 'bearer');
        
        const userData = result.user;
        if (userData.full_name && !userData.firstName) {
          const nameParts = userData.full_name.split(' ');
          userData.firstName = nameParts[0] || '';
          userData.lastName = nameParts.slice(1).join(' ') || '';
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
      }
      
      return true;
    } catch (error) {
      console.error('Network error:', error);
      return false;
    } finally {
      setIsLoading(false)
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const loginData = {
        action: 'login',
        email: email,
        password: password
      };

      console.log('Sending login data to backend:', loginData);

      const response = await fetch(`${getApiBaseUrl()}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('Login success:', result);
      
      if (result.access_token && result.user) {
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('token_type', result.token_type || 'bearer');
        
        const userData = result.user;
        if (userData.full_name && !userData.firstName) {
          const nameParts = userData.full_name.split(' ');
          userData.firstName = nameParts[0] || '';
          userData.lastName = nameParts.slice(1).join(' ') || '';
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        
        const isSecure = window.location.protocol === 'https:';
        document.cookie = `access_token=${result.access_token}; path=/; max-age=86400; SameSite=strict${isSecure ? '; secure' : ''}`;
        
        console.log('✅ Token stored and user state updated');
        return true;
      } else {
        console.error('❌ No access token or user data received');
        return false;
      }
      
    } catch (error) {
      console.error('Login network error:', error);
      return false;
    } finally {
      setIsLoading(false)
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user');
    
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    console.log('✅ User logged out, all tokens cleared');
    window.location.href = '/login';
  };

  const value = {
    signup,
    login,
    logout,
    user,
    isLoading,
    isAuthenticated,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ✅ CRITICAL: Export useAuth function (DO NOT import it from itself!)
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
