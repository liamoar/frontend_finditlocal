export interface Business {
  id: number;
  name: string;
  category: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  international_phone: string | null;
  website: string | null;
  opening_hours: any | null;
  rating: number | null;
  reviews: number | null;
  whatsapp: string | null;
}

export interface SearchFilters {
  category?: string;
  area?: string;
  query?: string;
}