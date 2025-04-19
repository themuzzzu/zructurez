
import React from "react";
import { Layout } from "@/components/layout/Layout";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export const ShopLayout = ({ children }: ShopLayoutProps) => {
  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Shop</h1>
          <div className="relative">
            <input
              type="search"
              placeholder="Search for products, brands and categories..."
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        {children}
      </div>
    </Layout>
  );
};
