import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAdvertisement } from "./CreateAdvertisement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const AdvertisementsTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: advertisements, refetch } = useQuery({
    queryKey: ['user-advertisements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('advertisements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Advertisements</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Advertisement
        </Button>
      </div>

      <div className="grid gap-4">
        {advertisements?.map((ad) => (
          <Card key={ad.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{ad.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ad.type.charAt(0).toUpperCase() + ad.type.slice(1)} Advertisement
                  </p>
                </div>
                <Badge className={getStatusColor(ad.status)}>
                  {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {ad.image_url && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm">{ad.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>📍 {ad.location}</span>
                    <span>💰 ₹{ad.budget}</span>
                    <span>📅 {format(new Date(ad.start_date), 'MMM d, yyyy')} - {format(new Date(ad.end_date), 'MMM d, yyyy')}</span>
                    {ad.reach > 0 && <span>👥 {ad.reach} reached</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[90vh]">
          <ScrollArea className="h-full pr-4">
            <CreateAdvertisement onClose={() => {
              setIsDialogOpen(false);
              refetch();
            }} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};