
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ServiceHeaderProps {
  title: string;
}

export const ServiceHeader = ({ title }: ServiceHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Link to="/services">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};
