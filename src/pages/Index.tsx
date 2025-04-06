
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LikeProvider } from "@/components/products/LikeContext";

// Redirect to marketplace on index page
export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/marketplace', { replace: true });
  }, [navigate]);
  
  // We wrap with LikeProvider even though we're redirecting,
  // in case any components briefly render that need the context
  return (
    <LikeProvider>
      {null}
    </LikeProvider>
  );
}
