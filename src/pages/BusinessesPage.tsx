
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { LocalBusinessSpotlight } from '@/components/marketplace/LocalBusinessSpotlight';
import { SponsoredBusinesses } from '@/components/business/SponsoredBusinesses';
import { RecommendedBusinesses } from '@/components/business/RecommendedBusinesses';
import { SuggestedBusinesses } from '@/components/business/SuggestedBusinesses';
import { BusinessCategoryNavBar } from '@/components/business/BusinessCategoryNavBar';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import { LoadingView } from '@/components/LoadingView';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Plus } from 'lucide-react';

export default function BusinessesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleCreateBusiness = () => {
    navigate('/create-business');
  };

  return (
    <Layout>
      <ErrorBoundary fallback={
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-3xl font-bold mb-6">Businesses</h1>
          <p className="text-red-500 mb-4">There was an error loading the businesses page.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      }>
        <Suspense fallback={<LoadingView />}>
          <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Local Businesses</h1>
              <Button onClick={handleCreateBusiness} className="mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                List Your Business
              </Button>
            </div>

            {/* Business Categories */}
            <div className="mb-8">
              <BusinessCategoryNavBar 
                selectedCategory={selectedCategory} 
                onCategorySelect={handleCategorySelect} 
              />
            </div>

            {/* Sponsored Businesses - NEW */}
            <div className="mb-8">
              <SponsoredBusinesses />
            </div>

            {/* Recommended Businesses - NEW */}
            <div className="mb-8">
              <RecommendedBusinesses />
            </div>

            {/* Suggested Businesses - NEW */}
            <div className="mb-8">
              <SuggestedBusinesses />
            </div>

            {/* Featured Local Businesses */}
            <div className="mb-8">
              <LocalBusinessSpotlight 
                title="Featured Local Businesses"
                subtitle="Popular establishments in your area"
              />
            </div>

            {/* Category-based Businesses */}
            {selectedCategory !== 'all' && (
              <div className="mb-8">
                <LocalBusinessSpotlight 
                  businessType={selectedCategory}
                  title={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Businesses`}
                  subtitle={`Local ${selectedCategory} establishments in your area`}
                />
              </div>
            )}
          </div>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
