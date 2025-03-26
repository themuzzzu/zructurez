
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { useEffect } from "react";

export const NotFound = () => {
  const navigate = useNavigate();

  // Log 404 errors for debugging
  useEffect(() => {
    console.error(`404 Not Found: ${window.location.pathname}`);
    
    // Report the 404 for monitoring
    const reportError = () => {
      try {
        // In a real app, you might send this to an error tracking service
        console.info("Reporting 404 error to monitoring service");
      } catch (err) {
        console.error("Failed to report 404 error:", err);
      }
    };
    
    reportError();
  }, []);

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-16">
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => navigate(-1)} variant="outline">
              Go Back
            </Button>
            <Button onClick={() => navigate("/")}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
