import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
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
    });
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    set({ user: data.user });
    console.log('Sign up successful:', data);
  },
  signOut: () => {
    set({ user: null });
  },
}));

// Initialize auth state
const initializeAuth = async () => {
  try {
    // Get the initial session
    const { data: { session } } = await supabase.auth.getSession();
    useAuth.setState({ user: session?.user ?? null, loading: false });
    
    // Set up real-time subscription to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      useAuth.setState({ user: session?.user ?? null, loading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error('Error initializing auth:', error);
    useAuth.setState({ loading: false });
  }
};

// Call initialize immediately
initializeAuth();