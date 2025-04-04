
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AdSlot, AdSlotType } from '@/types/advertising';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2Icon, PlusCircleIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const AdSlotManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  
  const queryClient = useQueryClient();
  
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['ad-slots-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ad_placements')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as AdSlot[];
    }
  });
  
  const createSlotMutation = useMutation({
    mutationFn: async (slot: Partial<AdSlot>) => {
      const { data, error } = await supabase
        .from('ad_placements')
        .insert(slot)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-slots-admin'] });
      setIsCreating(false);
      toast.success("Ad slot created successfully");
    },
    onError: (error) => {
      console.error("Error creating ad slot:", error);
      toast.error("Failed to create ad slot");
    }
  });
  
  const updateSlotMutation = useMutation({
    mutationFn: async (slot: Partial<AdSlot>) => {
      const { id, ...updates } = slot;
      const { data, error } = await supabase
        .from('ad_placements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-slots-admin'] });
      setEditingSlot(null);
      toast.success("Ad slot updated successfully");
    },
    onError: (error) => {
      console.error("Error updating ad slot:", error);
      toast.error("Failed to update ad slot");
    }
  });
  
  const deleteSlotMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ad_placements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-slots-admin'] });
      toast.success("Ad slot deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting ad slot:", error);
      toast.error("Failed to delete ad slot");
    }
  });
  
  // Slot type options
  const slotTypeOptions = [
    { value: 'homepage_banner_1', label: 'Homepage Banner 1' },
    { value: 'homepage_banner_2', label: 'Homepage Banner 2' },
    { value: 'sponsored_product', label: 'Sponsored Product' },
    { value: 'sponsored_service', label: 'Sponsored Service' },
    { value: 'trending_boost', label: 'Trending Boost' },
    { value: 'featured_business_pin', label: 'Featured Business Pin' },
    { value: 'local_banner', label: 'Local/City Banner' },
  ];
  
  const SlotForm = ({ slot, onSubmit, onCancel, isNew = false }) => {
    const [name, setName] = useState(slot?.name || '');
    const [type, setType] = useState<AdSlotType>(slot?.type || 'homepage_banner_1');
    const [description, setDescription] = useState(slot?.description || '');
    const [position, setPosition] = useState(slot?.position || '');
    const [dailyPrice, setDailyPrice] = useState(slot?.daily_price?.toString() || '');
    const [monthlyPrice, setMonthlyPrice] = useState(slot?.monthly_price?.toString() || '');
    const [exclusivePrice, setExclusivePrice] = useState(slot?.exclusive_price?.toString() || '');
    const [rotationInterval, setRotationInterval] = useState(slot?.rotation_interval_seconds?.toString() || '10');
    const [maxRotationSlots, setMaxRotationSlots] = useState(slot?.max_rotation_slots?.toString() || '5');
    const [isActive, setIsActive] = useState(slot?.is_active ?? true);
    const [hasExclusive, setHasExclusive] = useState(!!slot?.exclusive_price);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const slotData: Partial<AdSlot> = {
        name,
        type,
        description,
        position,
        daily_price: parseFloat(dailyPrice),
        monthly_price: parseFloat(monthlyPrice),
        exclusive_price: hasExclusive ? parseFloat(exclusivePrice) : null,
        rotation_interval_seconds: parseInt(rotationInterval),
        max_rotation_slots: parseInt(maxRotationSlots),
        is_active: isActive,
      };
      
      if (!isNew) {
        slotData.id = slot.id;
      }
      
      onSubmit(slotData);
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Slot Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Homepage Top Banner"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Slot Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as AdSlotType)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {slotTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe where the ad will appear"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input 
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., top, sidebar, footer"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dailyPrice">Daily Price (₹)</Label>
            <Input 
              id="dailyPrice"
              type="number"
              value={dailyPrice}
              onChange={(e) => setDailyPrice(e.target.value)}
              placeholder="Daily rate"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="monthlyPrice">Monthly Price (₹)</Label>
            <Input 
              id="monthlyPrice"
              type="number"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(e.target.value)}
              placeholder="Monthly rate"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="exclusivePrice">Exclusive Price (₹)</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={hasExclusive} 
                  onCheckedChange={setHasExclusive} 
                  id="has-exclusive" 
                />
                <Label htmlFor="has-exclusive" className="text-xs">Has exclusive</Label>
              </div>
            </div>
            <Input 
              id="exclusivePrice"
              type="number"
              value={exclusivePrice}
              onChange={(e) => setExclusivePrice(e.target.value)}
              placeholder="Exclusive rate"
              disabled={!hasExclusive}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rotationInterval">Rotation Interval (seconds)</Label>
            <Input 
              id="rotationInterval"
              type="number"
              min="1"
              value={rotationInterval}
              onChange={(e) => setRotationInterval(e.target.value)}
              placeholder="Rotation interval"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxRotationSlots">Max Rotation Slots</Label>
            <Input 
              id="maxRotationSlots"
              type="number"
              min="1"
              value={maxRotationSlots}
              onChange={(e) => setMaxRotationSlots(e.target.value)}
              placeholder="Maximum slots"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isActive} 
            onCheckedChange={setIsActive} 
            id="is-active" 
          />
          <Label htmlFor="is-active">Active</Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isNew ? 'Create Slot' : 'Update Slot'}
          </Button>
        </div>
      </form>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Ad Slot Management</h2>
          <p className="text-muted-foreground">Configure available advertising positions</p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add New Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Ad Slot</DialogTitle>
            </DialogHeader>
            <SlotForm 
              slot={null} 
              onSubmit={(data) => createSlotMutation.mutate(data)}
              onCancel={() => setIsCreating(false)}
              isNew
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Ad Slots</CardTitle>
          <CardDescription>
            Manage where advertisements can appear in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">Loading ad slots...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Daily Price</TableHead>
                    <TableHead>Monthly Price</TableHead>
                    <TableHead>Exclusive Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No ad slots found
                      </TableCell>
                    </TableRow>
                  ) : (
                    slots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell className="font-medium">{slot.name}</TableCell>
                        <TableCell>{slot.type.replace(/_/g, ' ')}</TableCell>
                        <TableCell>₹{slot.daily_price}</TableCell>
                        <TableCell>₹{slot.monthly_price}</TableCell>
                        <TableCell>
                          {slot.exclusive_price ? `₹${slot.exclusive_price}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            slot.is_active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {slot.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog open={editingSlot?.id === slot.id} onOpenChange={(open) => {
                              if (!open) setEditingSlot(null);
                              else setEditingSlot(slot);
                            }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Ad Slot</DialogTitle>
                                </DialogHeader>
                                {editingSlot && (
                                  <SlotForm 
                                    slot={editingSlot} 
                                    onSubmit={(data) => updateSlotMutation.mutate(data)}
                                    onCancel={() => setEditingSlot(null)}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this ad slot?")) {
                                  deleteSlotMutation.mutate(slot.id);
                                }
                              }}
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
