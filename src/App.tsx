import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import { Toaster } from "@/components/ui/toaster";
import { Routes } from './Routes';

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <Routes />
        <Toaster />
      </BrowserRouter>
    </SessionContextProvider>
  );
}

export default App;