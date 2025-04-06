
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { LikeProvider } from "@/components/products/LikeContext";
import { ErrorView } from "@/components/ErrorView";

// Redirect to marketplace on index page with fallback
export default function Index() {
  useEffect(() => {
    // Log redirect for debugging purposes
    console.log("Redirecting to marketplace from index page");
  }, []);
  
  try {
    return (
      <LikeProvider>
        <Navigate to="/marketplace" replace />
      </LikeProvider>
    );
  } catch (error) {
    console.error("Error during redirect:", error);
    return (
      <ErrorView 
        title="Navigation Error" 
        message="Unable to redirect to the marketplace. Please try again or navigate manually."
      />
    );
  }
}
