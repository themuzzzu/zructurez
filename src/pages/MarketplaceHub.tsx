
import React from 'react';

const MarketplaceHub = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Marketplace Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-semibold">Welcome to the Marketplace</h2>
          <p className="mt-2 text-gray-600">
            Browse through products and services offered by local businesses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHub;
