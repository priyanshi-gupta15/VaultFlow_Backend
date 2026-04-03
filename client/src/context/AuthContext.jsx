import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('vaultflow_user') || 'null'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic verification of login state
    if (user) {
      setUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const userData = { ...data.data.user, token: data.token };
    localStorage.setItem('vaultflow_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('vaultflow_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isAnalyst = user?.role === 'ANALYST' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isAnalyst }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
