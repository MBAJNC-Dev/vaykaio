
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient.js';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const currentSession = data.session;
        setSession(currentSession);
        setUser(currentSession?.user || null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (currentSession?.user) {
        await fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          name,
          role: 'guest',
        });
      }

      return data;
    } catch (error) {
      toast.error(error.message || 'Signup failed');
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error(error.message || 'Google sign-in failed');
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error(error.message || 'Apple sign-in failed');
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const userRole = profile?.role || 'guest';
  const isAdmin = profile?.role === 'admin';
  const isOwner = profile?.role === 'owner';

  // Build the user model with profile data merged (for currentUser compat)
  const currentUser = user ? {
    id: user.id,
    email: user.email,
    name: profile?.name || user.user_metadata?.name || '',
    avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    role: profile?.role || 'guest',
    ...profile,
  } : null;

  const value = {
    user,
    currentUser,        // Alias for components expecting currentUser
    session,
    profile,
    loading,
    initialLoading: loading, // Alias for components expecting initialLoading
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithApple,
    updateProfile,
    isAuthenticated: !!user,
    userRole,
    isAdmin,
    isOwner,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
