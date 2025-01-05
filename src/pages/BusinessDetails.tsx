import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ErrorView } from "@/components/ErrorView";
import { LoadingView } from "@/components/LoadingView";
import { BusinessHeader } from "@/components/business-details/BusinessHeader";
import { BusinessProfile } from "@/components/business-details/BusinessProfile";
import { BusinessContent } from "@/components/business-details/BusinessContent";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateBusinessForm } from "@/components/CreateBusinessForm";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/PostCard";
import type { Business } from "@/types/business";

const BusinessDetails = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');

  const { data: business, isLoading, error, refetch } = useQuery({
    queryKey: ['business', id],
    queryFn: async () => {
      if (!isValidUUID) {
        throw new Error('Invalid business ID format');
      }

      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          business_portfolio (*),
          business_products (*),
          posts (*)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Business not found');
      
      // Parse JSON fields
      return {
        ...data,
        staff_details: Array.isArray(data.staff_details) ? data.staff_details : [],
        owners: Array.isArray(data.owners) ? data.owners : [],
        posts: data.posts || []
      } as Business;
    },
    enabled: isValidUUID
  });

  const { data: currentUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  const isOwner = currentUser?.id === business?.user_id;

  if (!isValidUUID || error) {
    return <ErrorView message={!isValidUUID ? "Invalid business ID format" : undefined} />;
  }

  if (isLoading) {
    return <LoadingView />;
  }

  if (!business) {
    return <ErrorView message="Business not found" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <BusinessHeader
            name={business.name}
            category={business.category}
            isOwner={isOwner}
            onEdit={() => setIsEditing(true)}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="portfolio">Notable Works</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="about">
                <BusinessProfile
                  description={business.description}
                  location={business.location}
                  hours={business.hours}
                  contact={business.contact}
                  verified={business.verified}
                  image_url={business.image_url}
                  bio={business.bio}
                  owners={business.owners}
                  staff_details={business.staff_details}
                />
              </TabsContent>

              <TabsContent value="products">
                <BusinessContent
                  businessId={business.id}
                  isOwner={isOwner}
                  business_products={business.business_products}
                  business_portfolio={[]}
                  onSuccess={refetch}
                />
              </TabsContent>

              <TabsContent value="services">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Services</h2>
                  {business.appointment_price && (
                    <div className="mb-2">
                      <span className="font-medium">Appointment Price:</span> ₹{business.appointment_price}
                    </div>
                  )}
                  {business.consultation_price && (
                    <div>
                      <span className="font-medium">Consultation Price:</span> ₹{business.consultation_price}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="staff">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Staff</h2>
                  <div className="grid gap-4">
                    {business.staff_details.map((staff, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{staff.name}</h3>
                        {staff.position && <p className="text-muted-foreground">{staff.position}</p>}
                        {staff.experience && <p className="text-sm text-muted-foreground">Experience: {staff.experience}</p>}
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Notable Works</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {business.business_portfolio.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-4">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="posts">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Posts</h2>
                  <div className="space-y-4">
                    {business.posts.map((post) => (
                      <PostCard
                        key={post.id}
                        id={post.id}
                        author={business.name}
                        avatar={business.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${business.id}`}
                        time={new Date(post.created_at).toLocaleDateString()}
                        content={post.content}
                        category={post.category}
                        image={post.image_url}
                        likes={0}
                        comments={0}
                      />
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <DialogTitle>Edit Business</DialogTitle>
          <ScrollArea className="h-full pr-4">
            <CreateBusinessForm
              initialData={business}
              onSuccess={() => {
                setIsEditing(false);
                refetch();
              }}
              onCancel={() => setIsEditing(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDetails;