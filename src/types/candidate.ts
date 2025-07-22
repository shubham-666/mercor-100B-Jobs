export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience_years?: number;
  current_role?: string;
  skills?: string[];
  education?: string;
  linkedin?: string;
  portfolio?: string;
  availability?: string;
  salary_expectation?: string;
  why_interested?: string;
  previous_experience?: string;
  gender?: string;
  age?: number;
  score?: number;
  selected?: boolean;
  notes?: string;
}

export interface FilterOptions {
  search: string;
  experienceRange: [number, number];
  skills: string[];
  locations: string[];
  sortBy: 'name' | 'experience' | 'score';
  sortOrder: 'asc' | 'desc';
}

export interface DiversityMetrics {
  gender: Record<string, number>;
  experienceLevel: Record<string, number>;
  location: Record<string, number>;
}