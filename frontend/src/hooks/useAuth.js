// src/hooks/useAuth.js
import { useState } from 'react';
import { login as authLogin, logout as authLogout } from '../services/auth';
import { setToken, setUser, getUser, removeToken } from '../services/token';

export const useAuth = () => {
  const [user, setCurrentUser] = useState(getUser());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user: userData } = await authLogin(email, password);
      setToken(token);
      setUser(userData);
      setCurrentUser(userData);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authLogout();
    setCurrentUser(null);
  };

  return { user, error, loading, login, logout };
};