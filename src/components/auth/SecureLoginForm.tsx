
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { rateLimit } from "@/utils/rateLimiting";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const SecureLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Get browser fingerprint for security tracking
  const getBrowserFingerprint = () => {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    // Create a simple fingerprint hash
    return btoa(`${userAgent}|${screenWidth}|${screenHeight}|${colorDepth}|${timeZone}|${language}`);
  };

  // Handle login submission
  const onSubmit = async (values: LoginFormValues) => {
    try {
      // Apply rate limiting to prevent brute force attacks
      const clientIp = "client"; // In production, this would be the client's IP
      const rateLimited = rateLimit(`login-attempt:${clientIp}`, {
        windowMs: 60000 * 15, // 15 minutes
        maxRequests: 5, // 5 login attempts per 15 minutes
        message: "Too many login attempts, please try again later",
      });

      if (!rateLimited) {
        return;
      }

      // Track login attempts
      setLoginAttempts(prev => prev + 1);
      
      // If too many attempts, require captcha (simulated here)
      if (loginAttempts >= 3) {
        toast.error("Too many login attempts. Please verify you are human.");
        // In a real implementation, you would show a CAPTCHA here
        return;
      }

      setIsLoading(true);

      // Get browser fingerprint
      const fingerprint = getBrowserFingerprint();

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        handleAuthError(error);
        return;
      }

      // On successful login
      if (data.session) {
        // Log successful login with fingerprint for security monitoring
        await supabase.from('security_events').insert({
          user_id: data.user.id,
          event_type: 'login',
          browser_fingerprint: fingerprint,
          ip_address: 'client-ip', // In production, this would be the client's IP
          is_suspicious: false,
        });

        toast.success("Login successful!");
        navigate('/');
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast.error("An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    
    // Log failed login attempt
    supabase.from('security_events').insert({
      event_type: 'failed_login',
      browser_fingerprint: getBrowserFingerprint(),
      ip_address: 'client-ip', // In production, this would be the client's IP
      is_suspicious: loginAttempts >= 2, // Mark as suspicious after multiple attempts
      details: {
        error: error.message,
        email: form.getValues().email,
      },
    }).then();

    // Provide user-friendly error messages
    if (error.message.includes("Invalid login credentials")) {
      toast.error("Invalid email or password");
    } else if (error.message.includes("Email not confirmed")) {
      toast.error("Please verify your email before logging in");
    } else if (error.message.includes("rate limit")) {
      toast.error("Too many login attempts, please try again later");
    } else {
      toast.error(`Login error: ${error.message}`);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Secure Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginAttempts >= 2 && (
              <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Multiple login attempts detected
                  </span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          Don't have an account?{" "}
          <a href="/auth?signup" className="text-primary hover:underline">
            Sign up
          </a>
        </div>
        <div className="text-sm text-muted-foreground text-center">
          <a href="/auth/reset-password" className="text-primary hover:underline">
            Forgot your password?
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};
