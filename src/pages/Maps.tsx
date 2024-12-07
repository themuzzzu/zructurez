import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Maps = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-[1400px] pt-20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>
              <h1 className="text-3xl font-bold animate-fade-up">Tadipatri (515411) Local Area Map</h1>
              <p className="text-muted-foreground">Anantapur District, Andhra Pradesh</p>
            </div>
          </div>

          <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg animate-fade-up">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61474.31247965153!2d78.00381611889645!3d14.90757979301061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb5ddf506b7c7c1%3A0x19a7ac74f858d6f2!2sTadipatri%2C+Andhra+Pradesh+515411!5e0!3m2!1sen!2sin!4v1709656441435!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tadipatri Map"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;