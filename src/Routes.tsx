import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import { AuthForm } from "./components/Auth/AuthForm";

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

export const Routes = () => {
  const { user } = useAuth();

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
        element={user ? <Navigate to="/app" /> : <Landing />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/app" /> : <AuthForm />}
      />
    </RouterRoutes>
  );
};