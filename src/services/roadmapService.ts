import {
  Roadmap,
  RoadmapStage,
  RoadmapStep,
  RoadmapStageGroup,
  StudentProfile,
  SkillGap,
  StepStatus,
  PacePreferences,
  SkillProficiency,
} from '../types';
import { SkillGapService } from './skillGapService';
import { CENTRAL_SKILL_DATABASE, CatalogSkill } from '../data/skills';
import { RoadmapProgressService, DEFAULT_PACE } from './roadmapProgressService';

const PROFICIENCY_RANK: Record<SkillProficiency | 'None' | 'Not Started', number> = {
  'Not Started': 0,
  None: 0,
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

export class RoadmapService {
  /**
   * Main Phase 3 Engine: Generates a personalized, dependency-aware, role-aligned learning roadmap.
   */
  static generatePersonalizedRoadmap(
    profile: StudentProfile,
    customGaps?: SkillGap[],
    customPace?: PacePreferences
  ): Roadmap {
    const gaps = customGaps || SkillGapService.calculateSkillGap(profile);
    const progress = RoadmapProgressService.getRoadmapProgress();
    const pace = customPace || progress.pace || DEFAULT_PACE;
    const stepStatuses = progress.stepStatuses || {};

    // Build map of student's current skill levels
    const studentSkillsMap = new Map<string, SkillProficiency>();
    const userSkills = profile.skills || profile.currentSkills || [];
    userSkills.forEach((s) => {
      studentSkillsMap.set(s.name.toLowerCase().trim(), s.proficiency || s.level || 'Beginner');
    });

    const targetRole = profile.targetRole || 'Full Stack Developer';

    // Helper to get catalog skill metadata
    const getCatalogMeta = (skillName: string): CatalogSkill | undefined => {
      return CENTRAL_SKILL_DATABASE.find(
        (cs) => cs.name.toLowerCase().trim() === skillName.toLowerCase().trim()
      );
    };

    // Calculate pace multiplier
    const paceMultiplier =
      pace.preferredPace === 'Relaxed' ? 1.4 : pace.preferredPace === 'Intensive' ? 0.75 : 1.0;

    // Collect all required skills from gaps + role requirements
    const processedSteps: RoadmapStep[] = [];

    // Helper to check if a skill's prerequisites are met by student's current profile or completed steps
    const arePrerequisitesMet = (
      prereqs: string[],
      currentCompletedStepNames: Set<string>
    ): { met: boolean; missing: string[] } => {
      const missing: string[] = [];
      prereqs.forEach((prereq) => {
        const studentLevel = studentSkillsMap.get(prereq.toLowerCase().trim());
        const isCompletedInRoadmap = currentCompletedStepNames.has(prereq.toLowerCase().trim());
        if (!studentLevel && !isCompletedInRoadmap) {
          missing.push(prereq);
        }
      });
      return { met: missing.length === 0, missing };
    };

    const completedSkillNames = new Set<string>();
    // Pre-fill with satisfied skills from student profile
    userSkills.forEach((s) => {
      const currentRank = PROFICIENCY_RANK[s.proficiency || s.level || 'Beginner'];
      if (currentRank >= 2) {
        completedSkillNames.add(s.name.toLowerCase().trim());
      }
    });

    // Step ID counter
    let stepCounter = 1;

    // ==========================================
    // STAGE 1: FOUNDATION
    // ==========================================
    const foundationGaps = gaps.filter(
      (g) =>
        (g.category === 'Programming' || g.category === 'Tools' || g.category === 'Frontend') &&
        (g.priority === 'High' || g.priority === 'HIGH')
    );

    const foundationSteps: RoadmapStep[] = [];
    foundationGaps.forEach((gap) => {
      const meta = getCatalogMeta(gap.skillName);
      const prereqs = meta?.prerequisites || gap.prerequisites || [];
      const prereqCheck = arePrerequisitesMet(prereqs, completedSkillNames);

      const curRank = PROFICIENCY_RANK[gap.currentLevel] || 0;
      const reqRank = PROFICIENCY_RANK[gap.requiredLevel] || 2;

      let titleAction = `Master ${gap.skillName}`;
      let descText = `Build foundational knowledge in ${gap.skillName}.`;

      if (curRank >= reqRank) {
        titleAction = `${gap.skillName} (Already Covered)`;
        descText = `You already meet or exceed the required proficiency (${gap.currentLevel}) for ${targetRole}.`;
      } else if (curRank > 0) {
        titleAction = `Strengthen ${gap.skillName} (${gap.currentLevel} → ${gap.requiredLevel})`;
        descText = `Upgrade your current ${gap.currentLevel} knowledge to ${gap.requiredLevel} to meet ${targetRole} standards.`;
      }

      const stepId = `step_fnd_${stepCounter++}`;
      const savedStatus = stepStatuses[stepId];

      let initialStatus: StepStatus = 'Not Started';
      if (curRank >= reqRank) {
        initialStatus = 'Completed';
        completedSkillNames.add(gap.skillName.toLowerCase().trim());
      } else if (!prereqCheck.met) {
        initialStatus = 'Locked';
      }

      const finalStatus = savedStatus || initialStatus;
      if (finalStatus === 'Completed') {
        completedSkillNames.add(gap.skillName.toLowerCase().trim());
      }

      const weeks = Math.max(1, Math.round(2 * paceMultiplier));

      foundationSteps.push({
        id: stepId,
        title: titleAction,
        stage: 'Foundation',
        stageId: 'stage_1',
        category: gap.category,
        description: descText,
        skillName: gap.skillName,
        skillsToLearn: [gap.skillName, ...(meta?.prerequisites || [])],
        whyItMatters: gap.whyItMatters || `${gap.skillName} provides the core technical foundation required for ${targetRole}.`,
        priority: gap.priority === 'HIGH' ? 'High' : gap.priority === 'LOW' ? 'Low' : (gap.priority as 'High'|'Medium'|'Low'),
        currentLevel: gap.currentLevel,
        requiredLevel: gap.requiredLevel,
        estimatedDuration: `${weeks} week${weeks > 1 ? 's' : ''}`,
        estimatedWeeks: weeks,
        prerequisites: prereqs,
        status: finalStatus,
        isUnlocked: prereqCheck.met || curRank >= reqRank,
        practiceTasks: [
          `Complete 10 hands-on code exercises focusing on ${gap.skillName}.`,
          `Build a simple mini-utility applying ${gap.skillName} core concepts.`,
        ],
        conceptsToLearn: [
          'Syntax and core control flow',
          'Standard library and data structures',
          'Best practices and clean code structure',
        ],
      });
    });

    // Fallback foundation step if student already satisfied all foundation gaps
    if (foundationSteps.length === 0) {
      const stepId = `step_fnd_0`;
      foundationSteps.push({
        id: stepId,
        title: 'Foundational Competency Established',
        stage: 'Foundation',
        stageId: 'stage_1',
        category: 'Foundation',
        description: `Your baseline skills already satisfy the foundational technical requirements for ${targetRole}.`,
        skillName: 'General Fundamentals',
        skillsToLearn: ['Git', 'Command Line', 'Clean Code'],
        whyItMatters: 'Solid foundation verified from your profile.',
        priority: 'Low',
        currentLevel: 'Advanced',
        requiredLevel: 'Intermediate',
        estimatedDuration: '1 week',
        estimatedWeeks: 1,
        prerequisites: [],
        status: stepStatuses[stepId] || 'Completed',
        isUnlocked: true,
        practiceTasks: ['Review foundational repository structures'],
        conceptsToLearn: ['Version control best practices'],
      });
    }

    // ==========================================
    // STAGE 2: CORE SKILLS
    // ==========================================
    const coreGaps = gaps.filter(
      (g) =>
        !foundationSteps.some((fs) => fs.skillName.toLowerCase() === g.skillName.toLowerCase()) &&
        (g.priority === 'High' || g.priority === 'HIGH' || g.category === 'Core' || g.category === 'Backend' || g.category === 'Frontend')
    );

    const coreSteps: RoadmapStep[] = [];
    coreGaps.forEach((gap) => {
      const meta = getCatalogMeta(gap.skillName);
      const prereqs = meta?.prerequisites || gap.prerequisites || [];
      const prereqCheck = arePrerequisitesMet(prereqs, completedSkillNames);

      const curRank = PROFICIENCY_RANK[gap.currentLevel] || 0;
      const reqRank = PROFICIENCY_RANK[gap.requiredLevel] || 2;

      let titleAction = `Learn ${gap.skillName}`;
      let descText = gap.description || `Core operational requirement for ${targetRole}.`;

      if (curRank >= reqRank) {
        titleAction = `${gap.skillName} (Sufficient Proficiency)`;
        descText = `Current level (${gap.currentLevel}) matches core expectation for ${targetRole}.`;
      } else if (curRank > 0) {
        titleAction = `Strengthen ${gap.skillName} (${gap.currentLevel} → ${gap.requiredLevel})`;
      }

      const stepId = `step_core_${stepCounter++}`;
      const savedStatus = stepStatuses[stepId];

      let initialStatus: StepStatus = 'Not Started';
      if (curRank >= reqRank) {
        initialStatus = 'Completed';
        completedSkillNames.add(gap.skillName.toLowerCase().trim());
      } else if (!prereqCheck.met) {
        initialStatus = 'Locked';
      }

      const finalStatus = savedStatus || initialStatus;
      if (finalStatus === 'Completed') {
        completedSkillNames.add(gap.skillName.toLowerCase().trim());
      }

      const weeks = Math.max(1, Math.round(2.5 * paceMultiplier));

      coreSteps.push({
        id: stepId,
        title: titleAction,
        stage: 'Core Skills',
        stageId: 'stage_2',
        category: gap.category,
        description: descText,
        skillName: gap.skillName,
        skillsToLearn: [gap.skillName, ...prereqs],
        whyItMatters: gap.whyItMatters || `${gap.skillName} is a mandatory core competency for ${targetRole} positions.`,
        priority: gap.priority === 'HIGH' ? 'High' : gap.priority === 'LOW' ? 'Low' : (gap.priority as 'High'|'Medium'|'Low'),
        currentLevel: gap.currentLevel,
        requiredLevel: gap.requiredLevel,
        estimatedDuration: `${weeks} week${weeks > 1 ? 's' : ''}`,
        estimatedWeeks: weeks,
        prerequisites: prereqs,
        status: finalStatus,
        isUnlocked: prereqCheck.met || curRank >= reqRank,
        practiceTasks: [
          `Build 2 mini-projects leveraging ${gap.skillName}.`,
          `Practice architectural patterns and error handling in ${gap.skillName}.`,
        ],
        conceptsToLearn: [
          'Core API / Component structures',
          'State management & asynchronous logic',
          'Integration with connected services',
        ],
      });
    });

    // ==========================================
    // STAGE 3: ROLE-SPECIFIC SKILLS
    // ==========================================
    const roleGaps = gaps.filter(
      (g) =>
        !foundationSteps.some((fs) => fs.skillName.toLowerCase() === g.skillName.toLowerCase()) &&
        !coreSteps.some((cs) => cs.skillName.toLowerCase() === g.skillName.toLowerCase())
    );

    const roleSteps: RoadmapStep[] = [];
    roleGaps.forEach((gap) => {
      const meta = getCatalogMeta(gap.skillName);
      const prereqs = meta?.prerequisites || gap.prerequisites || [];
      const prereqCheck = arePrerequisitesMet(prereqs, completedSkillNames);

      const curRank = PROFICIENCY_RANK[gap.currentLevel] || 0;
      const reqRank = PROFICIENCY_RANK[gap.requiredLevel] || 2;

      let titleAction = `Develop ${gap.skillName}`;
      if (curRank >= reqRank) {
        titleAction = `${gap.skillName} (Covered)`;
      } else if (curRank > 0) {
        titleAction = `Advance ${gap.skillName} to ${gap.requiredLevel}`;
      }

      const stepId = `step_role_${stepCounter++}`;
      const savedStatus = stepStatuses[stepId];

      let initialStatus: StepStatus = 'Not Started';
      if (curRank >= reqRank) {
        initialStatus = 'Completed';
      } else if (!prereqCheck.met) {
        initialStatus = 'Locked';
      }

      const finalStatus = savedStatus || initialStatus;
      if (finalStatus === 'Completed') {
        completedSkillNames.add(gap.skillName.toLowerCase().trim());
      }

      const weeks = Math.max(1, Math.round(2 * paceMultiplier));

      roleSteps.push({
        id: stepId,
        title: titleAction,
        stage: 'Role-Specific Skills',
        stageId: 'stage_3',
        category: gap.category,
        description: gap.description || `Specialized requirement for ${targetRole}.`,
        skillName: gap.skillName,
        skillsToLearn: [gap.skillName],
        whyItMatters: gap.whyItMatters || `Distinguishes proficient ${targetRole} candidates during technical interviews.`,
        priority: gap.priority === 'HIGH' ? 'High' : gap.priority === 'LOW' ? 'Low' : (gap.priority as 'High'|'Medium'|'Low'),
        currentLevel: gap.currentLevel,
        requiredLevel: gap.requiredLevel,
        estimatedDuration: `${weeks} week${weeks > 1 ? 's' : ''}`,
        estimatedWeeks: weeks,
        prerequisites: prereqs,
        status: finalStatus,
        isUnlocked: prereqCheck.met || curRank >= reqRank,
        practiceTasks: [`Implement feature module using ${gap.skillName}`],
        conceptsToLearn: ['Industry patterns', 'Production optimizations'],
      });
    });

    // ==========================================
    // STAGE 4: ADVANCED SKILLS
    // ==========================================
    const advStepId = `step_adv_${stepCounter++}`;
    const advWeeks = Math.max(1, Math.round(2 * paceMultiplier));
    const advStep: RoadmapStep = {
      id: advStepId,
      title: `${targetRole} Advanced Engineering Patterns`,
      stage: 'Advanced Skills',
      stageId: 'stage_4',
      category: 'Advanced Architecture',
      description: `Master high-level architectural design, performance tuning, and scalable cloud patterns for ${targetRole}.`,
      skillName: 'Advanced Architecture',
      skillsToLearn: ['System Architecture', 'Performance Tuning', 'Security Hardening'],
      whyItMatters: 'Prepares you for mid-level technical depth and architectural interview questions.',
      priority: 'Medium',
      currentLevel: 'Beginner',
      requiredLevel: 'Advanced',
      estimatedDuration: `${advWeeks} weeks`,
      estimatedWeeks: advWeeks,
      prerequisites: coreSteps.map((s) => s.skillName).slice(0, 2),
      status: stepStatuses[advStepId] || 'Not Started',
      isUnlocked: true,
      practiceTasks: [
        'Perform load testing and bottleneck profiling on a web endpoint',
        'Implement caching layer (Redis / Local Memory) for high-frequency queries',
      ],
      conceptsToLearn: ['Caching strategies', 'Database indexing', 'Asynchronous queues'],
    };

    // ==========================================
    // STAGE 5: PROJECTS
    // ==========================================
    const projStepId = `step_proj_${stepCounter++}`;
    const projWeeks = Math.max(2, Math.round(3 * paceMultiplier));
    const projStep: RoadmapStep = {
      id: projStepId,
      title: `Capstone Showcase Project: Production ${targetRole} App`,
      stage: 'Projects',
      stageId: 'stage_5',
      category: 'Portfolio Project',
      description: `Build and deploy an end-to-end production-quality capstone application showcasing all core skills for ${targetRole}.`,
      skillName: `${targetRole} Capstone Project`,
      skillsToLearn: [targetRole, 'Git & GitHub', 'Deployment'],
      whyItMatters: 'Demonstrates practical, verifiable engineering capability to hiring managers.',
      priority: 'High',
      currentLevel: 'Intermediate',
      requiredLevel: 'Advanced',
      estimatedDuration: `${projWeeks} weeks`,
      estimatedWeeks: projWeeks,
      prerequisites: coreSteps.map((s) => s.skillName).slice(0, 3),
      status: stepStatuses[projStepId] || 'Not Started',
      isUnlocked: true,
      practiceTasks: [
        'Initialize GitHub repository with comprehensive README and setup instructions',
        'Deploy project to live Cloud platform (e.g., Cloud Run, Vercel, AWS)',
        'Record 2-minute video walkthrough demonstrating key user workflows',
      ],
      conceptsToLearn: ['Full lifecycle development', 'CI/CD deployment', 'Documentation & API specs'],
      project: {
        title: `Production-Grade ${targetRole} Capstone`,
        description: `A fully functioning full-stack application featuring authentication, persistent storage, responsive design, and automated deployment.`,
        skillsToLearn: [targetRole, 'Git', 'Deployment'],
      },
    };

    // ==========================================
    // STAGE 6: INTERVIEW PREPARATION
    // ==========================================
    const intStepId = `step_int_${stepCounter++}`;
    const intWeeks = Math.max(1, Math.round(2 * paceMultiplier));
    const intStep: RoadmapStep = {
      id: intStepId,
      title: `${targetRole} Technical & Behavioral Interview Drills`,
      stage: 'Interview Preparation',
      stageId: 'stage_6',
      category: 'Placement Prep',
      description: `Practice core algorithmic problems, role-specific technical questions, and STAR method behavioral answers.`,
      skillName: 'Interview Preparation',
      skillsToLearn: ['Data Structures & Algorithms', 'System Design Basics', 'STAR Behavioral Method'],
      whyItMatters: 'Translates technical skill into confident, structured interview performance.',
      priority: 'High',
      currentLevel: 'Beginner',
      requiredLevel: 'Advanced',
      estimatedDuration: `${intWeeks} weeks`,
      estimatedWeeks: intWeeks,
      prerequisites: ['Capstone Showcase Project'],
      status: stepStatuses[intStepId] || 'Not Started',
      isUnlocked: true,
      practiceTasks: [
        'Solve 15 target role coding problems on algorithms & data structures',
        'Conduct 2 mock technical interviews focusing on system architecture',
        'Prepare 3 STAR-format behavioral stories based on your capstone project',
      ],
      conceptsToLearn: ['Time & Space complexity analysis', 'System design trade-offs', 'Effective communication under pressure'],
    };

    // ==========================================
    // STAGE 7: JOB READINESS
    // ==========================================
    const jobStepId = `step_job_${stepCounter++}`;
    const jobWeeks = Math.max(1, Math.round(1.5 * paceMultiplier));
    const jobStep: RoadmapStep = {
      id: jobStepId,
      title: 'Portfolio Polish & Job Application Strategy',
      stage: 'Job Readiness',
      stageId: 'stage_7',
      category: 'Career Placement',
      description: `Finalize your engineering portfolio, optimize GitHub profile, refine resume keywords, and launch targeted job applications.`,
      skillName: 'Job Readiness',
      skillsToLearn: ['Resume Optimization', 'GitHub Portfolio Polish', 'Cold Outreach'],
      whyItMatters: 'Maximizes interview callbacks and job application response rates.',
      priority: 'High',
      currentLevel: 'Beginner',
      requiredLevel: 'Advanced',
      estimatedDuration: `${jobWeeks} weeks`,
      estimatedWeeks: jobWeeks,
      prerequisites: ['Interview Preparation'],
      status: stepStatuses[jobStepId] || 'Not Started',
      isUnlocked: true,
      practiceTasks: [
        'Audit GitHub profile: add pinned projects, contribution graph, and clean READMEs',
        'Tailor tech resume to highlight skills required for target role',
        'Apply to 10 verified entry-level or internship postings',
      ],
      conceptsToLearn: ['ATS resume parsing', 'Technical networking', 'Offer negotiation basics'],
    };

    // Group steps into 7 distinct Stages
    const stages: RoadmapStageGroup[] = [
      {
        stageId: 'stage_1',
        stageName: 'Foundation',
        stageNumber: 1,
        description: 'Master mandatory syntax, languages, and developer tools.',
        estimatedWeeks: foundationSteps.reduce((acc, s) => acc + s.estimatedWeeks, 0),
        completionPercentage: RoadmapProgressService.calculateCompletionPercentage(foundationSteps, stepStatuses),
        steps: foundationSteps,
      },
      {
        stageId: 'stage_2',
        stageName: 'Core Skills',
        stageNumber: 2,
        description: 'Build core frameworks, APIs, and database fundamentals.',
        estimatedWeeks: coreSteps.reduce((acc, s) => acc + s.estimatedWeeks, 0),
        completionPercentage: RoadmapProgressService.calculateCompletionPercentage(coreSteps, stepStatuses),
        steps: coreSteps,
      },
      {
        stageId: 'stage_3',
        stageName: 'Role-Specific Skills',
        stageNumber: 3,
        description: `Develop specialized tools and libraries for ${targetRole}.`,
        estimatedWeeks: roleSteps.reduce((acc, s) => acc + s.estimatedWeeks, 0),
        completionPercentage: RoadmapProgressService.calculateCompletionPercentage(roleSteps, stepStatuses),
        steps: roleSteps,
      },
      {
        stageId: 'stage_4',
        stageName: 'Advanced Skills',
        stageNumber: 4,
        description: 'Master advanced architecture, caching, and cloud performance.',
        estimatedWeeks: advStep.estimatedWeeks,
        completionPercentage: RoadmapProgressService.calculateCompletionPercentage([advStep], stepStatuses),
        steps: [advStep],
      },
      {
        stageId: 'stage_5',
        stageName: 'Projects',
        stageNumber: 5,
        description: 'Construct a full-stack production capstone for your portfolio.',
        estimatedWeeks: projStep.estimatedWeeks,
        completionPercentage: RoadmapProgressService.calculateCompletionPercentage([projStep], stepStatuses),
        steps: [projStep],
      },
      {
        stageId: 'stage_6',
        stageName: 'Interview Preparation',
        stageNumber: 6,
        description: 'Practice technical problem solving and mock interviews.',
        estimatedWeeks: intStep.estimatedWeeks,
        completionPercentage: RoadmapProgressService.calculateCompletionPercentage([intStep], stepStatuses),
        steps: [intStep],
      },
      {
        stageId: 'stage_7',
        stageName: 'Job Readiness',
        stageNumber: 7,
        description: 'Optimize portfolio, resume, and application pipeline.',
        estimatedWeeks: jobStep.estimatedWeeks,
        completionPercentage: RoadmapProgressService.calculateCompletionPercentage([jobStep], stepStatuses),
        steps: [jobStep],
      },
    ];

    const allSteps = [
      ...foundationSteps,
      ...coreSteps,
      ...roleSteps,
      advStep,
      projStep,
      intStep,
      jobStep,
    ];

    const totalWeeks = stages.reduce((acc, st) => acc + st.estimatedWeeks, 0);
    const overallProgress = RoadmapProgressService.calculateCompletionPercentage(allSteps, stepStatuses);

    return {
      id: `roadmap_${targetRole.toLowerCase().replace(/\s+/g, '_')}_v3`,
      targetRole,
      totalWeeks,
      stages,
      steps: allSteps,
      overallProgress,
    };
  }

  /**
   * Evaluates and returns the "Next Best Action" step.
   * Finds the highest-priority unlocked step that is not yet completed.
   */
  static getNextBestAction(roadmap: Roadmap): {
    step: RoadmapStep;
    why: string;
    actionLabel: string;
  } | null {
    if (!roadmap || !roadmap.steps || roadmap.steps.length === 0) return null;

    // Filter unlocked and incomplete steps
    const unlockedIncomplete = roadmap.steps.filter(
      (s) => s.isUnlocked && s.status !== 'Completed'
    );

    if (unlockedIncomplete.length === 0) {
      // If all unlocked are done or roadmap complete
      const completedCount = roadmap.steps.filter((s) => s.status === 'Completed').length;
      if (completedCount === roadmap.steps.length) {
        return {
          step: roadmap.steps[roadmap.steps.length - 1],
          why: 'You have completed all milestones on your roadmap! Time to apply for target roles.',
          actionLabel: 'Review Portfolio & Job Applications',
        };
      }
      return {
        step: roadmap.steps[0],
        why: 'Start with your foundation milestone to unlock subsequent learning modules.',
        actionLabel: 'Begin Roadmap',
      };
    }

    // Sort by priority (High -> Medium -> Low) then stage
    const nextStep = unlockedIncomplete[0];

    return {
      step: nextStep,
      why: nextStep.whyItMatters || `This step is a core requirement for ${roadmap.targetRole} and unlocks downstream project milestones.`,
      actionLabel: `Continue Learning ${nextStep.skillName}`,
    };
  }

  /**
   * Groups roadmap steps by weekly buckets for the Weekly Plan view.
   */
  static getWeeklyPlan(roadmap: Roadmap): Array<{
    weekNumber: number;
    title: string;
    steps: RoadmapStep[];
  }> {
    const weeklyPlan: Array<{ weekNumber: number; title: string; steps: RoadmapStep[] }> = [];
    let currentWeek = 1;

    roadmap.stages.forEach((stage) => {
      stage.steps.forEach((step) => {
        weeklyPlan.push({
          weekNumber: currentWeek,
          title: `Week ${currentWeek}: ${stage.stageName} — ${step.skillName}`,
          steps: [step],
        });
        currentWeek += step.estimatedWeeks;
      });
    });

    return weeklyPlan;
  }
}
