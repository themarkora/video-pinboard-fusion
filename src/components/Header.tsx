import { Button } from "@/components/ui/button";
import { LogOut, Pin } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // First clear local state
      signOut();
      
      // Attempt to sign out from Supabase in both iframe and main window contexts
      const { error } = await supabase.auth.signOut({
        scope: 'local'  // Changed to local to avoid cross-origin issues in iframe
      });
      
      if (error) {
        console.error("Sign out error:", error);
        // Don't show error to user since we've already cleared local state
      }
      
      // Clear any remaining auth data from localStorage
      window.localStorage.removeItem('sb-' + import.meta.env.VITE_SUPABASE_PROJECT_ID + '-auth-token');
      
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error: any) {
      console.error("Sign out error:", error);
      // Don't show error to user since we've already cleared local state
      navigate("/");
    }
  };

  return (
    <header className="w-full px-6 py-4 bg-[#0F1116] border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pin 
            size={32} 
            className="text-primary"
            strokeWidth={2.5}
          />
          <span className="text-2xl font-bold">VidPin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">{user?.email}</span>
          <Button 
            variant="ghost" 
            className="text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}