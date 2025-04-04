
import { CheckCircle } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="relative">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={step} 
            className="relative flex flex-col items-center"
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center z-10
              ${index < currentStep 
                ? 'bg-primary text-primary-foreground' 
                : index === currentStep 
                  ? 'bg-primary text-primary-foreground border-4 border-primary/20' 
                  : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
              }
            `}>
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="text-xs md:text-sm font-medium mt-2">
              {step}
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress line */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" 
        style={{ width: '100%', transform: 'translateY(-50%)' }}
      />
      
      {/* Filled progress */}
      <div 
        className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-300" 
        style={{ 
          width: `${currentStep / (steps.length - 1) * 100}%`, 
          transform: 'translateY(-50%)'
        }}
      />
    </div>
  );
};
