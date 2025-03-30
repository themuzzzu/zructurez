import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { OwnersStaffStep } from "./steps/OwnersStaffStep";
import { LocationContactStep } from "./steps/LocationContactStep";
import { BusinessHoursStep } from "./steps/BusinessHoursStep";
import { FinalSubmitStep } from "./steps/FinalSubmitStep";
import { FormSidebar } from "./FormSidebar";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { businessFormSchema } from "./schema";
import { getLocalStorageFormData, saveFormDataToLocalStorage } from "./utils";

export type BusinessFormValues = z.infer<typeof businessFormSchema>;

export const BusinessRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userHasBusiness, setUserHasBusiness] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const methods = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    mode: "onChange",
    defaultValues: async () => {
      const savedData = getLocalStorageFormData();
      if (savedData) {
        const savedStep = localStorage.getItem("business-registration-step");
        if (savedStep) {
          setCurrentStep(parseInt(savedStep));
        }
        return savedData;
      }
      
      return {
        name: "",
        category: "",
        otherCategory: "",
        description: "",
        appointment_price: "",
        consultation_price: "",
        website: "",
        social_media: {
          facebook: "",
          instagram: "",
          twitter: ""
        },
        owners: [{
          name: "",
          role: "Founder",
          position: "",
          experience: "",
          qualifications: "",
          bio: "",
          image_url: null
        }],
        staff_details: [],
        location: "",
        contact: "",
        whatsapp: "",
        email: "",
        is_24_7: false,
        hours: "Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM, Sun: Closed",
        image: null,
        agree_terms: false,
        membership_plans: []
      };
    }
  });
  
  const { handleSubmit, watch, formState: { errors, isDirty, isValid }, reset } = methods;
  const formValues = watch();
  
  useEffect(() => {
    const checkUserBusiness = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { data: businesses, error } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', userData.user.id)
            .limit(1);
          
          if (error) {
            throw error;
          }
          
          if (businesses && businesses.length > 0) {
            setUserHasBusiness(true);
            toast({
              title: "You already have a business",
              description: "Only one business is allowed per user. Please manage your existing business.",
              variant: "destructive",
            });
            
            setTimeout(() => {
              navigate(`/businesses/${businesses[0].id}`);
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Error checking user business:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserBusiness();
  }, [navigate, toast]);
  
  useEffect(() => {
    if (isDirty) {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      
      const timer = setTimeout(() => {
        saveFormDataToLocalStorage(formValues);
        localStorage.setItem("business-registration-step", currentStep.toString());
        toast({
          title: "Progress auto-saved",
          description: "Your form data has been automatically saved",
          duration: 2000,
        });
      }, 30000);
      
      setAutoSaveTimer(timer);
    }
    
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [formValues, isDirty, currentStep]);
  
  useEffect(() => {
    localStorage.setItem("business-registration-step", currentStep.toString());
  }, [currentStep]);
  
  const saveAndContinueLater = () => {
    setSaving(true);
    saveFormDataToLocalStorage(formValues);
    localStorage.setItem("business-registration-step", currentStep.toString());
    
    toast({
      title: "Progress saved",
      description: "You can continue registration later",
      duration: 3000,
    });
    
    setTimeout(() => {
      setSaving(false);
      navigate("/businesses");
    }, 1000);
  };
  
  const handleNext = async () => {
    let canProceed = true;
    
    if (currentStep === 1) {
      const { name, category, description } = methods.getValues();
      canProceed = !!name && !!category && !!description;
      
      if (category === "other") {
        const otherCategory = methods.getValues("otherCategory");
        canProceed = canProceed && !!otherCategory;
      }
    } else if (currentStep === 2) {
      const owners = methods.getValues("owners");
      canProceed = owners.length > 0 && !!owners[0].name && !!owners[0].role && !!owners[0].position;
    } else if (currentStep === 3) {
      const { location, contact } = methods.getValues();
      canProceed = !!location && !!contact;
    } else if (currentStep === 4) {
      const { hours } = methods.getValues();
      canProceed = !!hours;
    }
    
    if (canProceed) {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
      toast({
        title: "Please fill all required fields",
        description: "You need to complete all required fields before proceeding",
        variant: "destructive",
      });
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleCancelRegistration = () => {
    if (window.confirm("Are you sure you want to cancel? Your progress will be saved, but you'll exit the registration form.")) {
      if (isDirty) {
        saveFormDataToLocalStorage(formValues);
        localStorage.setItem("business-registration-step", currentStep.toString());
        toast({
          title: "Progress saved",
          description: "You can continue registration later",
          duration: 3000,
        });
      }
      navigate("/businesses");
    }
  };
  
  const handleBackToBusinesses = () => {
    if (isDirty) {
      if (window.confirm("Going back will save your current progress. Continue?")) {
        saveFormDataToLocalStorage(formValues);
        localStorage.setItem("business-registration-step", currentStep.toString());
        toast({
          title: "Progress saved",
          description: "You can continue registration later",
          duration: 3000,
        });
      } else {
        return;
      }
    }
    navigate("/businesses");
  };
  
  const onSubmit = async (data: BusinessFormValues) => {
    if (userHasBusiness) {
      toast({
        title: "Registration not allowed",
        description: "You already have a registered business. Only one business is allowed per user.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      let image_url = data.image;
      
      const processedOwners = await Promise.all(
        data.owners.map(async (owner) => {
          return {
            ...owner,
            image_url: owner.image_url
          };
        })
      );
      
      const processedStaff = await Promise.all(
        (data.staff_details || []).map(async (staff) => {
          return {
            ...staff,
            image_url: staff.image_url
          };
        })
      );
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to register a business",
          variant: "destructive",
        });
        return;
      }
      
      const { data: existingBusinesses, error: checkError } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', userData.user.id)
        .limit(1);
      
      if (checkError) {
        throw checkError;
      }
      
      if (existingBusinesses && existingBusinesses.length > 0) {
        toast({
          title: "Registration failed",
          description: "You already have a registered business. Only one business is allowed per user.",
          variant: "destructive",
        });
        setUserHasBusiness(true);
        return;
      }
      
      const finalCategory = data.category === "other" && data.otherCategory 
        ? data.otherCategory 
        : data.category;
      
      const { data: business, error } = await supabase
        .from('businesses')
        .insert({
          name: data.name,
          category: finalCategory,
          description: data.description,
          appointment_price: data.appointment_price ? parseFloat(data.appointment_price) : null,
          consultation_price: data.consultation_price ? parseFloat(data.consultation_price) : null,
          website: data.website || null,
          location: data.location,
          contact: data.contact,
          hours: data.hours,
          image_url: image_url,
          user_id: userData.user.id,
          owners: processedOwners,
          staff_details: processedStaff,
          is_open: true,
          bio: data.owners[0].bio || "",
          membership_plans: data.membership_plans.length > 0 ? data.membership_plans : undefined
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error submitting form:", error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Business registered successfully!",
        description: "Your business has been registered and is now live.",
      });
      
      localStorage.removeItem("business-registration-form");
      localStorage.removeItem("business-registration-step");
      
      if (business) {
        setTimeout(() => {
          navigate(`/businesses/${business.id}`);
        }, 2000);
      } else {
        navigate("/businesses");
      }
      
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const progressPercentage = (currentStep / 5) * 100;
  
  if (loading && !userHasBusiness) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  if (userHasBusiness) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container max-w-7xl mx-auto pt-20 pb-16">
          <div className="bg-card rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Business Registration Limit Reached</h2>
            <p className="mb-4">You already have a registered business. Only one business is allowed per user ID.</p>
            <p className="mb-6">You will be redirected to your existing business page shortly.</p>
            <Button onClick={() => navigate("/businesses")}>
              Go to Businesses
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl mx-auto pt-20 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Register Your Business</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleBackToBusinesses}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Businesses
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelRegistration}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Cancel Registration
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4">
            <FormSidebar currentStep={currentStep} setCurrentStep={setCurrentStep} />
          </div>
          
          <div className="w-full lg:w-3/4">
            <div className="bg-card rounded-lg shadow-md p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold">Step {currentStep} of 5</h2>
                  <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {currentStep === 1 && <BasicInfoStep />}
                  {currentStep === 2 && <OwnersStaffStep />}
                  {currentStep === 3 && <LocationContactStep />}
                  {currentStep === 4 && <BusinessHoursStep />}
                  {currentStep === 5 && <FinalSubmitStep />}
                  
                  <div className="flex justify-between pt-6 border-t">
                    <div>
                      {currentStep > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handlePrevious}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={saveAndContinueLater}
                        disabled={saving}
                      >
                        <Save className="h-4 w-4 mr-2" /> Save & Continue Later
                      </Button>
                      
                      {currentStep < 5 ? (
                        <Button 
                          type="button" 
                          onClick={handleNext}
                        >
                          Next <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          type="submit"
                          disabled={!isValid || !methods.getValues("agree_terms") || loading}
                        >
                          {loading ? "Submitting..." : "Submit Registration"}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
