import { Roadmap, StudentProfile } from '../types';

export class PDFService {
  /**
   * Placeholder function for future PDF export functionality.
   */
  static async generateRoadmapPDF(roadmap: Roadmap, profile: StudentProfile): Promise<{ success: boolean; message: string }> {
    console.log('PDF generation requested for:', profile.name || profile.firstName, roadmap.targetRole);
    return {
      success: false,
      message: 'PDF generation will be available in the next phase.',
    };
  }
}
