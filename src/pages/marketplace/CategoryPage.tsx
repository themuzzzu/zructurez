
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { BannerCarousel } from '@/components/marketplace/BannerCarousel';
import { CategorySubcategoryGrid } from '@/components/marketplace/CategorySubcategoryGrid';
import { ShoppingSection } from '@/components/ShoppingSection';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { SponsoredProducts } from '@/components/marketplace/SponsoredProducts';
import { supabase } from '@/integrations/supabase/client';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Format category name for display
  const formattedCategoryName = categoryId ? 
    categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    'Category';

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) return;
      
      setIsLoading(true);
      try {
        // Fetch category data, subcategories, etc.
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', categoryId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        setCategoryData(data || { name: formattedCategoryName });
      } catch (err) {
        console.error('Error fetching category data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [categoryId, formattedCategoryName]);
  
  return (
    <Layout>
      <div className="container max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb navigation */}
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
        </Breadcrumb>
        
        <h1 className="text-3xl font-bold mb-6">{formattedCategoryName}</h1>
        
        {/* Banner ad for this category */}
        <div className="mb-6">
          <BannerCarousel />
        </div>
        
        {/* Subcategories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Browse {formattedCategoryName}</h2>
          <CategorySubcategoryGrid onCategorySelect={(category, subcategory) => {
            navigate(`/marketplace/category/${category}${subcategory ? `/${subcategory}` : ''}`);
          }} />
        </div>
        
        {/* Sponsored Products for this category */}
        <div className="mb-8">
          <SponsoredProducts />
        </div>
        
        {/* Category Products */}
        <div className="mb-8">
          <ShoppingSection 
            selectedCategory={categoryId}
            title={`${formattedCategoryName} Products`}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
