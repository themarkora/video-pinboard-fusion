import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes } from './Routes';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Check and refresh session on app load
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking session:', error);
      }
      if (!session) {
        // If no session, clear any stale data
        await supabase.auth.signOut();
      }
    };
    
    checkSession();
  }, []);

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