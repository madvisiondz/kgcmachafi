import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { publicAuthApi } from '@/lib/localApi';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (sessionPayload) => {
    setSession(sessionPayload ?? null);
    setUser(sessionPayload?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await publicAuthApi.getSession();
        handleSession(response.authenticated ? response : null);
      } catch (error) {
        handleSession(null);
      }
    };

    getSession();
  }, [handleSession]);

  const signUp = useCallback(async (payload) => {
    try {
      const response = await publicAuthApi.register(payload);
      await handleSession({ user: response.user });
      return { error: null, user: response.user };
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'فشل إنشاء الحساب',
        description: error.message || 'حدث خطأ أثناء إنشاء الحساب',
      });
      return { error };
    }
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    try {
      const response = await publicAuthApi.login({ email, password });
      await handleSession({ user: response.user });
      return { error: null, user: response.user };
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'فشل تسجيل الدخول',
        description: error.message || 'حدث خطأ أثناء تسجيل الدخول',
      });
      return { error };
    }
  }, [handleSession, toast]);

  const signOut = useCallback(async () => {
    try {
      await publicAuthApi.logout();
      await handleSession(null);
      return { error: null };
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'فشل تسجيل الخروج',
        description: error.message || 'حدث خطأ أثناء تسجيل الخروج',
      });
      return { error };
    }
  }, [handleSession, toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};