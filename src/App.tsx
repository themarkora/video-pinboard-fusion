import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes } from './Routes';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useVideos } from '@/store/useVideos';

const queryClient = new QueryClient();

function App() {
  const { clearAllData, fetchVideos, fetchBoards } = useVideos();

  useEffect(() => {
    // Check and refresh session on app load
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          toast.error('Session error: Please sign in again');
          clearAllData(); // Clear all data if session error
          await supabase.auth.signOut();
          return;
        }

        if (!session) {
          console.log('No active session found');
          clearAllData(); // Clear all data if no session
          await supabase.auth.signOut();
          return;
        }

        // If we have a valid session, fetch user data
        await Promise.all([fetchVideos(), fetchBoards()]);
      } catch (error) {
        console.error('Session check failed:', error);
        toast.error('Session check failed: Please sign in again');
        clearAllData();
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        clearAllData(); // Clear all data on sign out
        toast.info('You have been signed out');
      } else if (event === 'SIGNED_IN' && session) {
        // Fetch user data on sign in
        await Promise.all([fetchVideos(), fetchBoards()]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearAllData, fetchVideos, fetchBoards]);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase} initialSession={null}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;