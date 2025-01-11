import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthError, AuthApiError } from '@supabase/supabase-js';

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
      
      // Verify session immediately after sign in
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No session after sign in');
      
      set({ user: session.user });
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
      
      // Check if session exists after signup
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user ?? null });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session, just clear the local state
      if (!session) {
        set({ user: null });
        return;
      }
      
      // If we have a session, attempt to sign out
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null });
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear the local state
      set({ user: null });
      throw error;
    }
  },
}));

// Initialize auth state and set up session persistence
const initializeAuth = async () => {
  try {
    // Get the initial session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session initialization error:', sessionError);
      useAuth.setState({ loading: false });
      return;
    }
    
    useAuth.setState({ 
      user: session?.user ?? null, 
      loading: false 
    });
    console.log('Initial session loaded:', session?.user?.email);

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        // Clear any stored session data
        useAuth.setState({ user: null, loading: false });
      } else if (session) {
        // Verify session is valid
        const { data } = await supabase.auth.getSession();
        useAuth.setState({ 
          user: data.session?.user ?? null,
          loading: false 
        });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error('Error initializing auth:', error);
    useAuth.setState({ loading: false });
  }
};

// Initialize auth immediately
initializeAuth();