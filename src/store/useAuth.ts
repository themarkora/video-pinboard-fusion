import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useVideos } from './useVideos';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initializeAuth: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      set({ user: session?.user ?? null, loading: false });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, loading: false });
    }
  },
  signIn: async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    
    set({ user: data.user });
    console.log('Sign in successful:', data);
  },
  signUp: async (email: string, password: string) => {
    console.log('Attempting to sign up with email:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    
    set({ user: data.user });
    console.log('Sign up successful:', data);
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      useVideos.getState().clearState();
      set({ user: null });
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      useVideos.getState().clearState();
      set({ user: null });
      throw error;
    }
  },
}));

// Initialize auth state and set up listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email);
  useAuth.setState({ user: session?.user ?? null, loading: false });
});

// Initialize auth state on app load
useAuth.getState().initializeAuth();