
import { MarketplaceLayout } from '@/components/marketplace/MarketplaceLayout';
import { MarketplaceProvider } from '@/providers/MarketplaceProvider';

const OptimizedMarketplace = () => {
  return (
    <MarketplaceProvider>
      <MarketplaceLayout />
    </MarketplaceProvider>
  );
};

export default OptimizedMarketplace;
