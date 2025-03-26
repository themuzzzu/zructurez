
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { useEffect } from "react";

interface ErrorViewProps {
  message?: string;
  title?: string;
  status?: number;
}

export const ErrorView = ({ 
  message = "Something went wrong", 
  title = "Error",
  status
}: ErrorViewProps) => {
  const navigate = useNavigate();
  
  // Log error for debugging
  useEffect(() => {
    console.error(`Error view rendered: ${status} - ${title} - ${message}`);
  }, [status, title, message]);

  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-16">
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h2 className="text-2xl font-semibold">{status ? `${status} - ${title}` : title}</h2>
          <p className="text-muted-foreground max-w-md">{message}</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link to="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
