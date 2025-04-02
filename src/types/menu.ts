
export type MenuType = 'menu' | 'list';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  price_unit?: string;
  image_url?: string;
  availability: 'in_stock' | 'out_of_stock';
  subcategory_id: string;
  business_id: string;
  created_at: string;
}

export interface MenuSubcategory {
  id: string;
  name: string;
  category_id: string;
  business_id: string;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  business_id: string;
  created_at: string;
  is_custom?: boolean;
}

export interface BusinessMenu {
  id: string;
  business_id: string;
  display_type: MenuType;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  is_draft: boolean;
}
