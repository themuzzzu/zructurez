
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/Spinner";
import { BusinessProfile } from "@/components/business-details/BusinessProfile";
import { NotFound } from "@/components/NotFound";
import { toast } from "sonner";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { BusinessAboutTab } from "@/components/business-details/tabs/BusinessAboutTab";
import { BusinessPostsTab } from "@/components/business-details/tabs/BusinessPostsTab";
import { BusinessProductsTab } from "@/components/business-details/tabs/BusinessProductsTab";
import { BusinessPortfolioTab } from "@/components/business-details/tabs/BusinessPortfolioTab";
import { BusinessMenuTab } from "@/components/business-details/tabs/BusinessMenuTab";
import { cn } from "@/lib/utils";
import { ArrowLeft, Edit } from "lucide-react";
import { BusinessStatus } from "@/components/business-details/header/BusinessStatus";
import { TemporaryStatus } from "@/components/business-details/header/TemporaryStatus";
import type { Business } from "@/types/business";

const BusinessDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about");
  const [isOwner, setIsOwner] = useState(false);
  const [hasMenu, setHasMenu] = useState(false);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      if (!id) {
        setError("Business ID is missing");
        setLoading(false);
        return;
      }

      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch business data
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select(`
            *,
            business_portfolio (*),
            business_products (*),
            posts (*)
          `)
          .eq("id", id)
          .single();

        if (businessError) throw businessError;
        if (!businessData) throw new Error("Business not found");

        // Convert to Business type
        const businessWithTypes = businessData as unknown as Business;
        
        setBusiness(businessWithTypes);
        
        // Check if current user is the owner
        if (user && businessData.user_id === user.id) {
          setIsOwner(true);
        }

        // Check if business has a menu
        const { data: menuData } = await supabase
          .from('business_menus')
          .select('id')
          .eq('business_id', id)
          .eq('is_published', true)
          .maybeSingle();

        setHasMenu(!!menuData);
      } catch (err) {
        console.error("Error fetching business details:", err);
        setError(err instanceof Error ? err.message : "Failed to load business details");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [id]);

  const handleEditBusiness = () => {
    navigate(`/business-edit/${id}`);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !business) {
    return <NotFound message={error || "Business not found"} />;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{business.name}</h1>
          {isOwner && (
            <Button onClick={handleEditBusiness} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Business
            </Button>
          )}
        </div>
      </div>
      
      {isOwner && (
        <div className="mb-6 p-4 bg-background rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">Business Status Controls</h2>
          <div className="flex flex-wrap gap-8">
            <BusinessStatus id={id || ""} initialIsOpen={business.is_open ?? true} />
            <TemporaryStatus id={id || ""} isOpen={business.is_open ?? true} />
          </div>
        </div>
      )}

      <Tabs
        defaultValue="about"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          {hasMenu && <TabsTrigger value="menu">Menu</TabsTrigger>}
        </TabsList>

        <div className={cn("mt-6", business.is_open === false && "opacity-60")}>
          {!business.is_open && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive">
              This business is currently closed.
              {business.wait_time && (
                <span> Available in {business.wait_time}
                  {business.closure_reason && ` (${business.closure_reason.replace(/_/g, ' ')})`}.
                </span>
              )}
            </div>
          )}

          <TabsContent value="about" className="m-0">
            <BusinessAboutTab business={business} />
          </TabsContent>

          <TabsContent value="posts" className="m-0">
            <BusinessPostsTab business={business} />
          </TabsContent>

          <TabsContent value="products" className="m-0">
            <BusinessProductsTab 
              businessId={id || ""} 
              isOwner={isOwner}
              products={business.business_products || []}
              onSuccess={() => {}}
            />
          </TabsContent>

          <TabsContent value="portfolio" className="m-0">
            <BusinessPortfolioTab 
              portfolio={business.business_portfolio || []}
              businessId={id || ""}
            />
          </TabsContent>

          {hasMenu && (
            <TabsContent value="menu" className="m-0">
              <BusinessMenuTab businessId={id || ""} />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default BusinessDetails;
