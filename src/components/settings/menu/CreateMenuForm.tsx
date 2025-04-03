
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MenuType } from "@/types/menu";
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { StepSix } from "./steps/StepSix";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Save, Eye } from "lucide-react";

const STEPS = [
  "Choose Type",
  "Business Info",
  "Categories",
  "Subcategories",
  "Items",
  "Preview"
];

export const CreateMenuForm = ({ businessId }: { businessId: string }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [savingDraft, setSavingDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    displayType: 'menu' as MenuType,
    businessName: '',
    businessLocation: '',
    selectedCategory: '',
    customCategory: '',
    categories: [] as {id: string, name: string, is_custom: boolean}[],
    subcategories: [] as {id: string, categoryId: string, name: string}[],
    items: [] as {
      id: string,
      name: string,
      description: string,
      price: string,
      priceUnit: string,
      imageFile: File | null,
      imageUrl: string,
      availability: 'in_stock' | 'out_of_stock',
      subcategoryId: string
    }[]
  });

  // Fetch business data
  const { data: business, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ['business-details', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('name, location')
        .eq('id', businessId)
        .single();
        
      if (error) throw error;
      return data;
    },
  });

  // Fetch existing menu draft if available
  const { data: existingMenu, isLoading: isLoadingExistingMenu } = useQuery({
    queryKey: ['business-menu-draft', businessId],
    queryFn: async () => {
      // Check if there's a draft menu
      const { data, error } = await supabase
        .from('business_menus')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_draft', true)
        .maybeSingle();
        
      if (error) throw error;
      
      if (!data) return null;
      
      // If there's a draft, fetch all related data
      const menuId = data.id;
      
      // Get categories
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('business_id', businessId);
        
      if (categoriesError) throw categoriesError;
      
      // Get subcategories
      const { data: subcategories, error: subcategoriesError } = await supabase
        .from('menu_subcategories')
        .select('*')
        .eq('business_id', businessId);
        
      if (subcategoriesError) throw subcategoriesError;
      
      // Get items
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('business_id', businessId);
        
      if (itemsError) throw itemsError;
      
      return {
        menu: data,
        categories,
        subcategories,
        items
      };
    },
  });

  // Populate form data with business information when available
  useEffect(() => {
    if (business) {
      setFormData(prev => ({
        ...prev,
        businessName: business.name || '',
        businessLocation: business.location || ''
      }));
    }
  }, [business]);

  // Populate form data with existing draft if available
  useEffect(() => {
    if (existingMenu) {
      setFormData(prev => {
        const formattedItems = existingMenu.items.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price?.toString() || '',
          priceUnit: item.price_unit || '₹',
          imageFile: null,
          imageUrl: item.image_url || '',
          availability: (item.availability as 'in_stock' | 'out_of_stock') || 'in_stock',
          subcategoryId: item.subcategory_id
        }));

        const formattedSubcategories = existingMenu.subcategories.map(subcat => ({
          id: subcat.id,
          categoryId: subcat.category_id,
          name: subcat.name
        }));

        const formattedCategories = existingMenu.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          is_custom: cat.is_custom || false
        }));

        return {
          ...prev,
          displayType: (existingMenu.menu.display_type as MenuType) || 'menu',
          categories: formattedCategories,
          subcategories: formattedSubcategories,
          items: formattedItems
        };
      });

      toast.info("Loaded your saved draft");
    }
  }, [existingMenu]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const saveDraft = async () => {
    try {
      setSavingDraft(true);
      
      // First, handle any image uploads
      for (let i = 0; i < formData.items.length; i++) {
        const item = formData.items[i];
        if (item.imageFile) {
          const fileName = `${Date.now()}-${i}-${item.imageFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('business-images')
            .upload(fileName, item.imageFile);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('business-images')
            .getPublicUrl(fileName);
            
          formData.items[i].imageUrl = publicUrl;
        }
      }
      
      // Create or update the menu record
      const { data: menuData, error: menuError } = await supabase
        .from('business_menus')
        .upsert({
          business_id: businessId,
          display_type: formData.displayType,
          is_draft: true,
          is_published: false,
          updated_at: new Date().toISOString()
        }, { onConflict: 'business_id' })
        .select('id')
        .single();
        
      if (menuError) throw menuError;
      
      // Handle categories
      const categoriesToUpsert = formData.categories.map(cat => ({
        id: cat.id || undefined,
        name: cat.name,
        business_id: businessId,
        is_custom: cat.is_custom || false
      }));
      
      if (categoriesToUpsert.length > 0) {
        const { error: categoriesError } = await supabase
          .from('menu_categories')
          .upsert(categoriesToUpsert);
          
        if (categoriesError) throw categoriesError;
      }
      
      // Handle subcategories
      const subcategoriesToUpsert = formData.subcategories.map(subcat => ({
        id: subcat.id || undefined,
        name: subcat.name,
        category_id: subcat.categoryId,
        business_id: businessId
      }));
      
      if (subcategoriesToUpsert.length > 0) {
        const { error: subcategoriesError } = await supabase
          .from('menu_subcategories')
          .upsert(subcategoriesToUpsert);
          
        if (subcategoriesError) throw subcategoriesError;
      }
      
      // Handle items
      const itemsToUpsert = formData.items.map(item => ({
        id: item.id || undefined,
        name: item.name,
        description: item.description,
        price: item.price ? parseFloat(item.price) : null,
        price_unit: item.priceUnit,
        image_url: item.imageUrl,
        availability: item.availability,
        subcategory_id: item.subcategoryId,
        business_id: businessId
      }));
      
      if (itemsToUpsert.length > 0) {
        const { error: itemsError } = await supabase
          .from('menu_items')
          .upsert(itemsToUpsert);
          
        if (itemsError) throw itemsError;
      }
      
      toast.success("Draft saved successfully!");
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setSavingDraft(false);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Save everything as a draft first
      await saveDraft();
      
      // Then update the menu status to published
      const { error: publishError } = await supabase
        .from('business_menus')
        .update({
          is_draft: false,
          is_published: true,
          updated_at: new Date().toISOString()
        })
        .eq('business_id', businessId);
        
      if (publishError) throw publishError;
      
      toast.success(`${formData.displayType === 'menu' ? 'Menu' : 'List'} published successfully!`);
      navigate(`/business/${businessId}`);
    } catch (error) {
      console.error('Error publishing:', error);
      toast.error(`Failed to publish ${formData.displayType === 'menu' ? 'menu' : 'list'}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne 
          displayType={formData.displayType} 
          updateFormData={updateFormData} 
        />;
      case 1:
        return <StepTwo 
          businessName={formData.businessName}
          businessLocation={formData.businessLocation}
          updateFormData={updateFormData}
          isLoading={isLoadingBusiness}
        />;
      case 2:
        return <StepThree 
          selectedCategory={formData.selectedCategory}
          customCategory={formData.customCategory}
          categories={formData.categories}
          updateFormData={updateFormData}
        />;
      case 3:
        return <StepFour 
          categories={formData.categories}
          subcategories={formData.subcategories}
          updateFormData={updateFormData}
        />;
      case 4:
        return <StepFive 
          items={formData.items}
          subcategories={formData.subcategories}
          categories={formData.categories}
          updateFormData={updateFormData}
          displayType={formData.displayType}
        />;
      case 5:
        return <StepSix 
          formData={formData}
        />;
      default:
        return null;
    }
  };

  const isLoading = isLoadingBusiness || isLoadingExistingMenu;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create {formData.displayType === 'menu' ? 'Menu' : 'List'}</CardTitle>
        <CardDescription>
          Add a {formData.displayType === 'menu' ? 'menu' : 'list'} to your business page
        </CardDescription>
        
        <Tabs value={STEPS[currentStep]} className="w-full mt-4">
          <TabsList className="grid grid-cols-6 w-full">
            {STEPS.map((step, index) => (
              <TabsTrigger 
                key={index}
                value={step}
                className={currentStep === index ? "data-[state=active]:bg-primary" : ""}
                onClick={() => setCurrentStep(index)}
              >
                {index + 1}. {step}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-6">
        {renderStep()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-6">
        <div>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={saveDraft}
            disabled={savingDraft}
          >
            <Save className="mr-2 h-4 w-4" />
            {savingDraft ? "Saving..." : "Save Draft"}
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              <Eye className="mr-2 h-4 w-4" />
              {submitting ? "Publishing..." : "Publish"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
