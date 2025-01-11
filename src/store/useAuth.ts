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
  signOut: async () => {
    set({ user: null }); // Immediately clear the user state
    console.log('Local state cleared');
  },
}));

// Initialize auth state and set up listener for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email);
  useAuth.setState({ user: session?.user ?? null, loading: false });
});

// Get initial session
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuth.setState({ user: session?.user ?? null, loading: false });
});