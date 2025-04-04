
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface SecurityContextType {
  isSecurityEnabled: boolean;
  csrfToken: string | null;
  deviceFingerprint: string | null;
}

const SecurityContext = createContext<SecurityContextType>({
  isSecurityEnabled: false,
  csrfToken: null,
  deviceFingerprint: null,
});

export const useSecurityContext = () => useContext(SecurityContext);

interface SecurityProviderProps {
  children: ReactNode;
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(null);
  const [isSecurityEnabled, setIsSecurityEnabled] = useState(true);

  useEffect(() => {
    // Generate or retrieve CSRF token
    const storedToken = sessionStorage.getItem('csrf-token');
    if (storedToken) {
      setCsrfToken(storedToken);
    } else {
      const newToken = generateRandomToken();
      sessionStorage.setItem('csrf-token', newToken);
      setCsrfToken(newToken);
    }

    // Generate a simple device fingerprint based on available browser information
    const fingerprint = generateDeviceFingerprint();
    setDeviceFingerprint(fingerprint);
    
    // Check for potential security issues
    checkSecurityIssues();
  }, []);

  const generateRandomToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const generateDeviceFingerprint = (): string => {
    const userAgent = navigator.userAgent;
    const screenInfo = `${screen.width}x${screen.height}x${screen.colorDepth}`;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    // Simple hash function for fingerprinting
    let hash = 0;
    const str = userAgent + screenInfo + timeZone + language;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(16);
  };

  const checkSecurityIssues = () => {
    // Check if running in an iframe to prevent clickjacking
    if (window.self !== window.top) {
      console.error('Potential clickjacking attempt detected');
      // Only show the warning, but don't block for better UX
      toast.warning('This app may not function properly in an iframe for security reasons.');
    }
    
    // Check for localStorage/sessionStorage availability
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
    } catch (e) {
      console.error('Storage not available:', e);
      toast.error('Browser storage is disabled. Some features may not work properly.');
    }
  };

  const contextValue: SecurityContextType = {
    isSecurityEnabled,
    csrfToken,
    deviceFingerprint,
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
}
