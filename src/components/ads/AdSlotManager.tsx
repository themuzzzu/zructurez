
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw } from "lucide-react";
import { getAdPlacements } from "@/services/adService";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Form schema
const slotSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Type is required"),
  size: z.string().min(1, "Size is required"),
  cpc_rate: z.coerce.number().positive("CPC rate must be positive"),
  cpm_rate: z.coerce.number().positive("CPM rate must be positive"),
  priority: z.coerce.number().int().positive("Priority must be a positive integer"),
  max_size_kb: z.coerce.number().int().positive("Max size must be a positive integer"),
  active: z.boolean().default(true),
});

export const AdSlotManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Fetch ad placements
  const { data: adSlots = [], refetch } = useQuery({
    queryKey: ["ad-slots"],
    queryFn: getAdPlacements,
  });

  // Form setup
  const form = useForm<z.infer<typeof slotSchema>>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      type: "",
      size: "",
      cpc_rate: 1,
      cpm_rate: 10,
      priority: 1,
      max_size_kb: 1024,
      active: true,
    },
  });

  // Refresh ad slots
  const refreshSlots = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    toast({ title: "Ad slots refreshed" });
  };

  // Create new ad slot
  const onSubmit = async (values: z.infer<typeof slotSchema>) => {
    try {
      const { error } = await supabase.from("ad_placements").insert(values);

      if (error) throw error;

      toast({ title: "Ad slot created successfully" });
      setIsDialogOpen(false);
      form.reset();
      refreshSlots();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create ad slot",
        description: error.message,
      });
    }
  };

  // Toggle ad slot status
  const toggleSlotStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("ad_placements")
        .update({ active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      toast({ title: `Ad slot ${currentStatus ? "disabled" : "enabled"}` });
      refreshSlots();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update ad slot",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ad Slot Management</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSlots}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {adSlots.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">No ad slots defined</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first ad slot
              </Button>
            </div>
          ) : (
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Size</TableHead>
                    <TableHead className="hidden md:table-cell">CPC Rate</TableHead>
                    <TableHead className="hidden md:table-cell">CPM Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell className="font-medium">{slot.name}</TableCell>
                      <TableCell>{slot.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{slot.type}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{slot.size}</TableCell>
                      <TableCell className="hidden md:table-cell">${slot.cpc_rate}</TableCell>
                      <TableCell className="hidden md:table-cell">${slot.cpm_rate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={slot.active ? "success" : "destructive"}
                          className="bg-transparent"
                        >
                          {slot.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSlotStatus(slot.id, slot.active)}
                        >
                          {slot.active ? "Disable" : "Enable"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Ad Slot Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Ad Slot</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slot Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Homepage Banner Top" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home">Home Page</SelectItem>
                          <SelectItem value="marketplace">Marketplace</SelectItem>
                          <SelectItem value="business">Business Section</SelectItem>
                          <SelectItem value="services">Services Section</SelectItem>
                          <SelectItem value="product_detail">Product Detail Pages</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="banner">Banner</SelectItem>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="sidebar">Sidebar</SelectItem>
                          <SelectItem value="leaderboard">Leaderboard</SelectItem>
                          <SelectItem value="carousel">Carousel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Size */}
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="300x250">300x250 (Medium Rectangle)</SelectItem>
                          <SelectItem value="728x90">728x90 (Leaderboard)</SelectItem>
                          <SelectItem value="320x50">320x50 (Mobile Banner)</SelectItem>
                          <SelectItem value="468x60">468x60 (Banner)</SelectItem>
                          <SelectItem value="fullwidth">Full Width</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CPC Rate */}
                <FormField
                  control={form.control}
                  name="cpc_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPC Rate ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CPM Rate */}
                <FormField
                  control={form.control}
                  name="cpm_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPM Rate ($)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Max Size KB */}
                <FormField
                  control={form.control}
                  name="max_size_kb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Size (KB)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Active Status */}
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Active Status</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Enable or disable this ad slot.
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Banner ad shown at the top of the homepage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Ad Slot</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdSlotManager;
