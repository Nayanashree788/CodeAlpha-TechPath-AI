import { RoadmapProgress, StepStatus, PacePreferences, RoadmapStep } from '../types';

const ROADMAP_PROGRESS_KEY = 'techpath_roadmap_progress_v3';

export const DEFAULT_PACE: PacePreferences = {
  hoursPerDay: 2,
  daysPerWeek: 5,
  preferredPace: 'Balanced',
};

export class RoadmapProgressService {
  /**
   * Loads saved roadmap progress from localStorage.
   */
  static getRoadmapProgress(): RoadmapProgress {
    try {
      const stored = localStorage.getItem(ROADMAP_PROGRESS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RoadmapProgress;
        return {
          stepStatuses: parsed.stepStatuses || {},
          pace: parsed.pace || DEFAULT_PACE,
          updatedAt: parsed.updatedAt || new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('Failed to load roadmap progress from localStorage:', e);
    }
    return {
      stepStatuses: {},
      pace: DEFAULT_PACE,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Persists roadmap progress into localStorage.
   */
  static saveRoadmapProgress(progress: RoadmapProgress): void {
    try {
      localStorage.setItem(
        ROADMAP_PROGRESS_KEY,
        JSON.stringify({
          ...progress,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (e) {
      console.warn('Failed to save roadmap progress:', e);
    }
  }

  /**
   * Updates status for a single roadmap step.
   */
  static updateStepStatus(stepId: string, status: StepStatus): RoadmapProgress {
    const current = RoadmapProgressService.getRoadmapProgress();
    const updatedStatuses = {
      ...current.stepStatuses,
      [stepId]: status,
    };
    const updatedProgress: RoadmapProgress = {
      ...current,
      stepStatuses: updatedStatuses,
      updatedAt: new Date().toISOString(),
    };
    RoadmapProgressService.saveRoadmapProgress(updatedProgress);
    return updatedProgress;
  }

  /**
   * Updates pace preferences (hours per day, days per week, pace preset).
   */
  static updatePacePreferences(pace: PacePreferences): RoadmapProgress {
    const current = RoadmapProgressService.getRoadmapProgress();
    const updatedProgress: RoadmapProgress = {
      ...current,
      pace,
      updatedAt: new Date().toISOString(),
    };
    RoadmapProgressService.saveRoadmapProgress(updatedProgress);
    return updatedProgress;
  }

  /**
   * Resets all roadmap progress.
   */
  static resetProgress(): void {
    try {
      localStorage.removeItem(ROADMAP_PROGRESS_KEY);
    } catch (e) {
      console.warn('Failed to clear roadmap progress:', e);
    }
  }

  /**
   * Helper to calculate percentage of completed steps in a list.
   */
  static calculateCompletionPercentage(
    steps: RoadmapStep[],
    stepStatuses: Record<string, StepStatus>
  ): number {
    if (!steps || steps.length === 0) return 0;
    const completedCount = steps.filter((s) => {
      const currentStatus = stepStatuses[s.id] || s.status;
      return currentStatus === 'Completed';
    }).length;

    return Math.round((completedCount / steps.length) * 100);
  }
}
