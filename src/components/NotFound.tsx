
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface NotFoundProps {
  message?: string;
}

export const NotFound = ({ message = "Page not found" }: NotFoundProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">{message}</p>
      <Button onClick={() => navigate("/")}>Go to Home</Button>
    </div>
  );
};
