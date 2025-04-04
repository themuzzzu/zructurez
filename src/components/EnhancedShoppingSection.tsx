
import React, { useState } from 'react';
import { ShoppingSection } from './ShoppingSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridLayoutType } from './products/types/ProductTypes';
import { useNavigate } from 'react-router-dom';
import { SponsoredProducts } from './marketplace/SponsoredProducts';
import { RecommendedProducts } from './marketplace/RecommendedProducts';
import { TrendingProducts } from './marketplace/TrendingProducts';
import { motion } from 'framer-motion';

interface EnhancedShoppingSectionProps {
  searchQuery: string;
  showFilters?: boolean;
  selectedCategory?: string;
  showDiscounted?: boolean;
  showUsed?: boolean;
  showBranded?: boolean;
  sortOption?: string;
  priceRange?: string;
  gridLayout?: GridLayoutType;
}

export const EnhancedShoppingSection = ({
  searchQuery,
  showFilters = false,
  selectedCategory = '',
  showDiscounted = false,
  showUsed = false,
  showBranded = false,
  sortOption = 'newest',
  priceRange = 'all',
  gridLayout = 'grid4x4'
}: EnhancedShoppingSectionProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    if (value === "services") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=services`);
      return;
    }
    setActiveTab(value);
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <Tabs defaultValue="products" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerAnimation}
            className="space-y-8"
          >
            <motion.div variants={itemAnimation}>
              <SponsoredProducts gridLayout={gridLayout} />
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <TrendingProducts gridLayout={gridLayout} />
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <RecommendedProducts gridLayout={gridLayout} />
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <ShoppingSection
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                showDiscounted={showDiscounted}
                showUsed={showUsed}
                showBranded={showBranded}
                sortOption={sortOption}
                priceRange={priceRange}
                gridLayout={gridLayout}
              />
            </motion.div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="services">
          <div className="text-center p-8">
            <p className="text-muted-foreground">Service search results will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
