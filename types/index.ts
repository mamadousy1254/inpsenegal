// Parse / Back4App entities
export interface ParseUser {
  objectId: string;
  username?: string;
  email?: string;
  role?: "admin" | "chercheur" | "public";
  createdAt?: string;
  updatedAt?: string;
}

export interface Publication {
  objectId: string;
  title: string;
  summary?: string;
  file?: { url: string };
  year?: number;
  category?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Actualite {
  objectId: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: { url: string };
  publishedAt?: string;
  slug?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Service {
  objectId: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface Partenaire {
  objectId: string;
  name: string;
  logo?: { url: string };
  url?: string;
  order?: number;
}

export interface Laboratoire {
  objectId: string;
  name: string;
  description?: string;
  domain?: string;
  order?: number;
}

export interface Projet {
  objectId: string;
  title: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface Document {
  objectId: string;
  title: string;
  file?: { url: string };
  category?: string;
  createdAt: string;
}

export interface Director {
  objectId: string;
  fullName: string;
  title: string;
  quote: string;
  message: string;
  photo?: { url: string };
  signature?: { url: string };
  createdAt?: string;
  updatedAt?: string;
}
