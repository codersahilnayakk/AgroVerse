import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create axios instance with admin token
  const adminApi = axios.create({ baseURL: `${API}/api/admin` });
  adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      adminApi.get('/verify')
        .then((res) => setAdmin(res.data.admin))
        .catch(() => { localStorage.removeItem('adminToken'); setAdmin(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await adminApi.post('/login', { username, password });
    localStorage.setItem('adminToken', res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, login, logout, adminApi }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
