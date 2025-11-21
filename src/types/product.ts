export interface Product {
  id: string;
  section: 'electronics' | 'furniture';
  title: string;
  description?: string;
  price: number;
  images: string[];
  category: string;
  sub_type?: string;
  brand?: string;
  availability: boolean;
  model_no?: string;
  spec_value?: number;
  spec_unit?: string;
  material?: string;
  dimensions?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderForm {
  name: string;
  mobile: string;
  address: string;
  quantity: number;
}

export interface FilterState {
  category: string[];
  priceRange: [number, number];
  brand: string[];
  material: string[];
  color: string[];
  search: string;
}
