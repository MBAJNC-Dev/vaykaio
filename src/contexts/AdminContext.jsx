
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminAuthService } from '@/services/AdminAuthService.js';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (AdminAuthService.isAdmin()) {
        setAdminUser(AdminAuthService.getCurrentAdmin());
      } else {
        setAdminUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    const unsubscribe = pb.authStore.onChange(() => {
      checkAuth();
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await AdminAuthService.login(email, password);
      setAdminUser(data.record);
      toast.success('Admin login successful');
      return data;
    } catch (error) {
      toast.error(error.message || 'Admin login failed');
      throw error;
    }
  };

  const logout = () => {
    AdminAuthService.logout();
    setAdminUser(null);
    toast.success('Admin logged out');
  };

  return (
    <AdminContext.Provider value={{ adminUser, isLoading, login, logout, isAuthenticated: !!adminUser }}>
      {children}
    </AdminContext.Provider>
  );
};
