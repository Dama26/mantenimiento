// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
// import { getUser } from '../services/token';

import { login as authLogin, logout as authLogout } from '../services/auth';
import { setToken, getToken, setUser, getUser, removeToken } from '../services/token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // const initializeAuth = async () => {
    //   const storedUser = getUser();
    //   setUserState(storedUser);
    //   setLoading(false);
    // };
    // initializeAuth();
  const token = getToken();
  if (token) {
    // Verify token with backend if needed
    const storedUser = getUser();
    if (storedUser) {
      setUserState(storedUser);
    }
  }
  setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user: userData } = await authLogin(email, password);
      setToken(token);
      setUser(userData);
      setUserState(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    authLogout();
    removeToken();
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => useContext(AuthContext);
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  if (!context.user) {
    console.log('User is not authenticated');
    context.user = getUser();

  }

  return context;
}