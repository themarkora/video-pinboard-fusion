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
  refreshSession: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  refreshSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session refresh error:', error);
        set({ user: null, loading: false });
        return;
      }
      set({ user: session?.user || null, loading: false });
    } catch (error) {
      console.error('Session refresh error:', error);
      set({ user: null, loading: false });
    }
  },
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
      localStorage.clear();
      toast.success("Successfully signed out");
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ user: null });
      localStorage.clear();
      toast.error("Error during sign out, but you've been logged out locally");
    }
  },
}));

// Initialize auth state and set up real-time subscription
const initializeAuth = async () => {
  try {
    // Get the initial session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting initial session:', error);
      useAuth.setState({ loading: false });
      return;
    }

    useAuth.setState({ 
      user: session?.user ?? null, 
      loading: false 
    });

    // Set up real-time subscription to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        useAuth.setState({ user: null, loading: false });
        localStorage.clear();
      } else if (session?.user) {
        useAuth.setState({ user: session.user, loading: false });
      }
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

export const refreshSession = async () => {
  const auth = useAuth.getState();
  await auth.refreshSession();
};