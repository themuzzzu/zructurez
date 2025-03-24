
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Home, Building, MapPin, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define address validation schema
const addressSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address_line1: z.string().min(5, { message: "Address must be at least 5 characters." }),
  address_line2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  postal_code: z.string().min(6, { message: "Postal code must be at least 6 characters." }),
  is_default: z.boolean().default(false),
  address_type: z.enum(["home", "work", "other"]),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface Address {
  id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
  address_type: 'home' | 'work' | 'other';
  user_id: string;
}

interface CheckoutAddressProps {
  addresses: Address[];
  selectedAddress: string | null;
  onSelectAddress: (addressId: string) => void;
  onContinue: () => void;
}

export const CheckoutAddress = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onContinue,
}: CheckoutAddressProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Initialize form
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      is_default: false,
      address_type: "home",
    },
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: async (values: AddressFormValues) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to add address');
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          ...values,
          user_id: session.session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Address;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      onSelectAddress(data.id);
      toast.success("Address added successfully!");
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to add address");
    },
  });

  const onSubmit = (values: AddressFormValues) => {
    addAddressMutation.mutate(values);
  };

  // Auto-select default address if none selected
  if (addresses.length > 0 && !selectedAddress) {
    const defaultAddress = addresses.find(addr => addr.is_default);
    if (defaultAddress) {
      onSelectAddress(defaultAddress.id);
    } else {
      onSelectAddress(addresses[0].id);
    }
  }

  return (
    <div className="space-y-4">
      {addresses.length > 0 ? (
        <RadioGroup
          value={selectedAddress || undefined}
          onValueChange={onSelectAddress}
          className="space-y-3"
        >
          {addresses.map((address) => (
            <div key={address.id} className="flex items-center space-x-2">
              <RadioGroupItem value={address.id} id={`address-${address.id}`} />
              <Label htmlFor={`address-${address.id}`} className="flex-grow">
                <Card className="p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {address.address_type === 'home' ? (
                        <Home className="h-5 w-5 text-slate-400" />
                      ) : address.address_type === 'work' ? (
                        <Building className="h-5 w-5 text-slate-400" />
                      ) : (
                        <MapPin className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{address.name}</h3>
                        {address.is_default && (
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">Default</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {address.address_line1}, 
                        {address.address_line2 ? `${address.address_line2}, ` : ' '}
                        {address.city}, {address.state}, {address.postal_code}
                      </p>
                      <p className="text-sm text-slate-600 mt-1">Phone: {address.phone}</p>
                    </div>
                  </div>
                </Card>
              </Label>
            </div>
          ))}
        </RadioGroup>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-slate-600 mb-4">You don't have any saved addresses</p>
        </Card>
      )}

      {/* Add New Address */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address_line1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="House/Flat No, Building Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_line2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Street, Landmark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Type</FormLabel>
                    <div className="flex gap-4">
                      <Label
                        htmlFor="home"
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                          field.value === 'home' ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          id="home"
                          value="home"
                          className="sr-only"
                          checked={field.value === 'home'}
                          onChange={() => field.onChange('home')}
                        />
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                      </Label>
                      <Label
                        htmlFor="work"
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                          field.value === 'work' ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          id="work"
                          value="work"
                          className="sr-only"
                          checked={field.value === 'work'}
                          onChange={() => field.onChange('work')}
                        />
                        <Building className="h-4 w-4" />
                        <span>Work</span>
                      </Label>
                      <Label
                        htmlFor="other"
                        className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                          field.value === 'other' ? 'border-primary bg-primary/10' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          id="other"
                          value="other"
                          className="sr-only"
                          checked={field.value === 'other'}
                          onChange={() => field.onChange('other')}
                        />
                        <MapPin className="h-4 w-4" />
                        <span>Other</span>
                      </Label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Set as default address
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={addAddressMutation.isPending}>
                  {addAddressMutation.isPending ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Continue Button */}
      <Button 
        onClick={onContinue} 
        className="w-full mt-4"
        disabled={!selectedAddress}
      >
        Continue to Payment
      </Button>
    </div>
  );
};
