import { StudentProfile, StudentSkill, SkillGap, SkillGapStatus, SkillProficiency } from '../types';
import { CAREER_ROLES_DATABASE, getRoleByName } from '../data/roles';
import { CENTRAL_SKILL_DATABASE } from '../data/skills';

const PROFICIENCY_VALUES: Record<SkillProficiency | 'None' | 'Not Started', number> = {
  'Not Started': 0,
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export class SkillGapService {
  /**
   * Deterministically calculates skill gaps for a student profile against their chosen target role.
   */
  static calculateSkillGap(profile: StudentProfile): SkillGap[] {
    const roleName = profile.targetRole || 'Full Stack Developer';
    const matchedRole = getRoleByName(roleName) || CAREER_ROLES_DATABASE[0];

    const studentSkillsMap = new Map<string, SkillProficiency>();
    const userSkills = profile.skills || profile.currentSkills || [];
    userSkills.forEach((s) => {
      studentSkillsMap.set(s.name.toLowerCase().trim(), s.proficiency || s.level || 'Beginner');
    });

    const gaps: SkillGap[] = [];

    // Process Core Skills
    matchedRole.coreSkills.forEach((core) => {
      const currentLevel = studentSkillsMap.get(core.name.toLowerCase().trim()) || 'Not Started';
      const status = SkillGapService.calculateSkillStatus(currentLevel, core.requiredLevel);
      const priority = SkillGapService.calculatePriority(true, false, currentLevel, core.requiredLevel);
      const catalogSkill = CENTRAL_SKILL_DATABASE.find((cs) => cs.name.toLowerCase() === core.name.toLowerCase());

      gaps.push({
        skillName: core.name,
        category: catalogSkill?.category || 'Core',
        currentLevel,
        requiredLevel: core.requiredLevel,
        status,
        priority,
        description: core.description || `Required core skill for ${matchedRole.name}.`,
        whyItMatters: core.description || `${core.name} is a fundamental expectation for ${matchedRole.name} roles in modern engineering teams.`,
        prerequisites: catalogSkill?.prerequisites || [],
        recommendedAction:
          status === 'Strong'
            ? 'Maintain competency with hands-on practice projects.'
            : status === 'Developing'
            ? `Upgrade from ${currentLevel} to ${core.requiredLevel} through targeted exercises.`
            : `Start learning foundational concepts for ${core.name}.`,
      });
    });

    // Process Supporting Skills
    matchedRole.supportingSkills.forEach((supp) => {
      const currentLevel = studentSkillsMap.get(supp.name.toLowerCase().trim()) || 'Not Started';
      const status = SkillGapService.calculateSkillStatus(currentLevel, supp.requiredLevel);
      const priority = SkillGapService.calculatePriority(false, true, currentLevel, supp.requiredLevel);
      const catalogSkill = CENTRAL_SKILL_DATABASE.find((cs) => cs.name.toLowerCase() === supp.name.toLowerCase());

      gaps.push({
        skillName: supp.name,
        category: catalogSkill?.category || 'Supporting',
        currentLevel,
        requiredLevel: supp.requiredLevel,
        status,
        priority,
        description: supp.description || `Supporting skill for ${matchedRole.name}.`,
        whyItMatters: supp.description || `Supports daily workflow tasks for ${matchedRole.name}.`,
        prerequisites: catalogSkill?.prerequisites || [],
        recommendedAction:
          status === 'Strong'
            ? 'Solid proficiency established.'
            : `Build practical familiarity with ${supp.name}.`,
      });
    });

    // Process Advanced Skills
    matchedRole.advancedSkills.forEach((adv) => {
      const currentLevel = studentSkillsMap.get(adv.name.toLowerCase().trim()) || 'Not Started';
      const status = SkillGapService.calculateSkillStatus(currentLevel, adv.requiredLevel);
      const priority = SkillGapService.calculatePriority(false, false, currentLevel, adv.requiredLevel);
      const catalogSkill = CENTRAL_SKILL_DATABASE.find((cs) => cs.name.toLowerCase() === adv.name.toLowerCase());

      gaps.push({
        skillName: adv.name,
        category: catalogSkill?.category || 'Advanced',
        currentLevel,
        requiredLevel: adv.requiredLevel,
        status,
        priority,
        description: adv.description || `Advanced differentiator skill for ${matchedRole.name}.`,
        whyItMatters: adv.description || `Provides a competitive edge for ${matchedRole.name} interview candidates.`,
        prerequisites: catalogSkill?.prerequisites || [],
        recommendedAction:
          status === 'Strong'
            ? 'Strong bonus differentiator.'
            : `Schedule for later learning phases once core gaps are closed.`,
      });
    });

    return gaps;
  }

  /**
   * Deterministically calculates status based on current level vs required level.
   */
  static calculateSkillStatus(
    current: SkillProficiency | 'None' | 'Not Started',
    required: SkillProficiency
  ): SkillGapStatus {
    const currentVal = PROFICIENCY_VALUES[current] || 0;
    const requiredVal = PROFICIENCY_VALUES[required] || 1;

    if (currentVal >= requiredVal) {
      return 'Strong';
    } else if (currentVal > 0 && currentVal < requiredVal) {
      return 'Developing';
    } else {
      return 'Needs attention';
    }
  }

  /**
   * Deterministically calculates priority.
   */
  static calculatePriority(
    isCore: boolean,
    isSupporting: boolean,
    current: SkillProficiency | 'None' | 'Not Started',
    required: SkillProficiency
  ): 'High' | 'Medium' | 'Low' {
    const currentVal = PROFICIENCY_VALUES[current] || 0;
    const requiredVal = PROFICIENCY_VALUES[required] || 1;

    if (isCore && (currentVal === 0 || requiredVal - currentVal >= 2)) {
      return 'High';
    }
    if (isCore && currentVal < requiredVal) {
      return 'High';
    }
    if (isSupporting && currentVal === 0) {
      return 'Medium';
    }
    if (isSupporting && currentVal < requiredVal) {
      return 'Medium';
    }
    return 'Low';
  }

  static getMissingSkills(profile: StudentProfile): SkillGap[] {
    return SkillGapService.calculateSkillGap(profile).filter((g) => g.status === 'Needs attention');
  }

  static getStrongSkills(profile: StudentProfile): SkillGap[] {
    return SkillGapService.calculateSkillGap(profile).filter((g) => g.status === 'Strong');
  }

  static getDevelopingSkills(profile: StudentProfile): SkillGap[] {
    return SkillGapService.calculateSkillGap(profile).filter((g) => g.status === 'Developing');
  }

  /**
   * Calculates "Initial Skill Coverage" percentage and statistics.
   * Clearly distinguished as initial coverage against role framework, NOT hiring prediction.
   */
  static calculateInitialCoverage(profile: StudentProfile) {
    const gaps = SkillGapService.calculateSkillGap(profile);
    const total = gaps.length || 1;

    let totalScore = 0;
    let maxScore = 0;

    gaps.forEach((g) => {
      const cur = PROFICIENCY_VALUES[g.currentLevel] || 0;
      const req = PROFICIENCY_VALUES[g.requiredLevel] || 1;
      // Core skill weighted higher in initial calculation
      const weight = g.priority === 'High' ? 1.5 : g.priority === 'Medium' ? 1.0 : 0.75;
      totalScore += Math.min(cur / req, 1.0) * weight;
      maxScore += weight;
    });

    const coveragePercentage = Math.min(Math.round((totalScore / maxScore) * 100), 100);
    const strongCount = gaps.filter((g) => g.status === 'Strong').length;
    const developingCount = gaps.filter((g) => g.status === 'Developing').length;
    const missingCount = gaps.filter((g) => g.status === 'Needs attention').length;

    return {
      coveragePercentage,
      strongCount,
      developingCount,
      missingCount,
      totalAssessed: total,
    };
  }
}
