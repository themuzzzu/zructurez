
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Define service categories and their subcategories
const serviceCategories = [
  {
    id: 'home',
    name: 'Home Services',
    subcategories: [
      { id: 'cleaning', name: 'Cleaning' },
      { id: 'plumbing', name: 'Plumbing' },
      { id: 'electrical', name: 'Electrical' },
      { id: 'painting', name: 'Painting' },
      { id: 'carpentry', name: 'Carpentry' },
      { id: 'gardening', name: 'Gardening' },
      { id: 'renovation', name: 'Renovation' },
      { id: 'furniture', name: 'Furniture Assembly' }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Wellness',
    subcategories: [
      { id: 'haircut', name: 'Haircut & Styling' },
      { id: 'makeup', name: 'Makeup' },
      { id: 'nails', name: 'Nails' },
      { id: 'spa', name: 'Spa & Massage' },
      { id: 'skincare', name: 'Skincare' },
      { id: 'waxing', name: 'Waxing' },
      { id: 'threading', name: 'Threading' },
      { id: 'facials', name: 'Facials' }
    ]
  },
  {
    id: 'professional',
    name: 'Professional Services',
    subcategories: [
      { id: 'legal', name: 'Legal Services' },
      { id: 'accounting', name: 'Accounting' },
      { id: 'consulting', name: 'Consulting' },
      { id: 'marketing', name: 'Marketing' },
      { id: 'design', name: 'Design' },
      { id: 'photography', name: 'Photography' },
      { id: 'videography', name: 'Videography' },
      { id: 'writing', name: 'Writing & Editing' }
    ]
  },
  {
    id: 'tech',
    name: 'Technology',
    subcategories: [
      { id: 'repairs', name: 'Device Repair' },
      { id: 'setup', name: 'Setup & Installation' },
      { id: 'development', name: 'App Development' },
      { id: 'webdesign', name: 'Web Design' },
      { id: 'security', name: 'Cybersecurity' },
      { id: 'support', name: 'Tech Support' },
      { id: 'training', name: 'IT Training' },
      { id: 'cloud', name: 'Cloud Services' }
    ]
  }
];

interface ServiceCategorySubcategoryGridProps {
  onCategorySelect: (category: string, subcategory?: string) => void;
}

export function ServiceCategorySubcategoryGrid({ onCategorySelect }: ServiceCategorySubcategoryGridProps) {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-4">
        {serviceCategories.map((category) => (
          <TabsTrigger 
            key={category.id} 
            value={category.id}
            onClick={() => onCategorySelect(category.id)}
          >
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {serviceCategories.map((category) => (
        <TabsContent key={category.id} value={category.id} className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {category.subcategories.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant="outline"
                className="justify-start h-auto py-2 px-3"
                onClick={() => onCategorySelect(category.id, subcategory.id)}
              >
                {subcategory.name}
              </Button>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
