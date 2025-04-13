
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Utility component to handle redirects for legacy URL patterns
 * This helps ensure that users who might have bookmarked old URL patterns
 * still reach the correct page.
 */
export const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Map of old paths to new paths
    const redirectMap: Record<string, string> = {
      '/business': '/businesses',
    };
    
    // Check if we need to redirect a base path
    const currentPath = location.pathname;
    
    // Check for specific path match
    if (redirectMap[currentPath]) {
      navigate(redirectMap[currentPath] + location.search, { replace: true });
      return;
    }
    
    // Handle pattern-based redirects
    if (currentPath.startsWith('/business/') && !currentPath.startsWith('/businesses/')) {
      // Change /business/:id to /businesses/:id
      const newPath = currentPath.replace('/business/', '/businesses/');
      navigate(newPath + location.search, { replace: true });
    }
  }, [location, navigate]);
  
  // This component doesn't render anything, it just handles redirects
  return null;
};
