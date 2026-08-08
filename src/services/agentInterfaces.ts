/**
 * TechPath AI - Agent Interfaces (Conceptual Architecture for Phase 2)
 *
 * These interfaces define the tool calls and responsibility contracts for
 * autonomous/specialized AI agents that will be integrated in future phases.
 */

import { StudentProfile, SkillGap, Roadmap, LearningResource, Project, InterviewQuestion, JobOpportunity } from '../types';

export interface CareerAgent {
  id: 'CareerAgent';
  description: 'Analyzes student engineering background and guides role discovery.';
  getStudentProfile(): Promise<StudentProfile | null>;
  suggestTargetRoles(profile: StudentProfile): Promise<string[]>;
}

export interface SkillGapAgent {
  id: 'SkillGapAgent';
  description: 'Compares student current skills with target company requirements.';
  analyzeSkillGap(profile: StudentProfile, targetRole: string): Promise<SkillGap[]>;
}

export interface ResourceAgent {
  id: 'ResourceAgent';
  description: 'Finds verified course, documentation, and practice resources.';
  searchLearningResources(skills: string[]): Promise<LearningResource[]>;
  searchYouTubeResources(skill: string): Promise<LearningResource[]>;
}

export interface ProjectAgent {
  id: 'ProjectAgent';
  description: 'Generates industry-style project ideas that prove readiness.';
  recommendProjects(profile: StudentProfile, gaps: SkillGap[]): Promise<Project[]>;
}

export interface InterviewAgent {
  id: 'InterviewAgent';
  description: 'Creates role-specific practice questions and mock interview feedback.';
  generateInterviewQuestions(targetRole: string, userSkills: string[]): Promise<InterviewQuestion[]>;
}

export interface JobAgent {
  id: 'JobAgent';
  description: 'Fetches verified job openings from supported ATS systems.';
  searchJobOpportunities(targetRole: string, skills: string[]): Promise<JobOpportunity[]>;
  getCompanyRequirements(companyName: string, roleTitle: string): Promise<string[]>;
}

export interface MentorAgent {
  id: 'MentorAgent';
  description: 'Conversational voice & text career guidance agent (Aira).';
  tools: {
    getStudentProfile: () => Promise<StudentProfile | null>;
    analyzeSkillGap: () => Promise<SkillGap[]>;
    getRoadmap: () => Promise<Roadmap | null>;
    searchLearningResources: (query: string) => Promise<LearningResource[]>;
    searchYouTubeResources: (query: string) => Promise<LearningResource[]>;
    recommendProjects: () => Promise<Project[]>;
    generateInterviewQuestions: () => Promise<InterviewQuestion[]>;
    searchJobOpportunities: () => Promise<JobOpportunity[]>;
    getCompanyRequirements: (company: string, role: string) => Promise<string[]>;
    generateRoadmapPDF: () => Promise<{ success: boolean; message: string }>;
  };
}
