
import { cn } from "@/lib/utils";

interface StepsProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const Steps = ({ steps, currentStep, onStepClick }: StepsProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => (
          <li key={step} className="md:flex-1">
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                "group flex flex-col border rounded-md w-full hover:border-primary transition-colors",
                index <= currentStep
                  ? "border-primary/70"
                  : "border-input"
              )}
            >
              <span className="px-4 py-2 text-sm font-medium">
                Step {index + 1}
              </span>
              <span
                className={cn(
                  "px-4 py-2 text-sm font-medium border-t",
                  index <= currentStep
                    ? "text-primary border-primary/70"
                    : "border-input"
                )}
              >
                {step}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};
