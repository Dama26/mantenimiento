// src/services/auth.js
import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      correo: email,
      contrasena: password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Login failed. Please try again.';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};