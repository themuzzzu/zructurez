
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Address } from "@/types/address";

interface CheckoutAddressProps {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
  onAddAddress: (address: Address) => void;
}

export const CheckoutAddress = ({
  selectedAddress,
  onSelectAddress,
  onAddAddress,
}: CheckoutAddressProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // New address form state
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [addressType, setAddressType] = useState<"home" | "work" | "other">("home");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to view your addresses");
        return;
      }
      
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });
      
      if (error) throw error;
      
      setAddresses(data as Address[]);
      
      // Select default address if available and no address is currently selected
      if (data.length > 0 && !selectedAddress) {
        const defaultAddress = data.find(addr => addr.is_default) || data[0];
        onSelectAddress(defaultAddress as Address);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load your addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please login to add an address");
        return;
      }
      
      // Make sure required fields are filled
      if (!name || !addressLine1 || !city || !state || !postalCode || !phone) {
        toast.error("Please fill all required fields");
        return;
      }
      
      // Create new address object with all required fields
      const newAddress = {
        user_id: user.id,
        name: name,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city: city,
        state: state,
        postal_code: postalCode,
        phone: phone,
        address_type: addressType,
        is_default: isDefault
      };
      
      const { data, error } = await supabase
        .from("user_addresses")
        .insert(newAddress)
        .select()
        .single();
      
      if (error) throw error;
      
      // If this is set as default, update other addresses
      if (isDefault) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", user.id)
          .neq("id", data.id);
      }
      
      toast.success("Address added successfully");
      onAddAddress(data);
      
      // Clear form and hide it
      resetForm();
      setShowNewAddressForm(false);
      
      // Refresh addresses
      fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setPhone("");
    setAddressType("home");
    setIsDefault(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length > 0 && (
            <RadioGroup 
              value={selectedAddress?.id} 
              onValueChange={(value) => {
                const selected = addresses.find(addr => addr.id === value);
                if (selected) onSelectAddress(selected);
              }}
              className="space-y-4"
            >
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3">
                  <RadioGroupItem value={address.id} id={`address-${address.id}`} />
                  <div className="grid gap-1">
                    <Label htmlFor={`address-${address.id}`} className="font-medium">
                      {address.name} ({address.address_type})
                      {address.is_default && <span className="ml-2 text-sm text-green-600">Default</span>}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {address.address_line1}, {address.address_line2 && `${address.address_line2},`} {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          {addresses.length === 0 && !showNewAddressForm && (
            <div className="text-center py-6">
              <p className="mb-4">You don't have any saved addresses yet</p>
            </div>
          )}

          {!showNewAddressForm ? (
            <Button 
              onClick={() => setShowNewAddressForm(true)} 
              variant="outline" 
              className="mt-4"
            >
              Add New Address
            </Button>
          ) : (
            <form onSubmit={handleAddAddress} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input 
                  id="address_line1" 
                  value={addressLine1} 
                  onChange={(e) => setAddressLine1(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
                <Input 
                  id="address_line2" 
                  value={addressLine2} 
                  onChange={(e) => setAddressLine2(e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    value={state} 
                    onChange={(e) => setState(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input 
                  id="postal_code" 
                  value={postalCode} 
                  onChange={(e) => setPostalCode(e.target.value)} 
                  required 
                />
              </div>
              
              <div>
                <Label htmlFor="address_type">Address Type</Label>
                <Select 
                  value={addressType} 
                  onValueChange={(value: "home" | "work" | "other") => setAddressType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="is_default">Set as default address</Label>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Address"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    resetForm();
                    setShowNewAddressForm(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
