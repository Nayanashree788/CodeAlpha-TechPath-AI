import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  Roadmap,
  SkillGap,
  MentorMessage,
  StepStatus,
  PacePreferences,
  RoadmapProgress,
} from '../types';
import { AuthService, DEFAULT_PROFILE } from '../services/authService';
import { RoadmapService } from '../services/roadmapService';
import { SkillGapService } from '../services/skillGapService';
import { RoadmapProgressService } from '../services/roadmapProgressService';
import { AIService } from '../services/aiService';

interface AppContextType {
  currentPath: string;
  navigate: (path: string) => void;
  profile: StudentProfile;
  updateProfile: (profile: StudentProfile) => Promise<void>;
  roadmap: Roadmap;
  skillGaps: SkillGap[];
  roadmapProgress: RoadmapProgress;
  updateStepStatus: (stepId: string, status: StepStatus) => void;
  updatePacePreferences: (pace: PacePreferences) => void;
  resetRoadmapProgress: () => void;
  mentorMessages: MentorMessage[];
  addMentorMessage: (text: string) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetToDefaults: () => Promise<void>;
  isVoiceModeOpen: boolean;
  voiceInitialPrompt?: string;
  openVoiceMode: (initialPrompt?: string) => void;
  closeVoiceMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [roadmapProgress, setRoadmapProgress] = useState<RoadmapProgress>(
    RoadmapProgressService.getRoadmapProgress()
  );
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [roadmap, setRoadmap] = useState<Roadmap>(() =>
    RoadmapService.generatePersonalizedRoadmap(DEFAULT_PROFILE, [], roadmapProgress.pace)
  );

  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState<boolean>(false);
  const [voiceInitialPrompt, setVoiceInitialPrompt] = useState<string | undefined>(undefined);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([
    {
      id: 'm_init_1',
      sender: 'assistant',
      text: 'Hello! I am Aira, your AI Career Mentor. I am here to guide your skill development, answer roadmap questions, and help you prepare for engineering roles.',
      timestamp: '09:00 AM',
    },
  ]);

  // Load profile from authService on initial mount
  useEffect(() => {
    AuthService.getCurrentProfile().then((p) => {
      setProfile(p);
      refreshSkillGapsAndRoadmap(p);
    });
  }, []);

  const refreshSkillGapsAndRoadmap = (
    p: StudentProfile,
    progressOverride?: RoadmapProgress
  ) => {
    const gaps = SkillGapService.calculateSkillGap(p);
    setSkillGaps(gaps);
    const prog = progressOverride || RoadmapProgressService.getRoadmapProgress();
    setRoadmapProgress(prog);
    const generated = RoadmapService.generatePersonalizedRoadmap(p, gaps, prog.pace);
    setRoadmap(generated);
  };

  const updateStepStatus = (stepId: string, status: StepStatus) => {
    const updatedProg = RoadmapProgressService.updateStepStatus(stepId, status);
    setRoadmapProgress(updatedProg);
    refreshSkillGapsAndRoadmap(profile, updatedProg);
    showToast(`Step status updated to "${status}"`);
  };

  const updatePacePreferences = (pace: PacePreferences) => {
    const updatedProg = RoadmapProgressService.updatePacePreferences(pace);
    setRoadmapProgress(updatedProg);
    refreshSkillGapsAndRoadmap(profile, updatedProg);
    showToast(`Learning pace updated to ${pace.preferredPace} (${pace.hoursPerDay}h/day, ${pace.daysPerWeek}d/week)`);
  };

  const resetRoadmapProgress = () => {
    RoadmapProgressService.resetProgress();
    const freshProg = RoadmapProgressService.getRoadmapProgress();
    setRoadmapProgress(freshProg);
    refreshSkillGapsAndRoadmap(profile, freshProg);
    showToast('Roadmap progress reset.');
  };

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = async (newProfile: StudentProfile) => {
    const saved = await AuthService.saveProfile(newProfile);
    setProfile(saved);
    refreshSkillGapsAndRoadmap(saved);
  };

  const resetToDefaults = async () => {
    await AuthService.clearProfile();
    setProfile(DEFAULT_PROFILE);
    resetRoadmapProgress();
    refreshSkillGapsAndRoadmap(DEFAULT_PROFILE);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addMentorMessage = async (userText: string) => {
    const userMsg: MentorMessage = {
      id: 'msg_u_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...mentorMessages, userMsg];
    setMentorMessages(updatedHistory);

    // Build context-aware MentorContext payload
    const context = AIService.buildMentorContext(
      profile,
      skillGaps,
      roadmap,
      roadmapProgress
    );

    const aiResult = await AIService.generateMentorResponse(userText, mentorMessages, context);

    const assistantMsg: MentorMessage = {
      id: 'msg_a_' + Date.now(),
      sender: 'assistant',
      text: aiResult.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAiGenerated: aiResult.isAiGenerated,
      modelUsed: aiResult.modelUsed,
    };

    setMentorMessages((prev) => [...prev, assistantMsg]);
  };

  const openVoiceMode = (initialPrompt?: string) => {
    setVoiceInitialPrompt(initialPrompt);
    setIsVoiceModeOpen(true);
  };

  const closeVoiceMode = () => {
    setIsVoiceModeOpen(false);
    setVoiceInitialPrompt(undefined);
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        profile,
        updateProfile,
        roadmap,
        skillGaps,
        roadmapProgress,
        updateStepStatus,
        updatePacePreferences,
        resetRoadmapProgress,
        mentorMessages,
        addMentorMessage,
        toastMessage,
        showToast,
        resetToDefaults,
        isVoiceModeOpen,
        voiceInitialPrompt,
        openVoiceMode,
        closeVoiceMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
