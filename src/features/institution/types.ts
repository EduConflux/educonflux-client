export type InstitutionStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Institution {
  id: number;
  name: string;
  code: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  status: InstitutionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstitutionRequest {
  name: string;
  code: string;
  email: string;
  phone?: string;
  website?: string;
  logoUrl?: string;
  address?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}
