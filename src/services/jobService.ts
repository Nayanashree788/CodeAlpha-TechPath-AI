/**
 * Job Service Abstraction
 *
 * Designed to connect to supported public career portals and ATS feeds (e.g. Greenhouse, Lever, official company career pages) in future phases.
 * Strictly avoids hardcoding fake live job postings.
 */

import { JobOpportunity } from '../types';

export class JobService {
  /**
   * Fetch verified job opportunities
   */
  static async fetchOpportunities(targetRole: string, userSkills: string[]): Promise<{
    jobs: JobOpportunity[];
    isLiveApi: boolean;
    notice: string;
  }> {
    // Return empty list by default to honor requirement: "Do NOT display fake live job postings."
    return {
      jobs: [],
      isLiveApi: false,
      notice:
        'TechPath will connect to supported public job sources and official company career pages to help you discover relevant opportunities.',
    };
  }

  /**
   * Sample model structure preview (for developer reference and verification)
   */
  static getSampleJobStructure(): JobOpportunity {
    return {
      id: 'job_sample_1',
      company: 'TechCorp Engineering',
      logo: '',
      title: 'Graduate Software Engineer',
      location: 'Bengaluru, India / Hybrid',
      workMode: 'Hybrid',
      employmentType: 'Full-time',
      experience: '0-1 Years / Final Year',
      skills: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'SQL'],
      description: 'Join the core platform engineering team building cloud-native SaaS services.',
      postedDate: new Date().toISOString().split('T')[0],
      source: 'Official Company Career Page',
      officialApplicationUrl: 'https://careers.example.com',
      sourceType: 'Official Portal',
      lastVerified: new Date().toISOString().split('T')[0],
      isLive: false,
    };
  }
}
