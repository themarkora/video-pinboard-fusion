import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import { AuthForm } from "./components/Auth/AuthForm";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-background-top to-background-bottom flex items-center justify-center">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
      <p>Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const App = () => {
  const { user, loading } = useAuth();

  // Show loading screen while initial auth state is being determined
  if (loading) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <LoadingScreen />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth"
              element={user ? <Navigate to="/app" /> : <AuthForm />}
            />
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;