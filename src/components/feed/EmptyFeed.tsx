
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const EmptyFeed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-8 space-y-4">
      <h3 className="text-xl font-semibold">No Posts Yet</h3>
      <p className="text-muted-foreground">
        Your feed is empty. Follow businesses and people to see their updates here.
      </p>
      <div className="flex justify-center gap-3 mt-4">
        <Button onClick={() => navigate('/businesses')}>
          Discover Businesses
        </Button>
        <Button variant="outline" onClick={() => navigate('/communities')}>
          Join Communities
        </Button>
      </div>
    </div>
  );
};
