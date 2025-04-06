
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdPlacement as AdPlacementType } from '@/services/adService';

export default function AdPlacementPage() {
  const [placements, setPlacements] = useState<AdPlacementType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Mock data for ad placements
    const mockPlacements: AdPlacementType[] = [
      { 
        id: '1', 
        name: 'Homepage Banner', 
        location: 'homepage', 
        type: 'banner',
        size: '1200x400',
        cpc_rate: 2.5,
        cpm_rate: 10,
        description: 'Top banner on homepage',
        active: true,
        max_size_kb: 500,
        priority: 10
      },
      { 
        id: '2', 
        name: 'Services Sidebar', 
        location: 'services', 
        type: 'sidebar',
        size: '300x600',
        cpc_rate: 1.75,
        cpm_rate: 8,
        description: 'Sidebar on services page',
        active: true,
        max_size_kb: 300,
        priority: 5
      },
      { 
        id: '3', 
        name: 'Products Grid', 
        location: 'products', 
        type: 'grid',
        size: '400x300',
        cpc_rate: 1.5,
        cpm_rate: 7,
        description: 'Grid placement on products page',
        active: true,
        max_size_kb: 250,
        priority: 3
      }
    ];
    
    setPlacements(mockPlacements);
    setIsLoading(false);
  }, []);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Ad Placement Management</h1>
      
      <div className="flex justify-end mb-4">
        <Button>Add New Placement</Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading placements...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placements.map((placement) => (
            <Card key={placement.id}>
              <CardHeader>
                <CardTitle>{placement.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{placement.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{placement.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span>{placement.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPC Rate:</span>
                    <span>${placement.cpc_rate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPM Rate:</span>
                    <span>${placement.cpm_rate.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
