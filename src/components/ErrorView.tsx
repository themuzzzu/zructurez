import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ErrorViewProps {
  message?: string;
}

export const ErrorView = ({ message = "Something went wrong" }: ErrorViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-semibold">{message}</h2>
          <Link to="/services">
            <Button variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};