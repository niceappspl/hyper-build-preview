import api from './api';

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
    await api.post('/snack', {
      snackId,
      ...data
    });
  },

  /**
   * Create a new Snack from a project
   */
  async createSnack(projectId: string): Promise<SnackResponse> {
    const response = await api.post<SnackResponse>(`/snack/${projectId}`);
    return response.data;
  },

  /**
   * Update an existing Snack
   */
  async updateSnack(data: UpdateSnackRequest): Promise<SnackResponse> {
    const response = await api.put<SnackResponse>(`/snack/${data.projectId}`, data);
    return response.data;
  },

  /**
   * Get the Snack URL for a project
   */
  async getSnackUrl(projectId: string): Promise<SnackResponse> {
    const response = await api.get<SnackResponse>(`/snack/${projectId}`);
    return response.data;
  }
};

export default snackService; 