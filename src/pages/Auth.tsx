
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session check error:', sessionError);
          handleAuthError(sessionError);
        } else if (session) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    const handleAuthEvent = (event: AuthChangeEvent, session: Session | null) => {
      setAuthLoading(false);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast.info('You have been signed out');
      } else if (event === 'USER_UPDATED') {
        toast.success('Your profile has been updated');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Please check your email for password reset instructions');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthEvent);

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthError = (error: any) => {
    if (!error || !error.message) {
      toast.error('An unknown error occurred');
      return;
    }

    const message = error.message.toLowerCase();
    
    // Handle specific error types with precise messaging
    if (message.includes('invalid_credentials') || message.includes('invalid login credentials')) {
      toast.error('Incorrect email or password');
    } else if (message.includes('email_not_confirmed')) {
      toast.error('Please verify your email before signing in');
    } else if (message.includes('rate_limited')) {
      toast.error('Too many attempts. Please try again later');
    } else if (message.includes('user_banned') || message.includes('banned')) {
      toast.error('This account has been suspended. Please contact support');
    } else if (message.includes('token_expired') || message.includes('jwt expired')) {
      toast.error('Your session has expired. Please sign in again');
    } else if (message.includes('user_not_found')) {
      toast.error('No account found with this email');
    } else if (message.includes('already_registered')) {
      toast.error('An account with this email already exists');
    } else if (message.includes('weak_password')) {
      toast.error('Please use a stronger password');
    } else {
      toast.error(`Authentication error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                    inputText: 'white',
                    inputPlaceholder: 'rgba(255, 255, 255, 0.6)',
                    inputBackground: 'rgb(23, 23, 23)',
                    inputBorder: 'rgb(55, 55, 55)',
                  }
                }
              },
              style: {
                button: {
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  '&:disabled': {
                    backgroundColor: 'rgba(227, 24, 55, 0.5)',
                  }
                },
                container: {
                  borderRadius: '8px',
                },
                input: {
                  borderRadius: '6px',
                  color: 'white',
                },
                anchor: {
                  color: '#e31837',
                },
                label: {
                  color: 'white',
                }
              }
            }}
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Your password',
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign in',
                  loading_button_label: 'Signing in...',
                },
                sign_up: {
                  email_input_placeholder: 'Your email address',
                  password_input_placeholder: 'Create a password',
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign up',
                  loading_button_label: 'Signing up...',
                }
              }
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/auth/callback`}
            onlyThirdPartyProviders={false}
            beforeAuthentication={() => {
              setAuthLoading(true);
              return Promise.resolve();
            }}
            afterAuthentication={() => {
              // This gets called regardless of success/failure
              return Promise.resolve();
            }}
            afterVerification={() => {
              toast.success('Email verified successfully');
              return Promise.resolve();
            }}
            onAuthError={(error) => {
              setAuthLoading(false);
              handleAuthError(error);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
