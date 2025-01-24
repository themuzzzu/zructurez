import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertCircle } from "lucide-react";

export const BusinessVerification = ({ businessId }: { businessId: string }) => {
  const [aadharNumber, setAadharNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: business, refetch } = useQuery({
    queryKey: ['business-verification', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('aadhar_number, pan_number, gst_number, verification_status, verification_submitted_at')
        .eq('id', businessId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          aadhar_number: aadharNumber,
          pan_number: panNumber,
          gst_number: gstNumber,
          verification_status: 'pending',
          verification_submitted_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) throw error;

      toast.success("Verification details submitted successfully!");
      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to submit verification details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (business?.verification_status) {
      case 'verified':
        return <Badge className="bg-green-500"><Shield className="w-4 h-4 mr-1" /> Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><AlertCircle className="w-4 h-4 mr-1" /> Pending Verification</Badge>;
      default:
        return <Badge variant="outline">Not Verified</Badge>;
    }
  };

  if (!business) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Business Verification</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        {business.verification_status === 'verified' ? (
          <div className="space-y-4">
            <div>
              <Label>Aadhar Number</Label>
              <p className="text-sm text-muted-foreground">{business.aadhar_number}</p>
            </div>
            <div>
              <Label>PAN Number</Label>
              <p className="text-sm text-muted-foreground">{business.pan_number}</p>
            </div>
            <div>
              <Label>GST Number</Label>
              <p className="text-sm text-muted-foreground">{business.gst_number}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input
                id="aadhar"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                placeholder="Enter your 12-digit Aadhar number"
                maxLength={12}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="Enter your 10-digit PAN number"
                maxLength={10}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number</Label>
              <Input
                id="gst"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                placeholder="Enter your 15-digit GST number"
                maxLength={15}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit for Verification"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};