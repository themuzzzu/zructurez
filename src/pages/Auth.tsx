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
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Zructures</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-lg">
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
                },
                input: {
                  borderRadius: '6px',
                },
                anchor: {
                  color: '#e31837',
                },
              }
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/auth/callback`}
            onlyThirdPartyProviders
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;