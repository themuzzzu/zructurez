import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MarketplaceIndex() {
  const navigate = useNavigate();
  
  // Redirect to the main marketplace page
  useEffect(() => {
    navigate('/marketplace', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      Redirecting to marketplace...
    </div>
  );
}
