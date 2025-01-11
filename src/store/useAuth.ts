import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from "sonner";

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
      toast.success("Successfully signed in");
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || "Failed to sign in");
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
      toast.success("Successfully signed up");
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || "Failed to sign up");
      throw error;
    }
  },
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error("Error signing out");
      throw error;
    }
  },
}));

// Initialize auth state
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuth.setState({ user: null, loading: false });
  } else if (session?.user) {
    useAuth.setState({ user: session.user, loading: false });
  } else {
    useAuth.setState({ loading: false });
  }
});

// Get initial session
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuth.setState({ 
    user: session?.user ?? null,
    loading: false
  });
});