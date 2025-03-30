
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { FormSidebar } from "@/components/business-registration/FormSidebar";

export default function Index() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10 mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome to Zructures</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar with standalone mode */}
          <div className="md:col-span-1">
            <FormSidebar 
              currentStep={currentStep} 
              setCurrentStep={setCurrentStep} 
              standaloneMode={true} 
            />
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2">
            <div className="p-6 bg-card rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Business Registration Platform</h2>
              <p className="mb-4">
                Register your business with our simple 5-step process. We guide you through 
                every step of the registration process.
              </p>
              
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium">Why register with us?</h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Increased visibility to potential customers</li>
                    <li>Manage your business profile easily</li>
                    <li>Get insights about customer interactions</li>
                    <li>Receive bookings and appointments online</li>
                  </ul>
                </div>
                
                <a 
                  href="/register-business" 
                  className="block w-full px-4 py-2 mt-4 text-center bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Start Registration
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
