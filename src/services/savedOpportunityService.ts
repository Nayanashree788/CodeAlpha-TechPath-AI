import { ApplicationTrackerItem } from '../types/Opportunity';

const SAVED_OPPORTUNITIES_KEY = 'techpath_saved_opportunities';
const APPLICATION_TRACKER_KEY = 'techpath_application_tracker';

export class SavedOpportunityService {
  // --- SAVED OPPORTUNITIES ---
  public static getSavedOpportunityIds(): string[] {
    try {
      const data = localStorage.getItem(SAVED_OPPORTUNITIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static isOpportunitySaved(opportunityId: string): boolean {
    const ids = this.getSavedOpportunityIds();
    return ids.includes(opportunityId);
  }

  public static toggleSaveOpportunity(opportunityId: string): boolean {
    const ids = this.getSavedOpportunityIds();
    const index = ids.indexOf(opportunityId);
    let newState = false;

    if (index >= 0) {
      ids.splice(index, 1);
      newState = false;
    } else {
      ids.push(opportunityId);
      newState = true;
    }

    try {
      localStorage.setItem(SAVED_OPPORTUNITIES_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save opportunity IDs:', e);
    }

    return newState;
  }

  // --- APPLICATION TRACKER ---
  public static getApplications(): ApplicationTrackerItem[] {
    try {
      const data = localStorage.getItem(APPLICATION_TRACKER_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Return default initial item if empty
      const initial: ApplicationTrackerItem[] = [
        {
          id: 'app_sample_1',
          companyName: 'Microsoft',
          roleTitle: 'Software Engineering Intern',
          applicationUrl: 'https://careers.microsoft.com',
          appliedDate: '2026-08-01',
          status: 'Applied',
          notes: 'Submitted resume via official portal.',
        },
      ];
      localStorage.setItem(APPLICATION_TRACKER_KEY, JSON.stringify(initial));
      return initial;
    } catch {
      return [];
    }
  }

  public static addApplication(item: Omit<ApplicationTrackerItem, 'id'>): ApplicationTrackerItem {
    const apps = this.getApplications();
    const newItem: ApplicationTrackerItem = {
      ...item,
      id: 'app_' + Date.now(),
    };
    apps.unshift(newItem);
    try {
      localStorage.setItem(APPLICATION_TRACKER_KEY, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed to add application:', e);
    }
    return newItem;
  }

  public static updateApplication(updatedItem: ApplicationTrackerItem): void {
    const apps = this.getApplications();
    const index = apps.findIndex((a) => a.id === updatedItem.id);
    if (index >= 0) {
      apps[index] = updatedItem;
      try {
        localStorage.setItem(APPLICATION_TRACKER_KEY, JSON.stringify(apps));
      } catch (e) {
        console.error('Failed to update application:', e);
      }
    }
  }

  public static deleteApplication(id: string): void {
    let apps = this.getApplications();
    apps = apps.filter((a) => a.id !== id);
    try {
      localStorage.setItem(APPLICATION_TRACKER_KEY, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed to delete application:', e);
    }
  }
}
