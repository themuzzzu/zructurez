
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ShieldCheck, ShieldAlert, Bolt, PiggyBank, TrendingUp, Users, LayoutDashboard, FileText, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AdvertisementPricingTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advertisement Pricing</h2>
        <p className="text-muted-foreground">
          Explore our flexible advertisement pricing plans to boost your business visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Plan */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">Basic</CardTitle>
            <CardDescription>
              Ideal for startups and small businesses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Standard Visibility</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Limited Analytics</span>
            </div>
            <div className="flex items-center">
              <XCircle className="mr-2 h-5 w-5 text-red-500" />
              <span>No Dedicated Support</span>
            </div>
            <Button variant="default" className="w-full">Choose Basic</Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">Pro</CardTitle>
            <CardDescription>
              For growing businesses seeking more exposure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Enhanced Visibility</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Advanced Analytics</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Priority Support</span>
            </div>
            <Button variant="default" className="w-full">Choose Pro</Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">Enterprise</CardTitle>
            <CardDescription>
              Custom solutions for large-scale advertising needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Maximum Visibility</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Comprehensive Analytics</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span>Dedicated Account Manager</span>
            </div>
            <Button variant="default" className="w-full">Contact Us</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
