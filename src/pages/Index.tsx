
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redirect to marketplace on index page
export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/marketplace', { replace: true });
  }, [navigate]);
  
  return null;
}
