
export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  subcategory: string;
  stock: string;
  image: string | null;
  images?: (string | null)[];
  is_discounted: boolean;
  discount_percentage: string;
  is_used: boolean;
  condition: string;
  is_branded: boolean;
  brand_name: string;
  model: string;
  size: string;
  labels: {
    name: string;
    attributes: string[];
  }[];
}

export interface ProductFormProps {
  formData: ProductFormData;
  onChange: (name: string, value: any) => void;
}
