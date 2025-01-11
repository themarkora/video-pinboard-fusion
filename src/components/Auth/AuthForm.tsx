import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin } from "@/components/icons/Pin";
import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthError } from "@supabase/supabase-js";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  const handleError = (error: AuthError) => {
    console.error(`${mode} error:`, error);
    
    // Handle specific error cases
    if (error.message.includes('Email not confirmed')) {
      toast.error('Please check your email and confirm your account before signing in');
    } else if (error.message.includes('Invalid login credentials')) {
      toast.error('Invalid email or password');
    } else if (error.message.includes('Password should be at least 6 characters')) {
      toast.error('Password should be at least 6 characters');
    } else {
      toast.error(`Failed to ${mode}: ${error.message}`);
    }
    
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    try {
      console.log(`Attempting to ${mode} with email:`, email);
      
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      
      toast.success(`Successfully ${mode === "signin" ? "signed in" : "signed up"}!`);
      navigate("/app");
    } catch (error) {
      handleError(error as AuthError);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background-top to-background-bottom px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold text-white mb-2">
            <Pin className="w-6 h-6" />
            <span>VidPin</span>
          </div>
          <p className="text-gray-400">Your personal YouTube video organizer</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card/10 backdrop-blur-sm rounded-lg p-6 space-y-6 w-full">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-400">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-gray-400">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border-gray-700 text-white placeholder:text-gray-500"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center text-sm">
            {mode === "signin" ? (
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-purple-400 hover:text-purple-300"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-purple-400 hover:text-purple-300"
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};