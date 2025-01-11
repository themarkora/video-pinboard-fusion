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
  loading: true, // Start with loading true
  signIn: async (email: string, password: string) => {
    set({ loading: true }); // Set loading true during sign in
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } finally {
      set({ loading: false }); // Always set loading false after attempt
    }
  },
  signUp: async (email: string, password: string) => {
    set({ loading: true }); // Set loading true during sign up
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user });
    } finally {
      set({ loading: false }); // Always set loading false after attempt
    }
  },
  signOut: async () => {
    set({ loading: true }); // Set loading true during sign out
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } finally {
      set({ loading: false }); // Always set loading false after attempt
    }
  },
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuth.setState({ user: session?.user ?? null, loading: false });
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuth.setState({ user: session?.user ?? null, loading: false });
});