
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "./layout/Layout";

interface ErrorViewProps {
  message?: string;
  title?: string;
}

export const ErrorView = ({ 
  message = "Something went wrong", 
  title = "Error" 
}: ErrorViewProps) => {
  return (
    <Layout hideSidebar>
      <div className="container max-w-[1400px] py-16">
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-muted-foreground max-w-md">{message}</p>
          <div className="flex gap-4">
            <Link to="/services">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
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
