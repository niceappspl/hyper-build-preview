import axios, { AxiosError } from 'axios';
import { CreateSnackOptions, SnackResponse, UpdateSnackOptions } from '../types/expo-snack';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3050';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

/**
 * Service for managing Expo Snack integration
 */
const snackService = {
  /**
   * Create a new Snack from a project
   */
  async createSnack(projectId: string): Promise<SnackResponse> {
    try {
      const response = await axios.post<SnackResponse>(
        `${API_URL}/api/snack/${projectId}`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error creating Snack:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: `${API_URL}/api/snack/${projectId}`
        });
      }
      throw error;
    }
  },

  /**
   * Update an existing Snack
   */
  async updateSnack(options: UpdateSnackOptions): Promise<SnackResponse> {
    try {
      const response = await axios.put<SnackResponse>(
        `${API_URL}/api/snack/${options.projectId}`,
        options,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error updating Snack:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: `${API_URL}/api/snack/${options.projectId}`
        });
      }
      throw error;
    }
  },

  /**
   * Get Snack URL for a project
   */
  async getSnackUrl(projectId: string): Promise<SnackResponse | null> {
    try {
      console.log('Fetching Snack URL from:', `${API_URL}/api/snack/${projectId}`);
      const response = await axios.get<SnackResponse>(
        `${API_URL}/api/snack/${projectId}`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error getting Snack URL:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: `${API_URL}/api/snack/${projectId}`
        });
        // If 404, return null instead of throwing
        if (error.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  /**
   * Sync project with Snack
   */
  async syncWithSnack(projectId: string, data: any): Promise<void> {
    try {
      await axios.post(
        `${API_URL}/api/snack`,
        {
          projectId,
          ...data
        },
        getAuthHeaders()
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error syncing with Snack:', {
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          url: `${API_URL}/api/snack`
        });
      }
    }
  }
};

export default snackService; 