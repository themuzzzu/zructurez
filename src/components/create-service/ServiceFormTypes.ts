export interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  contact_info: string;
  availability: string;
}

export interface CreateServiceFormProps {
  onSuccess?: () => void;
}