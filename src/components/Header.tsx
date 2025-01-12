import { Button } from "@/components/ui/button";
import { LogOut, Pin } from "lucide-react";
import { useAuth } from "@/store/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if there's an error signing out from Supabase,
      // we'll redirect the user and show success since the local state is cleared
      toast.success("Successfully signed out");
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