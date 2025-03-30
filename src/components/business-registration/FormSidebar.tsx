
import { Check, AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { BusinessFormValues } from "./BusinessRegistrationForm";
import { useState } from "react";

interface FormSidebarProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  standaloneMode?: boolean;
}

interface StepItem {
  id: number;
  title: string;
  fieldsToCheck: (keyof BusinessFormValues)[];
  requiredFields: (keyof BusinessFormValues)[];
}

export const FormSidebar = ({ currentStep, setCurrentStep, standaloneMode = false }: FormSidebarProps) => {
  const [mockComplete, setMockComplete] = useState<{[key: number]: boolean}>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false
  });
  
  const formContext = standaloneMode ? null : useFormContext<BusinessFormValues>();
  
  const steps: StepItem[] = [
    {
      id: 1,
      title: "Basic Information",
      fieldsToCheck: ["name", "category", "description"],
      requiredFields: ["name", "category", "description"]
    },
    {
      id: 2,
      title: "Owners & Staff",
      fieldsToCheck: ["owners"],
      requiredFields: ["owners"]
    },
    {
      id: 3,
      title: "Location & Contact",
      fieldsToCheck: ["location", "contact"],
      requiredFields: ["location", "contact"]
    },
    {
      id: 4,
      title: "Business Hours",
      fieldsToCheck: ["hours"],
      requiredFields: ["hours"]
    },
    {
      id: 5,
      title: "Final Details",
      fieldsToCheck: ["image", "agree_terms"],
      requiredFields: ["agree_terms"]
    }
  ];
  
  const isStepComplete = (step: StepItem) => {
    if (standaloneMode) {
      return mockComplete[step.id] || false;
    }
    
    const values = formContext?.getValues();
    if (!values) return false;
    
    for (const field of step.requiredFields) {
      if (field === "owners") {
        const owners = values.owners || [];
        if (owners.length === 0 || !owners[0].name || !owners[0].role || !owners[0].position) {
          return false;
        }
      } 
      else if (!values[field]) {
        return false;
      }
    }
    
    return true;
  };
  
  // Allow jumping to any step regardless of completion status
  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="bg-card rounded-lg shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Registration Steps</h2>
      <ul className="space-y-4">
        {steps.map((step) => {
          const isComplete = isStepComplete(step);
          const isActive = step.id === currentStep;
          
          return (
            <li 
              key={step.id}
              className={cn(
                "relative pl-10 py-3 pr-4 rounded-md cursor-pointer transition-colors",
                isActive ? "bg-primary/10 text-primary font-medium" : "",
                !isActive ? "hover:bg-muted" : "",
              )}
              onClick={() => handleStepClick(step.id)}
            >
              <div className={cn(
                "absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center",
                isComplete ? "bg-green-100 text-green-600" : 
                isActive ? "bg-primary/20 text-primary" : 
                "bg-muted text-muted-foreground"
              )}>
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-medium">{step.id}</span>
                )}
              </div>
              <div>
                <span className="block">{step.title}</span>
                <span className="text-xs text-muted-foreground">
                  {isComplete ? "Complete" : isActive ? "In progress" : "Click to navigate"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
