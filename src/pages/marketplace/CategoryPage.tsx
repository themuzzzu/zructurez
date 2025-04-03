
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BannerCarousel } from '@/components/marketplace/BannerCarousel';
import { CategorySubcategoryGrid } from '@/components/marketplace/CategorySubcategoryGrid';
import { ShoppingSection } from '@/components/ShoppingSection';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { supabase } from '@/integrations/supabase/client';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Format category name for display
  const formattedCategoryName = categoryId ? 
    categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    'Category';

  // Sample subcategories data to use if database fetch fails
  const getDefaultSubcategories = () => {
    if (categoryId === 'electronics') {
      return [
        { name: 'Mobile Phones', slug: 'mobile-phones' },
        { name: 'Laptops & Computers', slug: 'laptops-computers' },
        { name: 'Audio', slug: 'audio' },
        { name: 'Cameras', slug: 'cameras' },
        { name: 'Wearables', slug: 'wearables' },
        { name: 'Accessories', slug: 'accessories' }
      ];
    } else if (categoryId === 'fashion') {
      return [
        { name: "Men's Clothing", slug: 'mens-clothing' },
        { name: "Women's Clothing", slug: 'womens-clothing' },
        { name: 'Footwear', slug: 'footwear' },
        { name: 'Watches & Eyewear', slug: 'watches-eyewear' },
        { name: 'Jewelry', slug: 'jewelry' }
      ];
    } else {
      return [
        { name: 'Popular Items', slug: 'popular-items' },
        { name: 'New Arrivals', slug: 'new-arrivals' },
        { name: 'Best Sellers', slug: 'best-sellers' }
      ];
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      try {
        // Try to fetch from database first
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categoryId)
          .single();
          
        if (error) {
          console.error('Error fetching category data:', error);
          // If table doesn't exist or other error, use default data
          setCategoryData({ 
            name: formattedCategoryName,
            subcategories: getDefaultSubcategories()
          });
        } else {
          setCategoryData(data || { 
            name: formattedCategoryName,
            subcategories: getDefaultSubcategories()
          });
        }
      } catch (err) {
        console.error('Error in category data fetch:', err);
        setError('Failed to load category data');
        // Still provide fallback data
        setCategoryData({ 
          name: formattedCategoryName,
          subcategories: getDefaultSubcategories()
        });
      } finally {
        // Add a small delay to prevent flashing on fast connections
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    };
    
    fetchCategoryData();
  }, [categoryId, formattedCategoryName]);
  
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
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-[1400px] mx-auto px-4 py-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-12 w-48 mb-2" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-md" />
            ))}
          </div>
          <Skeleton className="h-12 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-md" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <motion.div 
        initial="hidden" 
        animate="show" 
        variants={containerAnimation}
        className="container max-w-[1400px] mx-auto px-4 py-6"
      >
        {/* Breadcrumb navigation */}
        <motion.div variants={itemAnimation}>
          <Breadcrumb className="mb-4">
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-1" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/marketplace')}>
                Marketplace
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink isCurrentPage>
                {formattedCategoryName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {subcategoryId && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink isCurrentPage>
                    {subcategoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </Breadcrumb>
        </motion.div>
        
        <motion.h1 variants={itemAnimation} className="text-3xl font-bold mb-6">{formattedCategoryName}</motion.h1>
        
        {/* Banner ad for this category */}
        <motion.div variants={itemAnimation} className="mb-6">
          <BannerCarousel />
        </motion.div>
        
        {/* Subcategories */}
        <motion.div variants={itemAnimation} className="mb-8">
          <h2 className="text-xl font-bold mb-4">Browse {formattedCategoryName}</h2>
          <CategorySubcategoryGrid onCategorySelect={(category, subcategory) => {
            navigate(`/marketplace/category/${category}${subcategory ? `/${subcategory}` : ''}`);
          }} />
        </motion.div>
        
        {/* Sponsored Products for this category */}
        <motion.div variants={itemAnimation} className="mb-8">
          <SponsoredProducts />
        </motion.div>
        
        {/* Category Products */}
        <motion.div variants={itemAnimation} className="mb-8">
          <ShoppingSection 
            selectedCategory={categoryId}
            searchQuery=""
            title={`${formattedCategoryName} Products`}
          />
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default CategoryPage;
