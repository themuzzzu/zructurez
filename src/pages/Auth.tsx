import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
        toast.success("Successfully signed in!");
      }
      if (event === "SIGNED_OUT") {
        navigate("/auth");
        toast.info("Signed out successfully");
      }
      // Handle authentication errors
      if (!session) {
        switch (event) {
          case "SIGNED_OUT":
            toast.info("You have been signed out");
            break;
          case "USER_UPDATED":
            toast.success("Your profile has been updated");
            break;
          case "PASSWORD_RECOVERY":
            toast.info("Password recovery email sent");
            break;
        }
      }
    });

    // Handle specific auth errors
    const handleAuthError = (error: any) => {
      if (error?.message?.includes("user_already_exists")) {
        toast.error("This email is already registered. Please sign in instead.");
      }
    };

    // Subscribe to auth errors
    const { data: { subscription: errorSubscription } } = supabase.auth.onError(handleAuthError);

    return () => {
      subscription.unsubscribe();
      errorSubscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-up">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">Welcome to Zructures</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>
        <div className="bg-card p-8 rounded-lg shadow-lg border animate-scale-in">
          <SupabaseAuth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
              className: {
                button: 'hover:opacity-90 transition-opacity',
                container: 'space-y-4',
                label: 'text-foreground font-medium',
                input: 'bg-background',
              },
            }}
            providers={["google"]}
            redirectTo={`${window.location.origin}/auth/callback`}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;