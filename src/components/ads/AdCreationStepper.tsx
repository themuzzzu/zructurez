
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Steps } from "./steps";
import { SelectSection } from "./steps/SelectSection";
import { SelectType } from "./steps/SelectType";
import { UploadMedia } from "./steps/UploadMedia";
import { AdContent } from "./steps/AdContent";
import { Schedule } from "./steps/Schedule";
import { Review } from "./steps/Review";
import { AdSectionType, AdType, AdFormData } from "./types";

export const AdCreationStepper = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AdFormData>({
    section: undefined,
    type: undefined,
    mediaUrl: "",
    title: "",
    description: "",
    ctaText: "",
    targetType: "url",
    targetId: "",
    startDate: new Date(),
    endDate: undefined,
    isActive: true,
  });

  const updateFormData = (data: Partial<AdFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const steps = [
    {
      title: "Select Section",
      description: "Choose where your ad will appear",
      component: <SelectSection 
        value={formData.section} 
        onChange={(section) => updateFormData({ section, type: undefined })} 
      />
    },
    {
      title: "Choose Type",
      description: "Select the type of advertisement",
      component: <SelectType 
        section={formData.section} 
        value={formData.type} 
        onChange={(type) => updateFormData({ type })} 
      />
    },
    {
      title: "Upload Media",
      description: "Add images or video for your ad",
      component: <UploadMedia 
        value={formData.mediaUrl} 
        onChange={(mediaUrl) => updateFormData({ mediaUrl })} 
      />
    },
    {
      title: "Ad Content",
      description: "Enter the details of your advertisement",
      component: <AdContent 
        data={formData} 
        onChange={updateFormData} 
      />
    },
    {
      title: "Schedule",
      description: "Set when your ad will run",
      component: <Schedule 
        data={formData} 
        onChange={updateFormData} 
      />
    },
    {
      title: "Review",
      description: "Review and submit your advertisement",
      component: <Review data={formData} />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Advertisement</CardTitle>
        <CardDescription>Follow the steps to create your ad</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Steps 
          steps={steps.map(s => s.title)} 
          currentStep={currentStep} 
          onStepClick={setCurrentStep}
        />
        
        <div className="mt-8">
          {steps[currentStep].component}
        </div>
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={isFirstStep ? onClose : prevStep}
          >
            {isFirstStep ? "Cancel" : "Previous"}
          </Button>
          <Button onClick={isLastStep ? onClose : nextStep}>
            {isLastStep ? "Submit" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
