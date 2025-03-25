
import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdDashboard from "./AdDashboard";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const AdminPage = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(true); // In a real app, this would come from a role check
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If user is not an admin, show unauthorized message
  if (!isAdmin) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }
  
  // If user is an admin, show the dashboard
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to="/admin/api-demo">
              <ShieldCheck className="mr-2 h-4 w-4" />
              API Security Demo
            </Link>
          </Button>
        </div>
      </div>
      <AdDashboard />
    </div>
  );
};

export default AdminPage;
