export type PropertyType = 'Apartment' | 'Duplex' | 'Villa' | 'Commercial' | 'Land';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  location: string;
  price: number; // For easy formatting and filtering
  bedrooms: number;
  bathrooms: number;
  size: number; // in sqft or sqm
  image: string;
  images?: string[];
  description: string;
  currency?: 'USD' | 'NGN';
  whatsappLink?: string;
  phoneNumber?: string;
  videoLink?: string;
}

export interface FeatureCard {
  id: number;
  title: string;
  description: string;
  iconName: string; // Lucide icon name dynamic resolved or drawn
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  review: string;
  image: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}
