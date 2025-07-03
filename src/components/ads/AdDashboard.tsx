import React from "react";

export interface AdDashboardProps {
  userId: string;
}

export const AdDashboard = ({ userId }: AdDashboardProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Advertisement Dashboard</h2>
      <p className="text-gray-600">
        Manage your advertisements and campaigns here.
      </p>
      {/* Dashboard content will be implemented */}
    </div>
  );
};
