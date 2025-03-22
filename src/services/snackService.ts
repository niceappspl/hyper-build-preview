import api from './api';
import { AxiosError } from 'axios';

interface SnackResponse {
  snackId: string;
  snackUrl: string;
  qrCodeUrl?: string;
}

interface UpdateSnackRequest {
  projectId: string;
  files?: Record<string, { contents: string; type: string }>;
}

/**
 * Snack service for Expo Snack integration
 */
const snackService = {
  /**
   * Sync the project with Expo Snack
   */
  async syncWithSnack(snackId: string, data: any): Promise<void> {
    try {
      await api.post('/snack', {
        snackId,
        ...data
      });
    } catch (error) {
      console.warn('Failed to sync with Snack:', error);
      // Don't throw the error, just log it
    }
  },

  /**
   * Create a new Snack from a project
   */
  async createSnack(projectId: string): Promise<SnackResponse | null> {
    try {
      const response = await api.post<SnackResponse>(`/snack/${projectId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.warn(`Snack service not available for project ${projectId}`);
        return null;
      }
      console.error('Error creating Snack:', error);
      throw error;
    }
  },

  /**
   * Update an existing Snack
   */
  async updateSnack(data: UpdateSnackRequest): Promise<SnackResponse | null> {
    try {
      const response = await api.put<SnackResponse>(`/snack/${data.projectId}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.warn(`Snack not found for project ${data.projectId}`);
        return null;
      }
      console.error('Error updating Snack:', error);
      throw error;
    }
  },

  /**
   * Get the Snack URL for a project
   */
  async getSnackUrl(projectId: string): Promise<SnackResponse | null> {
    try {
      const response = await api.get<SnackResponse>(`/snack/${projectId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.warn(`No Snack found for project ${projectId}`);
        return null;
      }
      console.error('Error getting Snack URL:', error);
      throw error;
    }
  }
};

export default snackService; 