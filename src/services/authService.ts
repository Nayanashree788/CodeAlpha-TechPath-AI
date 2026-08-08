import { StudentProfile } from '../types';
import { ProfileService, INITIAL_DEFAULT_PROFILE } from './profileService';

export const DEFAULT_PROFILE = INITIAL_DEFAULT_PROFILE;

export class AuthService {
  static async getCurrentProfile(): Promise<StudentProfile> {
    return ProfileService.getStudentProfile();
  }

  static async saveProfile(profile: StudentProfile): Promise<StudentProfile> {
    return ProfileService.saveStudentProfile(profile);
  }

  static async clearProfile(): Promise<void> {
    return ProfileService.clearStudentProfile();
  }
}
