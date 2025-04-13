
import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, MessageSquare, Briefcase } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  message: string;
}

export default function ComingSoonPage({ title, message }: ComingSoonPageProps) {
  const navigate = useNavigate();
  
  // Select icon based on title
  const getIcon = () => {
    switch(title.toLowerCase()) {
      case 'jobs':
        return <Briefcase className="h-16 w-16 text-primary" />;
      case 'events':
        return <Calendar className="h-16 w-16 text-primary" />;
      case 'messaging':
        return <MessageSquare className="h-16 w-16 text-primary" />;
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-primary/10 p-4 rounded-full">
            {getIcon()}
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground max-w-md">{message}</p>
          <p className="text-sm text-muted-foreground">We're working hard to bring this feature to you soon.</p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    </Layout>
  );
}
