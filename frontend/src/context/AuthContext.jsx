import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup({ name, email, password });
      if (response.data.success) {
        const userData = { name, email };
        setUser(userData);
        // Note: Backend signup doesn't return token, so user needs to login
        setError('Signup successful! Please login.');
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        const { token } = response.data;
        setToken(token);
        setUser({ email });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email }));
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const googleLogin = useCallback(async (googleToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.googleLogin(googleToken);
      if (response.data.success) {
        const { token, email, name } = response.data;
        setToken(token);
        setUser({ email, name });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ email, name }));
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        signup,
        login,
        googleLogin,
        logout,
        isAuthenticated,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
