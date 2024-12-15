import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      switch (event) {
        case 'SIGNED_IN':
          if (session) navigate('/');
          break;
        case 'SIGNED_OUT':
          navigate('/auth');
          break;
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#e31837',
                  brandAccent: '#b31528',
                }
              }
            },
            style: {
              button: {
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              },
              container: {
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              },
            }
          }}
          providers={['google']}
        />
      </div>
    </div>
  );
};

export default Auth;