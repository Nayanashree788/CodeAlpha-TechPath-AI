import { StudentProfile, StudentSkill } from '../types';
import { Opportunity, SkillMatchBreakdown } from '../types/Opportunity';

export class OpportunityMatchService {
  /**
   * Calculates a deterministic skill match percentage and breakdown for an opportunity.
   */
  public static calculateMatch(
    studentProfile: StudentProfile,
    opportunity: Opportunity
  ): SkillMatchBreakdown {
    const requiredSkills = opportunity.skills || [];
    if (requiredSkills.length === 0) {
      return {
        matchPercentage: 70,
        existingSkills: [],
        developingSkills: [],
        missingSkills: [],
        disclaimerText:
          'TechPath Skill Match — Algorithmic estimate based on your profile skills & target role alignment. Not an official employer screening score.',
      };
    }

    const studentSkillsMap = new Map<string, StudentSkill>();
    (studentProfile.skills || []).forEach((s) => {
      studentSkillsMap.set(s.name.toLowerCase().trim(), s);
    });

    const existingSkills: string[] = [];
    const developingSkills: string[] = [];
    const missingSkills: string[] = [];

    let score = 0;

    requiredSkills.forEach((reqSkillName) => {
      const normalizedReq = reqSkillName.toLowerCase().trim();
      let matchedSkillKey: string | undefined;

      // Fuzzy match or exact match
      for (const [key] of studentSkillsMap.entries()) {
        if (key === normalizedReq || key.includes(normalizedReq) || normalizedReq.includes(key)) {
          matchedSkillKey = key;
          break;
        }
      }

      if (matchedSkillKey) {
        const studentSkill = studentSkillsMap.get(matchedSkillKey)!;
        const level = studentSkill.proficiency || studentSkill.level || 'Beginner';

        if (level === 'Advanced' || level === 'Intermediate') {
          existingSkills.push(reqSkillName);
          score += 1.0;
        } else {
          developingSkills.push(reqSkillName);
          score += 0.5;
        }
      } else {
        missingSkills.push(reqSkillName);
      }
    });

    // Base skill match percentage
    let rawPercentage = Math.round((score / requiredSkills.length) * 100);

    // Give bonus if target role aligns with opportunity role category or title
    const targetRoleLower = (studentProfile.targetRole || '').toLowerCase();
    const oppTitleLower = (opportunity.title || '').toLowerCase();
    const oppCategoryLower = (opportunity.roleCategory || '').toLowerCase();

    if (
      oppTitleLower.includes(targetRoleLower) ||
      targetRoleLower.includes(oppTitleLower) ||
      oppCategoryLower.includes(targetRoleLower)
    ) {
      rawPercentage = Math.min(100, rawPercentage + 10);
    }

    // Clamp between 30% and 98% for realistic feedback
    const matchPercentage = Math.max(30, Math.min(98, rawPercentage));

    return {
      matchPercentage,
      existingSkills,
      developingSkills,
      missingSkills,
      disclaimerText:
        'TechPath Skill Match — Algorithmic estimate based on your profile skills & target role alignment. Not an official employer screening score.',
    };
  }

  /**
   * Helper to check target role readiness level.
   */
  public static getReadinessSummary(profile: StudentProfile): {
    levelText: string;
    levelColor: string;
    description: string;
    targetRoleRoles: string[];
  } {
    const skillsCount = (profile.skills || []).length;
    const targetRole = profile.targetRole || 'Software Engineer';

    let levelText = 'Developing Foundation';
    let levelColor = 'text-amber-600 bg-amber-50 border-amber-200';
    let description =
      'You are building core competencies. Focus on completing roadmap projects before targeting high-tier roles.';

    if (skillsCount >= 6) {
      levelText = 'Strong Readiness';
      levelColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      description =
        'Your profile shows strong skill coverage. You are ready to explore graduate roles and competitive internships.';
    } else if (skillsCount >= 3) {
      levelText = 'Intermediate Progress';
      levelColor = 'text-indigo-700 bg-indigo-50 border-indigo-200';
      description =
        'Good foundational skills established. Continue completing core roadmap modules to unlock specialized engineering roles.';
    }

    const targetRoleRoles = [
      `${targetRole}`,
      `Junior ${targetRole}`,
      `${targetRole} Intern`,
      'Associate Software Engineer',
    ];

    return { levelText, levelColor, description, targetRoleRoles };
  }
}
