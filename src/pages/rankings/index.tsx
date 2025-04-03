
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductRankings } from "./ProductRankings";
import { ServiceRankings } from "./ServiceRankings";
import { BusinessRankings } from "./BusinessRankings";
import { TrendingUp, ShoppingBag, Building2 } from "lucide-react";

const Rankings = () => {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <Layout>
      <div className="container max-w-[1400px] py-8">
        <h1 className="text-3xl font-bold mb-6">Rankings</h1>
        
        <Tabs 
          defaultValue="products" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M14 3.5v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2z" />
                <path d="M20 10.5v2a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2z" />
                <path d="M14 17.5v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2z" />
              </svg>
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Businesses</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <ProductRankings />
          </TabsContent>
          
          <TabsContent value="services">
            <ServiceRankings />
          </TabsContent>
          
          <TabsContent value="businesses">
            <BusinessRankings />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Rankings;
