import { VERIFIED_COMPANIES_DATABASE, VERIFIED_OPPORTUNITIES_DATABASE } from '../data/companies';
import { Company, Opportunity, OpportunityFilter } from '../types/Opportunity';
import { StudentProfile } from '../types';
import { OpportunityMatchService } from './opportunityMatchService';

export class OpportunityService {
  public static getCompanies(): Company[] {
    return VERIFIED_COMPANIES_DATABASE;
  }

  public static getCompanyById(id: string): Company | undefined {
    return VERIFIED_COMPANIES_DATABASE.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase());
  }

  public static getOpportunities(): Opportunity[] {
    return VERIFIED_OPPORTUNITIES_DATABASE.filter((o) => o.status !== 'EXPIRED');
  }

  public static getOpportunityById(id: string): Opportunity | undefined {
    return VERIFIED_OPPORTUNITIES_DATABASE.find((o) => o.id === id);
  }

  public static getOpportunitiesForRole(targetRole: string): Opportunity[] {
    if (!targetRole) return this.getOpportunities();
    const query = targetRole.toLowerCase().trim();
    return VERIFIED_OPPORTUNITIES_DATABASE.filter(
      (o) =>
        o.status !== 'EXPIRED' &&
        (o.title.toLowerCase().includes(query) ||
          o.roleCategory.toLowerCase().includes(query) ||
          query.includes(o.title.toLowerCase()))
    );
  }

  public static getCompanyOpportunities(companyId: string): Opportunity[] {
    return VERIFIED_OPPORTUNITIES_DATABASE.filter((o) => o.companyId === companyId && o.status !== 'EXPIRED');
  }

  public static searchCompanies(query: string): Company[] {
    if (!query.trim()) return VERIFIED_COMPANIES_DATABASE;
    const q = query.toLowerCase().trim();
    return VERIFIED_COMPANIES_DATABASE.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.supportedRoles.some((r) => r.toLowerCase().includes(q))
    );
  }

  public static filterOpportunities(
    filters: OpportunityFilter,
    profile: StudentProfile
  ): Opportunity[] {
    return VERIFIED_OPPORTUNITIES_DATABASE.filter((opp) => {
      // Exclude EXPIRED from active listings
      if (opp.status === 'EXPIRED') return false;

      // Role filter
      if (filters.role && filters.role !== 'All') {
        const rLower = filters.role.toLowerCase();
        if (!opp.title.toLowerCase().includes(rLower) && !opp.roleCategory.toLowerCase().includes(rLower)) {
          return false;
        }
      }

      // Company filter
      if (filters.company && filters.company !== 'All') {
        if (opp.company.toLowerCase() !== filters.company.toLowerCase() && opp.companyId !== filters.company) {
          return false;
        }
      }

      // Location filter
      if (filters.location && filters.location !== 'All') {
        if (!opp.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Work mode
      if (filters.workMode && filters.workMode !== 'All') {
        if (opp.workMode.toLowerCase() !== filters.workMode.toLowerCase()) {
          return false;
        }
      }

      // Employment type
      if (filters.employmentType && filters.employmentType !== 'All') {
        if (opp.employmentType.toLowerCase() !== filters.employmentType.toLowerCase()) {
          return false;
        }
      }

      // Search query
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = opp.title.toLowerCase().includes(q);
        const matchesCompany = opp.company.toLowerCase().includes(q);
        const matchesSkills = opp.skills.some((s) => s.toLowerCase().includes(q));
        const matchesDesc = opp.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCompany && !matchesSkills && !matchesDesc) {
          return false;
        }
      }

      // Minimum match score filter
      if (filters.minMatch > 0) {
        const matchInfo = OpportunityMatchService.calculateMatch(profile, opp);
        if (matchInfo.matchPercentage < filters.minMatch) {
          return false;
        }
      }

      return true;
    });
  }
}
