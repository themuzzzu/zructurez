
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Set Content Security Policy
const setCSP = () => {
  // In a real app, this would be set by the server in HTTP headers
  // This is a fallback client-side approach for demo purposes
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = `
    default-src 'self';
    script-src 'self' https://kjmlxafygdzkrlopyyvk.supabase.co;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' https://kjmlxafygdzkrlopyyvk.supabase.co data: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://kjmlxafygdzkrlopyyvk.supabase.co;
    frame-src 'self';
    object-src 'none';
  `;
  document.head.appendChild(cspMeta);
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isSecurityChecked, setIsSecurityChecked] = useState(false);
  const navigate = useNavigate();

  // This is a simulated bot detection function
  // In production, use a proper solution like reCAPTCHA
  const detectBot = (): boolean => {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'googlebot', 'bingbot', 'yandexbot', 'ahrefsbot', 'msnbot', 'linkedinbot', 
      'exabot', 'compspybot', 'yesupbot', 'paperlibot', 'tweetmemebot', 'semrushbot',
      'scoutjet', 'seznambot', 'blexbot', 'pingdom', 'baiduspider', 'crawler'
    ];
    
    return botPatterns.some(pattern => userAgent.includes(pattern));
  };

  // Check for common security risks on component mount
  useEffect(() => {
    // Set Content Security Policy
    setCSP();

    // Basic bot detection
    if (detectBot()) {
      console.warn('Bot activity detected');
      // In production, you would implement more sophisticated responses
    }

    // Check for potential clickjacking
    if (window.self !== window.top) {
      // The page is in an iframe
      console.error('Potential clickjacking attempt detected');
      // In production, you would break out of the frame or show a warning
    }

    // Check for localStorage/sessionStorage support
    let storageAvailable = false;
    try {
      window.localStorage.setItem('test', 'test');
      window.localStorage.removeItem('test');
      storageAvailable = true;
    } catch (e) {
      console.error('localStorage is not available, which might indicate privacy mode');
    }

    // Log security check results
    supabase.from('security_events').insert({
      event_type: 'security_check',
      browser_fingerprint: navigator.userAgent,
      ip_address: 'client-ip', // Would be set server-side in production
      details: {
        is_bot: detectBot(),
        in_iframe: window.self !== window.top,
        storage_available: storageAvailable,
        referrer: document.referrer,
        screen_dimensions: `${window.screen.width}x${window.screen.height}`,
      }
    }).then();

    setIsSecurityChecked(true);
  }, []);

  // Session hijacking detection
  useEffect(() => {
    const sessionCheckInterval = setInterval(async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // In a real app, you would implement more sophisticated session validation
        // This is a simplified example
        const storedSessionFp = localStorage.getItem(`session_fp_${session.user.id}`);
        const currentFp = `${navigator.userAgent}|${navigator.language}`;

        if (storedSessionFp && storedSessionFp !== currentFp) {
          console.error('Possible session hijacking detected - session fingerprint mismatch');
          
          // Log security event
          await supabase.from('security_events').insert({
            user_id: session.user.id,
            event_type: 'possible_session_hijacking',
            browser_fingerprint: navigator.userAgent,
            details: {
              stored_fingerprint: storedSessionFp,
              current_fingerprint: currentFp,
            }
          });
          
          // Force logout for security
          await supabase.auth.signOut();
          toast.error('Session expired for security reasons. Please login again.');
          navigate('/auth');
        } else if (!storedSessionFp) {
          // Store the session fingerprint if not already stored
          localStorage.setItem(`session_fp_${session.user.id}`, currentFp);
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(sessionCheckInterval);
  }, [navigate]);

  if (!isSecurityChecked) {
    // Show nothing while performing initial security checks
    return null;
  }

  return <>{children}</>;
};
