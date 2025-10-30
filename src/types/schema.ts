// Props types (data passed to components)
export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface SidebarPromotion {
  id: string;
  shopName: string;
  description?: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
}

export interface AppProps {
  nearbyStores: Store[];
  popularProducts: Product[];
  sidebarPromotions: SidebarPromotion[];
}