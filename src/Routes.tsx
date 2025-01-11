import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import { AuthForm } from "./components/Auth/AuthForm";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background-top to-background-bottom">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      <p className="text-gray-400">Loading your content...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // If we're loading the auth state, show loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export const Routes = () => {
  const { user, loading } = useAuth();

  // Show loading screen only during initial auth check
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <RouterRoutes>
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
        element={user ? <Navigate to="/app" replace /> : <Landing />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/app" replace /> : <AuthForm />}
      />
      {/* Catch all route - redirect to main page or landing based on auth state */}
      <Route
        path="*"
        element={user ? <Navigate to="/app" replace /> : <Navigate to="/" replace />}
      />
    </RouterRoutes>
  );
};