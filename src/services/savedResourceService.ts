/**
 * Saved Resource Service
 * Manages saved bookmarks and completion states for learning resources stored in localStorage.
 * Note: Marking a resource completed explicitly records "✓ Resource completed" without altering overall roadmap skill mastery directly.
 */

const SAVED_RESOURCES_KEY = 'techpath_saved_resource_ids';
const COMPLETED_RESOURCES_KEY = 'techpath_completed_resource_ids';

export class SavedResourceService {
  /**
   * Get all saved resource IDs
   */
  static getSavedResourceIds(): string[] {
    try {
      const data = localStorage.getItem(SAVED_RESOURCES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Check if a resource is saved
   */
  static isResourceSaved(resourceId: string): boolean {
    const saved = this.getSavedResourceIds();
    return saved.includes(resourceId);
  }

  /**
   * Save a resource ID
   */
  static saveResource(resourceId: string): void {
    const saved = this.getSavedResourceIds();
    if (!saved.includes(resourceId)) {
      saved.push(resourceId);
      localStorage.setItem(SAVED_RESOURCES_KEY, JSON.stringify(saved));
    }
  }

  /**
   * Remove a saved resource ID
   */
  static removeSavedResource(resourceId: string): void {
    const saved = this.getSavedResourceIds().filter((id) => id !== resourceId);
    localStorage.setItem(SAVED_RESOURCES_KEY, JSON.stringify(saved));
  }

  /**
   * Toggle saved status for a resource
   */
  static toggleSaveResource(resourceId: string): boolean {
    if (this.isResourceSaved(resourceId)) {
      this.removeSavedResource(resourceId);
      return false;
    } else {
      this.saveResource(resourceId);
      return true;
    }
  }

  /**
   * Get all completed resource IDs
   */
  static getCompletedResourceIds(): string[] {
    try {
      const data = localStorage.getItem(COMPLETED_RESOURCES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Check if a resource is marked completed
   */
  static isResourceCompleted(resourceId: string): boolean {
    const completed = this.getCompletedResourceIds();
    return completed.includes(resourceId);
  }

  /**
   * Mark a resource completed or incomplete
   */
  static toggleResourceCompleted(resourceId: string): boolean {
    const completed = this.getCompletedResourceIds();
    const isCompleted = completed.includes(resourceId);
    let updated: string[];

    if (isCompleted) {
      updated = completed.filter((id) => id !== resourceId);
    } else {
      updated = [...completed, resourceId];
    }

    localStorage.setItem(COMPLETED_RESOURCES_KEY, JSON.stringify(updated));
    return !isCompleted;
  }
}
