import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import { AuthForm } from "./components/Auth/AuthForm";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

// Helper component to handle auth redirects
const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Check if we have a hash in the URL (from email confirmation)
    if (location.hash && location.hash.includes('access_token')) {
      // Extract the access token
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        // If we have a token, redirect to /app
        navigate('/app', { replace: true });
      }
    }
  }, [location.hash, navigate]);

  // If user is already authenticated, redirect to app
  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  return null;
};

const App = () => {
  // Handle auth state changes and redirects
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // If user is verified, redirect to app
        if (session?.user?.email_confirmed_at) {
          window.location.href = '/app';
        }
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthRedirectHandler />
          <Routes>
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={<Landing />}
            />
            <Route
              path="/auth"
              element={<AuthForm />}
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;