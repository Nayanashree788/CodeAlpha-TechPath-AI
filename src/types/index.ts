export * from './Opportunity';

export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Graduate';

export type EngineeringBranch =
  | 'Computer Science'
  | 'Information Science'
  | 'Electronics & Communication'
  | 'Electrical & Electronics'
  | 'Mechanical'
  | 'Civil'
  | 'Other';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export type SkillCategory =
  | 'Programming'
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'AI & Machine Learning'
  | 'Data'
  | 'Cloud'
  | 'DevOps'
  | 'Cybersecurity'
  | 'Tools'
  | 'Other';

export interface StudentSkill {
  id?: string;
  name: string;
  category: SkillCategory | string;
  proficiency: SkillProficiency;
  level?: SkillProficiency; // Alias for proficiency
  isCustom?: boolean;
}

export type LearningFormat = 'Video' | 'Courses' | 'Documentation' | 'Hands-on projects' | 'Mixed';
export type PreferredLanguage = 'English' | 'Kannada' | 'Hindi' | 'Other';
export type CareerPriority =
  | 'Placement preparation'
  | 'Internship'
  | 'First job'
  | 'Skill building'
  | 'Portfolio'
  | 'Higher studies'
  | 'Career exploration';

export interface LearningPreferences {
  formats: LearningFormat[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: PreferredLanguage;
}

export interface StudentProfile {
  id: string;
  name?: string;
  firstName: string;
  lastName?: string;
  email?: string;
  academicYear: AcademicYear;
  branch: EngineeringBranch;
  graduationYear: number;
  skills: StudentSkill[];
  currentSkills?: StudentSkill[]; // Alias for skills
  targetRole: string;
  isCustomRole?: boolean;
  learningPreferences: LearningPreferences;
  careerPriorities: CareerPriority[];
  createdAt?: string;
  updatedAt: string;
}

export interface RoleSkill {
  id?: string;
  name: string;
  category?: string;
  requiredLevel: SkillProficiency;
  description?: string;
  prerequisites?: string[];
}

export interface CareerRole {
  id: string;
  name: string;
  category: string;
  description: string;
  coreSkills: RoleSkill[];
  supportingSkills: RoleSkill[];
  advancedSkills: RoleSkill[];
  frameworkType: 'curated_initial_framework';
}

export interface Role {
  id: string;
  title: string;
  category: string;
  description: string;
  coreSkills: string[];
  recommendedSkills: string[];
  futureSkills: string[];
  industryDemand: 'Very High' | 'High' | 'Moderate';
  avgSalaryRange?: string;
}

export type SkillGapStatus = 'Strong' | 'Developing' | 'Needs attention';

export interface SkillGap {
  skillName: string;
  category: string;
  currentLevel: SkillProficiency | 'None' | 'Not Started';
  requiredLevel: SkillProficiency;
  status: SkillGapStatus;
  priority: 'High' | 'Medium' | 'Low' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  whyItMatters?: string;
  prerequisites?: string[];
  recommendedAction?: string;
}

export type RoadmapStage =
  | 'Foundation'
  | 'Core Skills'
  | 'Role-Specific Skills'
  | 'Advanced Skills'
  | 'Projects'
  | 'Interview Preparation'
  | 'Job Readiness';

export type StepStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Locked';

export interface RoadmapStep {
  id: string;
  title: string;
  stage: RoadmapStage;
  stageId?: string;
  category: string;
  description: string;
  skillId?: string;
  skillName: string;
  skillsToLearn: string[];
  whyItMatters: string;
  priority: 'High' | 'Medium' | 'Low';
  currentLevel: SkillProficiency | 'None' | 'Not Started';
  requiredLevel: SkillProficiency;
  estimatedDuration: string;
  estimatedWeeks: number;
  prerequisites: string[];
  status: StepStatus;
  isUnlocked: boolean;
  practiceTasks: string[];
  conceptsToLearn?: string[];
  project?: {
    title: string;
    description: string;
    skillsToLearn?: string[];
  };
  projectTitle?: string;
  completionStatus?: 'Completed' | 'In Progress' | 'Not Started' | 'Locked';
  resources?: string;
}

export interface RoadmapStageGroup {
  stageId: string;
  stageName: RoadmapStage;
  stageNumber: number;
  description: string;
  estimatedWeeks: number;
  completionPercentage: number;
  steps: RoadmapStep[];
}

export interface PacePreferences {
  hoursPerDay: number;
  daysPerWeek: number;
  preferredPace: 'Relaxed' | 'Balanced' | 'Intensive';
}

export interface RoadmapProgress {
  stepStatuses: Record<string, StepStatus>;
  pace: PacePreferences;
  updatedAt: string;
}

export interface Roadmap {
  id: string;
  targetRole: string;
  totalWeeks: number;
  stages: RoadmapStageGroup[];
  steps: RoadmapStep[];
  overallProgress: number;
}

export type ResourceType = 'Video' | 'Course' | 'Documentation' | 'Practice' | 'Roadmap' | 'Project Learning';
export type ResourceSourceType = 'OFFICIAL' | 'CURATED' | 'LIVE_API';

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  provider: string;
  type: ResourceType;
  skill: string;
  category?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language?: string;
  estimatedDuration: string;
  sourceType: ResourceSourceType;
  targetRoles?: string[];
  tags?: string[];
  lastChecked?: string;
  qualityIndicator?: 'Top Rated' | 'Verified' | 'Community Choice' | 'Official';
  // Optional backward-compatibility fields
  source?: string;
  origin?: 'LIVE RESOURCE' | 'CURATED RESOURCE' | 'MOCK RESOURCE';
  channelTitle?: string;
  videoId?: string;
  publishedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsDemonstrated: string[];
  whyItMatters: string;
  estimatedHours: number;
  industryRelevance: string;
  recommendedStack: string[];
  portfolioValue: 'High' | 'Very High' | 'Moderate';
}

export interface InterviewQuestion {
  id: string;
  title: string;
  category: 'Technical' | 'Behavioral' | 'Role-Specific' | 'System Design';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  hint: string;
  answerOutline: string[];
  targetRole: string;
}

export interface JobOpportunity {
  id: string;
  company: string;
  logo?: string;
  title: string;
  location: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  employmentType: 'Full-time' | 'Internship';
  experience: string;
  skills: string[];
  description: string;
  postedDate: string;
  source: string;
  officialApplicationUrl: string;
  sourceType: 'Greenhouse' | 'Lever' | 'Official Portal' | 'Public API';
  lastVerified: string;
  isLive?: boolean;
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  status?: 'sent' | 'thinking' | 'speaking';
  isAiGenerated?: boolean;
  modelUsed?: string;
}

export interface MentorContext {
  studentProfile: {
    firstName: string;
    academicYear: AcademicYear;
    branch: EngineeringBranch;
    graduationYear: number;
    targetRole: string;
    learningPreferences: LearningPreferences;
    careerPriorities: CareerPriority[];
  };
  currentSkills: StudentSkill[];
  targetRole: string;
  skillGaps: {
    skillName: string;
    category?: string;
    currentLevel: string;
    requiredLevel: string;
    status: string;
    priority: string;
  }[];
  roadmapProgress: {
    overallProgressPercentage: number;
    completedStepsCount: number;
    totalStepsCount: number;
    currentStageName: string;
  };
  currentRoadmapStep?: {
    title: string;
    skillName: string;
    stage: string;
    requiredLevel: string;
  };
  learningPreferences: LearningPreferences;
  careerPriorities: CareerPriority[];
  savedResources: string[];
  completedResources?: string[];
}
