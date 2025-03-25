
import { useState } from "react";
import { approveAd, AdminSchemas } from "@/utils/adminApiMiddleware";
import { z } from "zod";
import { validateRequest } from "@/utils/requestValidation";
import { rateLimit } from "@/utils/rateLimiting";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const AdminApiDemo = () => {
  const [adId, setAdId] = useState("");
  const [approved, setApproved] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // For testing validation
  const [customInput, setCustomInput] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  
  // Test ad approval (combines rate limiting, validation, and admin auth)
  const handleApproveAd = async () => {
    setIsLoading(true);
    try {
      const success = await approveAd({
        adId,
        approved,
        rejectionReason: approved ? undefined : rejectionReason
      });
      
      if (success) {
        setAdId("");
        setRejectionReason("");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Test validation only
  const testValidation = () => {
    try {
      // Parse the input as JSON
      const inputData = JSON.parse(customInput);
      
      // Validate with a schema
      const schema = AdminSchemas.adApproval;
      const result = validateRequest(inputData, schema);
      
      setValidationResult(result);
      if (result) {
        toast.success("Validation successful!");
      }
    } catch (error) {
      console.error("JSON parse error:", error);
      toast.error("Invalid JSON format");
    }
  };
  
  // Test rate limiting only
  const testRateLimiting = () => {
    const testClientId = "test-client-id";
    const result = rateLimit(testClientId, { 
      maxRequests: 3,
      windowMs: 10 * 1000, // 10 seconds
      message: "Test rate limit exceeded (3 requests per 10 seconds)" 
    });
    
    if (result) {
      toast.success("Request allowed (not rate limited)");
    }
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin API Security Demo</h1>
      <p className="text-muted-foreground">
        This page demonstrates rate limiting and request validation.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Rate limiting + validation + admin auth */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Approval Demo</CardTitle>
            <CardDescription>
              This form includes rate limiting, data validation, and admin authorization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ad ID (UUID)</label>
              <Input
                placeholder="Enter ad ID"
                value={adId}
                onChange={(e) => setAdId(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={approved} 
                onCheckedChange={setApproved}
              />
              <label>Approve ad</label>
            </div>
            
            {!approved && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Reason</label>
                <Textarea
                  placeholder="Enter rejection reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}
            
            <Button 
              onClick={handleApproveAd} 
              disabled={isLoading || !adId}
              className="w-full"
            >
              {isLoading ? "Processing..." : approved ? "Approve Ad" : "Reject Ad"}
            </Button>
          </CardContent>
        </Card>
        
        {/* Validation test */}
        <Card>
          <CardHeader>
            <CardTitle>Request Validation Test</CardTitle>
            <CardDescription>
              Test Zod validation with custom JSON input
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">JSON Input</label>
              <Textarea
                placeholder='{"adId": "123e4567-e89b-12d3-a456-426614174000", "approved": true}'
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="h-24 font-mono"
              />
            </div>
            
            <Button 
              onClick={testValidation}
              variant="outline" 
              className="w-full"
            >
              Test Validation
            </Button>
            
            <Button 
              onClick={testRateLimiting}
              variant="secondary" 
              className="w-full"
            >
              Test Rate Limiting (Click rapidly)
            </Button>
            
            {validationResult && (
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Validation Result:</h3>
                <pre className="text-xs overflow-auto max-h-24">
                  {JSON.stringify(validationResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminApiDemo;
