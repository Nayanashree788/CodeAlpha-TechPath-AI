/**
 * AI Service Integration-Ready Abstraction
 *
 * Designed to connect to Gemini API (and Gemini Live API) in Phase 2.
 * Includes explicit indicators distinguishing development mock responses from live AI outputs.
 */

import {
  StudentProfile,
  SkillGap,
  MentorMessage,
  MentorContext,
  Roadmap,
  RoadmapProgress,
  InterviewQuestion,
} from '../types';
import { SkillGapService } from './skillGapService';

export interface AIServiceConfig {
  apiKey?: string;
  modelName?: string;
}

export class AIService {
  private static config: AIServiceConfig = {
    apiKey: process.env.GEMINI_API_KEY || '',
    modelName: 'gemini-2.5-flash',
  };

  /**
   * Check if Gemini API key is available in environment
   */
  static isConfigured(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  /**
   * Build structured MentorContext from app state
   */
  static buildMentorContext(
    profile: StudentProfile,
    skillGaps: SkillGap[],
    roadmap: Roadmap,
    roadmapProgress: RoadmapProgress,
    savedResources: string[] = []
  ): MentorContext {
    const stepsList = roadmap?.steps || [];
    const stagesList = roadmap?.stages || [];
    const activeStep =
      stepsList.find((s) => String(s.status).toLowerCase() === 'in progress') ||
      stepsList.find((s) => String(s.status).toLowerCase() !== 'completed');
    const completedStepsCount = stepsList.filter((s) => String(s.status).toLowerCase() === 'completed').length;
    const currentStage =
      stagesList.find((stg) => (stg.steps || []).some((s) => String(s.status).toLowerCase() === 'in progress')) ||
      stagesList.find((stg) => stg.completionPercentage < 100) ||
      stagesList[0];

    return {
      studentProfile: {
        firstName: profile.firstName || 'Student',
        academicYear: profile.academicYear,
        branch: profile.branch,
        graduationYear: profile.graduationYear,
        targetRole: profile.targetRole || 'Full Stack Developer',
        learningPreferences: profile.learningPreferences,
        careerPriorities: profile.careerPriorities || [],
      },
      currentSkills: profile.skills || [],
      targetRole: profile.targetRole || 'Full Stack Developer',
      skillGaps: (skillGaps || []).map((g) => ({
        skillName: g.skillName,
        category: g.category,
        currentLevel: g.currentLevel,
        requiredLevel: g.requiredLevel,
        status: g.status,
        priority: String(g.priority),
      })),
      roadmapProgress: {
        overallProgressPercentage: roadmap?.overallProgress || 0,
        completedStepsCount,
        totalStepsCount: roadmap?.steps?.length || 0,
        currentStageName: currentStage ? currentStage.stageName : 'Foundation',
      },
      currentRoadmapStep: activeStep
        ? {
            title: activeStep.title,
            skillName: activeStep.skillName,
            stage: activeStep.stage,
            requiredLevel: activeStep.requiredLevel,
          }
        : undefined,
      learningPreferences: profile.learningPreferences,
      careerPriorities: profile.careerPriorities || [],
      savedResources: savedResources || [],
    };
  }

  /**
   * Generate AI Mentor Response via server-side Gemini 3.6 Flash API
   */
  static async generateMentorResponse(
    userMessage: string,
    history: MentorMessage[],
    context: MentorContext,
    isVoiceMode: boolean = false
  ): Promise<{ response: string; isAiGenerated: boolean; modelUsed?: string }> {
    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          history,
          context,
          isVoiceMode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          response: data.response,
          isAiGenerated: Boolean(data.isAiGenerated),
          modelUsed: data.modelUsed || 'gemini-3.6-flash',
        };
      }
    } catch (error) {
      console.warn('Failed to fetch from /api/mentor/chat, using context-aware fallback:', error);
    }

    // Fallback response generator if API route is unreachable
    return AIService.generateLocalContextFallback(userMessage, context, isVoiceMode);
  }

  /**
   * Legacy wrapper for backward compatibility
   */
  static async getMentorResponse(
    userMessage: string,
    history: MentorMessage[],
    profile: StudentProfile
  ): Promise<{ response: string; isAiGenerated: boolean }> {
    const dummyContext: MentorContext = {
      studentProfile: {
        firstName: profile.firstName || 'Student',
        academicYear: profile.academicYear,
        branch: profile.branch,
        graduationYear: profile.graduationYear,
        targetRole: profile.targetRole || 'Full Stack Developer',
        learningPreferences: profile.learningPreferences,
        careerPriorities: profile.careerPriorities || [],
      },
      currentSkills: profile.skills || [],
      targetRole: profile.targetRole || 'Full Stack Developer',
      skillGaps: [],
      roadmapProgress: {
        overallProgressPercentage: 0,
        completedStepsCount: 0,
        totalStepsCount: 0,
        currentStageName: 'Foundation',
      },
      learningPreferences: profile.learningPreferences,
      careerPriorities: profile.careerPriorities || [],
      savedResources: [],
    };

    return AIService.generateMentorResponse(userMessage, history, dummyContext);
  }

  /**
   * Deterministic Fallback Generator tailored to student context
   */
  private static generateLocalContextFallback(
    userMessage: string,
    context: MentorContext,
    isVoiceMode: boolean = false
  ): { response: string; isAiGenerated: boolean; modelUsed: string } {
    const lower = userMessage.toLowerCase();
    const target = context.targetRole || 'Engineering Professional';
    const name = context.studentProfile?.firstName || 'Student';
    const topGap = context.skillGaps?.find((g) => g.priority.toUpperCase() === 'HIGH')?.skillName || 'core frameworks';
    const stage = context.roadmapProgress?.currentStageName || 'Core Skills';

    if (isVoiceMode) {
      if (lower.includes('project') || lower.includes('portfolio') || lower.includes('capstone')) {
        return {
          response: `Hi ${name}! For your ${target} goal, build a capstone project focusing on ${topGap}. Connect a React frontend to an Express API with a cloud database. This directly proves your full stack capability to recruiters!`,
          isAiGenerated: false,
          modelUsed: 'Context-Aware Fallback Engine',
        };
      }
      if (lower.includes('interview') || lower.includes('placement') || lower.includes('campus')) {
        return {
          response: `Hello ${name}! For campus placements as a ${target}, focus on three things: practice 20 medium LeetCode questions, bridge your ${topGap} skill gap, and prepare STAR behavioral stories about your projects.`,
          isAiGenerated: false,
          modelUsed: 'Context-Aware Fallback Engine',
        };
      }
      return {
        response: `Hi ${name}! You are currently in the ${stage} stage with ${context.roadmapProgress.overallProgressPercentage}% roadmap progress. Your top priority right now is mastering ${topGap}. How can I assist you further?`,
        isAiGenerated: false,
        modelUsed: 'Context-Aware Fallback Engine',
      };
    }

    let advice = '';

    if (lower.includes('project') || lower.includes('portfolio') || lower.includes('capstone')) {
      advice = `Hi ${name}! As an aspiring **${target}**, I strongly recommend building a production-grade capstone project focusing on your top skill gap: **${topGap}**.

**Recommended Capstone Blueprint:**
1. **Frontend:** Clean React SPA with responsive Tailwind styling and client-side routing.
2. **Backend Service:** RESTful Express server handling auth, CRUD operations, and error middleware.
3. **Persistence:** Connect a real cloud or local database (PostgreSQL/Firestore) with indexed schemas.
4. **Deployment:** Host on Cloud Run / Vercel with GitHub CI/CD actions.

This directly demonstrates to hiring managers that you understand full lifecycle development!`;
    } else if (lower.includes('interview') || lower.includes('placement') || lower.includes('campus')) {
      advice = `Hello ${name}! For **${target}** campus placement prep in your **${context.studentProfile.academicYear}**, focus on these 4 pillars:

1. **Data Structures & Algorithms:** Solve 20-30 core LeetCode medium questions (Arrays, Trees, Graphs, Dynamic Programming).
2. **Core Domain Mastery:** Deepen your knowledge in **${topGap}** and system architecture basics.
3. **Project Deep-Dive:** Be prepared to explain architectural trade-offs and database schema choices for your capstone project.
4. **Behavioral STAR Stories:** Prepare 3 stories demonstrating leadership, debugging under pressure, and teamwork.`;
    } else if (lower.includes('roadmap') || lower.includes('progress') || lower.includes('next')) {
      advice = `Great question, ${name}! You are currently at **${context.roadmapProgress.overallProgressPercentage}%** roadmap completion, active in the **${stage}** stage.

**Your Immediate Next Priorities:**
• Focus on mastering **${topGap}** required for ${target}.
• Complete practice tasks for your current roadmap step: *${context.currentRoadmapStep?.title || topGap}*.
• Review recommended learning resources on TechPath AI for hands-on tutorials.`;
    } else {
      advice = `Hello ${name}! As your AI Career Mentor on TechPath AI, I'm here to guide your transition into a **${target}** role.

Based on your profile, you are currently in your **${context.studentProfile.academicYear} (${context.studentProfile.branch})**. Your primary focus right now should be addressing your priority skill gap in **${topGap}** while progressing through your **${stage}** roadmap.

Feel free to ask me about:
1. Specific learning strategies for **${topGap}**
2. Tailored capstone project ideas
3. Campus placement & interview preparation tips
4. Resume optimization strategies for **${target}** roles!`;
    }

    return {
      response: advice,
      isAiGenerated: false,
      modelUsed: 'Context-Aware Fallback Engine',
    };
  }

  /**
   * Deterministic Skill Gap Analysis
   */
  static async generateSkillGapAnalysis(profile: StudentProfile): Promise<{
    gaps: SkillGap[];
    readinessScore: number;
    summary: string;
    isAiGenerated: boolean;
  }> {
    const gaps = SkillGapService.calculateSkillGap(profile);
    const coverage = SkillGapService.calculateInitialCoverage(profile);

    return {
      gaps,
      readinessScore: coverage.coveragePercentage,
      summary: `Initial skill coverage analysis calculated for ${profile.firstName || 'Student'} for target role: ${profile.targetRole || 'Full Stack Developer'}.`,
      isAiGenerated: false,
    };
  }
}

