
import React from "react";
import { AdDashboard } from "@/components/ads/AdDashboard";
import { useAuth } from "@/hooks/useAuth";

export const AdvertisementsTab = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Please log in to manage your advertisements.</p>
      </div>
    );
  }

  return <AdDashboard userId={user.id} />;
};
