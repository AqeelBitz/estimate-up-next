'use client';

import { useMemo } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const cookies = useMemo(() => new Cookies(), []);
  const router = useRouter();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = cookies.get('jwt') || localStorage.getItem('token');
        setAuthState({
          isAuthenticated: !!token,
          isLoading: false,
          isInitialized: true
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          isInitialized: true
        });
      }
    };

    checkAuth();
  }, [cookies]);

  const login = (token) => {
    cookies.set('jwt', token);
    localStorage.setItem('token', token);
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true
    });
    router.push('/');
  };

  const logout = () => {
    cookies.remove('jwt');
    localStorage.removeItem('token');
    localStorage.removeItem('loggedin_user');
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true
    });
    router.push('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}