import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pin } from "@/components/icons/Pin";
import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log(`Attempting to ${mode} with email:`, email);
      if (mode === "signin") {
        try {
          await signIn(email, password);
          toast.success("Successfully signed in!");
        } catch (error: any) {
          // If we get "Email not confirmed" error but email verification is disabled,
          // try signing in again
          if (error instanceof AuthApiError && 
              error.message.includes('Email not confirmed')) {
            await signIn(email, password);
            toast.success("Successfully signed in!");
          } else {
            throw error;
          }
        }
      } else {
        await signUp(email, password);
        toast.success("Successfully signed up!");
      }
    } catch (error: any) {
      console.error(`${mode} error:`, error);
      toast.error(`Failed to ${mode}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
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
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center text-sm">
            {mode === "signin" ? (
              <p className="text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-purple-400 hover:text-purple-300"
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