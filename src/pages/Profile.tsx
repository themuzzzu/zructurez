
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <strong>Email:</strong> {user.email}
        </div>
        {profile && (
          <div>
            {profile.username && (
              <div>
                <strong>Username:</strong> {profile.username}
              </div>
            )}
          </div>
        )}
        <Button onClick={signOut} variant="destructive" className="mt-4">
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
