/**
 * Resource Service
 * Manages resource querying, deterministic recommendation ranking, filtering, search,
 * format preference prioritization, and language matching.
 */

import { LearningResource, ResourceType, ResourceSourceType, StudentProfile } from '../types';
import { RESOURCES_DATABASE } from '../data/resources';
import { YouTubeService } from './youtubeService';

export interface ResourceFilterOptions {
  skill?: string;
  type?: ResourceType | 'All';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All';
  language?: string;
  sourceType?: ResourceSourceType | 'All';
}

export interface PersonalizedRecommendationResult {
  nextSkill: string;
  skillWhyItMatters: string;
  recommendedResources: LearningResource[];
  languageNotice?: string;
  formatNotice?: string;
}

export class ResourceService {
  /**
   * Get all resources from database
   */
  static getAllResources(): LearningResource[] {
    return RESOURCES_DATABASE;
  }

  /**
   * Search resources by title, skill, provider, or tags
   */
  static searchResources(query: string): LearningResource[] {
    if (!query || !query.trim()) return RESOURCES_DATABASE;

    const term = query.trim().toLowerCase();
    return RESOURCES_DATABASE.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        r.skill.toLowerCase().includes(term) ||
        r.provider.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        r.tags?.some((t) => t.toLowerCase().includes(term))
    );
  }

  /**
   * Filter resources by skill, type, difficulty, language, or sourceType
   */
  static filterResources(
    resources: LearningResource[],
    options: ResourceFilterOptions
  ): LearningResource[] {
    return resources.filter((r) => {
      if (options.skill && options.skill !== 'All') {
        const matchesSkill =
          r.skill.toLowerCase().includes(options.skill.toLowerCase()) ||
          options.skill.toLowerCase().includes(r.skill.toLowerCase());
        if (!matchesSkill) return false;
      }

      if (options.type && options.type !== 'All') {
        if (r.type !== options.type) return false;
      }

      if (options.difficulty && options.difficulty !== 'All') {
        if (r.difficulty !== options.difficulty) return false;
      }

      if (options.sourceType && options.sourceType !== 'All') {
        if (r.sourceType !== options.sourceType) return false;
      }

      if (options.language && options.language !== 'All') {
        if (r.language && r.language.toLowerCase() !== options.language.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Get resources specifically for a skill
   */
  static getResourcesForSkill(skillName: string): LearningResource[] {
    if (!skillName) return [];
    const lower = skillName.toLowerCase();

    // 1. Check exact/partial skill matches in catalog
    const catalogMatches = RESOURCES_DATABASE.filter(
      (r) =>
        r.skill.toLowerCase().includes(lower) ||
        lower.includes(r.skill.toLowerCase()) ||
        r.tags?.some((t) => t.toLowerCase().includes(lower))
    );

    if (catalogMatches.length > 0) {
      return catalogMatches;
    }

    // 2. Fallback YouTube curated resource
    return YouTubeService.getYouTubeResources(skillName);
  }

  /**
   * Get resources for a target role
   */
  static getResourcesForRole(roleName: string): LearningResource[] {
    if (!roleName) return RESOURCES_DATABASE;
    const lowerRole = roleName.toLowerCase();

    return RESOURCES_DATABASE.filter((r) =>
      r.targetRoles?.some((tr) => tr.toLowerCase().includes(lowerRole) || lowerRole.includes(tr.toLowerCase()))
    );
  }

  /**
   * Get personalized recommendations tailored to a student's profile, next roadmap skill, and learning preferences
   */
  static getPersonalizedRecommendations(
    profile: StudentProfile,
    nextSkillName: string = 'React'
  ): PersonalizedRecommendationResult {
    const skillName = nextSkillName || 'Software Engineering Fundamentals';
    const preferredFormat = profile.learningPreferences?.formats?.[0] || 'Mixed';
    const preferredLang = profile.learningPreferences?.language || 'English';

    // 1. Fetch all resources matching the next skill or target role
    let candidateResources = this.getResourcesForSkill(skillName);

    if (candidateResources.length === 0) {
      candidateResources = this.getResourcesForRole(profile.targetRole);
    }

    if (candidateResources.length === 0) {
      candidateResources = RESOURCES_DATABASE;
    }

    // 2. Check language availability
    let languageNotice: string | undefined;
    const langMatches = candidateResources.filter(
      (r) => r.language && r.language.toLowerCase() === preferredLang.toLowerCase()
    );

    if (preferredLang !== 'English' && langMatches.length === 0) {
      languageNotice = `Showing verified resources in English because additional localized content for ${preferredLang} is currently being curated.`;
    }

    // 3. Sort candidates according to learning format preference
    const rankedResources = [...candidateResources].sort((a, b) => {
      // Prioritize OFFICIAL sources first
      if (a.sourceType === 'OFFICIAL' && b.sourceType !== 'OFFICIAL') return -1;
      if (b.sourceType === 'OFFICIAL' && a.sourceType !== 'OFFICIAL') return 1;

      // Format preference sorting
      if (preferredFormat === 'Video') {
        if (a.type === 'Video' && b.type !== 'Video') return -1;
        if (b.type === 'Video' && a.type !== 'Video') return 1;
      } else if (preferredFormat === 'Documentation') {
        if (a.type === 'Documentation' && b.type !== 'Documentation') return -1;
        if (b.type === 'Documentation' && a.type !== 'Documentation') return 1;
      } else if (preferredFormat === 'Hands-on projects') {
        if (a.type === 'Practice' && b.type !== 'Practice') return -1;
        if (b.type === 'Practice' && a.type !== 'Practice') return 1;
      } else if (preferredFormat === 'Courses') {
        if (a.type === 'Course' && b.type !== 'Course') return -1;
        if (b.type === 'Course' && a.type !== 'Course') return 1;
      }

      return 0;
    });

    // Role-specific explanation
    const skillWhyItMatters = `Mastering ${skillName} is crucial for your career goal as a ${profile.targetRole}. It bridges your top skill gap and advances your personalized learning path.`;

    return {
      nextSkill: skillName,
      skillWhyItMatters,
      recommendedResources: rankedResources.slice(0, 6),
      languageNotice,
      formatNotice:
        preferredFormat !== 'Mixed'
          ? `Prioritizing ${preferredFormat} resources based on your onboarding learning style preference.`
          : undefined,
    };
  }
}
