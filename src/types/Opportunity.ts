export type SourceType =
  | 'OFFICIAL_COMPANY'
  | 'OFFICIAL_API'
  | 'CURATED'
  | 'FUTURE_JOB_API';

export type OpportunityStatus = 'ACTIVE' | 'UNKNOWN' | 'EXPIRED';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site' | 'Unknown';

export type EmploymentType =
  | 'Internship'
  | 'Full-time'
  | 'Graduate'
  | 'Entry-level'
  | 'Unknown';

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  logoBg?: string; // Tailwind background color string for badge avatar
  description: string;
  officialWebsite: string;
  careersUrl: string;
  companyType: 'Product' | 'Services' | 'Global Tech MNC' | 'Startup' | 'Enterprise';
  industry: string;
  supportedRoles: string[];
  headquarters?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyId: string;
  companyLogoBg?: string;
  location: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  roleCategory: string;
  skills: string[];
  description: string;
  eligibility?: string;
  experienceLevel: 'Student / Intern' | 'Fresher / Entry' | '0-1 Years' | '0-2 Years';
  salary?: string;
  applicationUrl: string;
  source: string;
  sourceType: SourceType;
  postedDate: string;
  closingDate?: string;
  lastVerified: string;
  status: OpportunityStatus;
}

export type ApplicationStatus =
  | 'Interested'
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface ApplicationTrackerItem {
  id: string;
  companyName: string;
  roleTitle: string;
  applicationUrl: string;
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;
  opportunityId?: string;
}

export interface SkillMatchBreakdown {
  matchPercentage: number;
  existingSkills: string[];
  developingSkills: string[];
  missingSkills: string[];
  disclaimerText: string;
}

export interface OpportunityFilter {
  role: string;
  company: string;
  location: string;
  workMode: string;
  employmentType: string;
  experienceLevel: string;
  minMatch: number;
  searchQuery: string;
}
