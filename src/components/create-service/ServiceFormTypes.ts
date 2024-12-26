export interface WorkItem {
  id: string;
  description: string;
  media: string | null;
}

export interface ServiceFormData {
  title: string;
  description: string;
  category: string;
  price: string;
  location: string;
  contact_info: string;
  availability: string;
  image: string | null;
  works: WorkItem[];
}

export interface CreateServiceFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}