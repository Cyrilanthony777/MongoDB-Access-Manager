'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { Dashboard } from '@/components/dashboard';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="text-lg text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
      <Toaster />
    </>
  );
}
