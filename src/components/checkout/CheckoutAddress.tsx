
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Address } from '@/types/address';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida',
  'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
  'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const addressFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address_line1: z.string().min(3, 'Address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(5, 'Valid ZIP code is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address_type: z.enum(['home', 'work', 'other']),
  is_default: z.boolean().default(false),
});

interface CheckoutAddressProps {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({ selectedAddress, onSelectAddress }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
      address_type: 'home',
      is_default: false,
    },
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (error) throw error;

        setAddresses(data as Address[]);

        // Auto-select default address if available and none is selected
        if (data.length > 0 && !selectedAddress) {
          // Find default address or use the first one
          const defaultAddress = data.find(addr => addr.is_default) || data[0];
          onSelectAddress(defaultAddress as Address);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load your saved addresses');
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user, selectedAddress, onSelectAddress]);

  const handleAddAddress = async (values: z.infer<typeof addressFormSchema>) => {
    if (!user) return;

    try {
      // Prepare the complete address object
      const newAddress: Partial<Address> = {
        user_id: user.id,
        name: values.name,
        address_line1: values.address_line1,
        address_line2: values.address_line2 || '',
        city: values.city,
        state: values.state,
        postal_code: values.postal_code,
        phone: values.phone,
        address_type: values.address_type,
        is_default: values.is_default,
      };

      const { data, error } = await supabase
        .from('user_addresses')
        .insert(newAddress)
        .select()
        .single();

      if (error) throw error;

      // Add the new address to the local state
      setAddresses(prev => [...prev, data as Address]);
      onSelectAddress(data as Address);
      setShowAddForm(false);
      toast.success('Address added successfully');

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin h-6 w-6 border-2 border-gray-500 rounded-full border-t-transparent"></div>
            </div>
          ) : addresses.length > 0 ? (
            <>
              <RadioGroup 
                defaultValue={selectedAddress?.id}
                className="space-y-4"
                value={selectedAddress?.id}
                onValueChange={(value) => {
                  const address = addresses.find(a => a.id === value);
                  if (address) onSelectAddress(address);
                }}
              >
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-2 border rounded-md p-4">
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="grid gap-1 flex-grow">
                      <Label htmlFor={address.id} className="font-medium flex items-center">
                        {address.name}
                        {address.is_default && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
                            Default
                          </span>
                        )}
                        <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                          {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}
                        </span>
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        <div>{address.address_line1}</div>
                        {address.address_line2 && <div>{address.address_line2}</div>}
                        <div>
                          {address.city}, {address.state} {address.postal_code}
                        </div>
                        <div>Phone: {address.phone}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? 'Cancel' : '+ Add New Address'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="mb-4">You don't have any saved addresses yet.</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(true)}
              >
                + Add New Address
              </Button>
            </div>
          )}

          {showAddForm && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium text-lg mb-4">Add New Address</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddAddress)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input placeholder="(123) 456-7890" {...field} />
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
                          <Input placeholder="Street address" {...field} />
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
                          <Input placeholder="Apt, suite, unit, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {US_STATES.map(state => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="home" id="home" />
                              <Label htmlFor="home">Home</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="work" id="work" />
                              <Label htmlFor="work">Work</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other">Other</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_default"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Set as default address</FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Address
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutAddress;
