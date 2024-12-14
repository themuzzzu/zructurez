import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { AuthChangeEvent } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }

      // Handle specific auth events
      switch (event) {
        case 'USER_DELETED':
          toast.error("Account deleted successfully");
          break;
        case 'SIGNED_OUT':
          toast.info("Signed out successfully");
          break;
        case 'SIGNED_IN':
          toast.success("Signed in successfully");
          break;
        case 'SIGNED_UP':
          toast.success("Account created successfully! Please verify your email.");
          break;
        case 'USER_UPDATED':
          toast.success("Account updated successfully");
          break;
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-muted-foreground">Sign in to your account or create a new one</p>
        </div>
        <div className="bg-card rounded-lg shadow-lg p-6">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  },
                },
              },
            }}
            providers={["google", "github"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;