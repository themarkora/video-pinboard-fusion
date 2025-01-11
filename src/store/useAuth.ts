import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
}));

// Initialize auth state and set up session persistence
const initializeAuth = async () => {
  try {
    // Get the initial session
    const { data: { session } } = await supabase.auth.getSession();
    useAuth.setState({ user: session?.user ?? null, loading: false });
    console.log('Initial session loaded:', session?.user?.email);

    // Set up auth state change listener
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.email);
      useAuth.setState({ user: session?.user ?? null, loading: false });
    });
  } catch (error) {
    console.error('Error initializing auth:', error);
    useAuth.setState({ loading: false });
  }
};

// Initialize auth immediately
initializeAuth();