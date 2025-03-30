
import type { BusinessFormValues } from "./BusinessRegistrationForm";

const STORAGE_KEY = "business-registration-form";

export const saveFormDataToLocalStorage = (data: BusinessFormValues) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
    return false;
  }
};

export const getLocalStorageFormData = (): BusinessFormValues | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error("Error getting form data from localStorage:", error);
    return null;
  }
};

export const clearLocalStorageFormData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("business-registration-step");
    return true;
  } catch (error) {
    console.error("Error clearing form data from localStorage:", error);
    return false;
  }
};

export const formatCurrency = (value: string | number) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

export const businessCategories = [
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "education", label: "Education & Training" },
  { value: "food", label: "Food & Beverages" },
  { value: "retail", label: "Retail & Shopping" },
  { value: "professional", label: "Professional Services" },
  { value: "technology", label: "Technology" },
  { value: "hospitality", label: "Hospitality & Travel" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "art", label: "Art & Entertainment" },
  { value: "home", label: "Home Services" },
  { value: "finance", label: "Finance & Insurance" },
  { value: "automotive", label: "Automotive" },
  { value: "legal", label: "Legal Services" },
  { value: "real-estate", label: "Real Estate" },
  { value: "non-profit", label: "Non-Profit & Community" },
  { value: "event", label: "Event Services" },
  { value: "other", label: "Other Services" },
];
