import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
};