import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session check error:', sessionError);
          if (sessionError.message.includes('email_not_confirmed')) {
            toast.error('Please check your email and confirm your account before signing in.');
          } else if (sessionError.message.includes('invalid_credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            toast.error('Error checking authentication status');
          }
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully signed in!');
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        toast.error('You have been signed out');
      } else if (event === 'USER_UPDATED') {
        toast.success('Your profile has been updated');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Please check your email for password reset instructions');
      }
    });

    // Handle auth errors through the error listener
    const { data: { subscription: errorSubscription } } = supabase.auth.onError((error) => {
      console.error('Auth error:', error);
      const errorMessage = error.message;
      if (errorMessage.includes('email_not_confirmed') || errorMessage.includes('Email not confirmed')) {
        toast.error('Please check your email to confirm your account before signing in');
      } else {
        toast.error(errorMessage || 'An authentication error occurred');
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
      errorSubscription.unsubscribe();
    };
  }, [navigate]);

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
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;