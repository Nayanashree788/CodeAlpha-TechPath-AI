import { StudentProfile } from '../types';

const PROFILE_STORAGE_KEY = 'techpath_student_profile_v2';

export const INITIAL_DEFAULT_PROFILE: StudentProfile = {
  id: 'sp_default_01',
  name: 'Arjun Sharma',
  firstName: 'Arjun',
  lastName: 'Sharma',
  email: 'arjun.student@engineering.edu',
  academicYear: '3rd Year',
  branch: 'Computer Science',
  graduationYear: 2026,
  skills: [
    { name: 'Python', category: 'Programming', proficiency: 'Intermediate' },
    { name: 'JavaScript', category: 'Programming', proficiency: 'Intermediate' },
    { name: 'React', category: 'Frontend', proficiency: 'Beginner' },
    { name: 'HTML', category: 'Frontend', proficiency: 'Advanced' },
    { name: 'CSS', category: 'Frontend', proficiency: 'Intermediate' },
    { name: 'MySQL', category: 'Database', proficiency: 'Beginner' },
    { name: 'Git', category: 'Tools', proficiency: 'Intermediate' },
  ],
  targetRole: 'Full Stack Developer',
  isCustomRole: false,
  learningPreferences: {
    formats: ['Hands-on projects', 'Video', 'Documentation'],
    difficulty: 'Intermediate',
    language: 'English',
  },
  careerPriorities: ['Placement preparation', 'Internship', 'Portfolio'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export class ProfileService {
  /**
   * Retrieves the current student profile from client storage.
   * If none exists, returns default initial profile and saves it.
   */
  static async getStudentProfile(): Promise<StudentProfile> {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StudentProfile;
        // Ensure name sync
        if (!parsed.name && parsed.firstName) {
          parsed.name = `${parsed.firstName} ${parsed.lastName || ''}`.trim();
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Unable to load student profile from localStorage:', e);
    }
    // Default fallback
    await ProfileService.saveStudentProfile(INITIAL_DEFAULT_PROFILE);
    return INITIAL_DEFAULT_PROFILE;
  }

  /**
   * Saves or overwrites the entire student profile.
   */
  static async saveStudentProfile(profile: StudentProfile): Promise<StudentProfile> {
    const updated: StudentProfile = {
      ...profile,
      name: profile.name || `${profile.firstName} ${profile.lastName || ''}`.trim(),
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Unable to save student profile to localStorage:', e);
    }
    return updated;
  }

  /**
   * Updates specific fields of the student profile.
   */
  static async updateStudentProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
    const current = await ProfileService.getStudentProfile();
    const merged: StudentProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    if (updates.firstName || updates.lastName) {
      merged.name = `${merged.firstName} ${merged.lastName || ''}`.trim();
    }
    return await ProfileService.saveStudentProfile(merged);
  }

  /**
   * Clears saved student profile and resets to default.
   */
  static async clearStudentProfile(): Promise<void> {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch (e) {
      console.warn('Unable to clear student profile:', e);
    }
  }
}
