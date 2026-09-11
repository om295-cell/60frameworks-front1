export interface Project {
  _id?: string;
  title: string;
  title_ar?: string;
  slug: string;
  category: string;
  category_ar?: string;
  client: string;
  client_ar?: string;
  summary: string;
  summary_ar?: string;
  description: string;
  description_ar?: string;
  coverImage: string;
  galleryImages: string[];
  metrics: {
    label: string;
    label_ar?: string;
    value: string;
    value_ar?: string;
  }[];
  tags: string[];
  tags_ar?: string[];
  featured: boolean;
  order: number;
  year: number;
}

export interface Service {
  _id?: string;
  title: string;
  title_ar?: string;
  slug: string;
  icon: string;
  tagline: string;
  tagline_ar?: string;
  description: string;
  description_ar?: string;
  deliverables: string[];
  deliverables_ar?: string[];
  order: number;
  highlighted: boolean;
}

export interface Sector {
  _id?: string;
  name: string;
  name_ar?: string;
  slug: string;
  description: string;
  description_ar?: string;
  capabilities: string[];
  capabilities_ar?: string[];
  imageUrl: string;
  icon: string;
  order: number;
}

export interface ClientItem {
  _id?: string;
  name: string;
  name_ar?: string;
  logoSvg: string;
  logoUrl?: string;
  industry: string;
  industry_ar?: string;
  tier: 'featured' | 'enterprise' | 'global';
  order: number;
  websiteUrl?: string;
}

export interface Testimonial {
  _id?: string;
  quote: string;
  quote_ar?: string;
  authorName: string;
  authorName_ar?: string;
  authorRole: string;
  authorRole_ar?: string;
  organization: string;
  organization_ar?: string;
  avatarUrl: string;
  metricHighlight?: string;
  metricHighlight_ar?: string;
  rating: number;
  order: number;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  company: string;
  serviceInterest: string;
  estimatedBudget?: string;
  timeline?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
  source?: string;
  errors?: { field: string; message: string }[];
}

export type Language = 'en' | 'ar';
