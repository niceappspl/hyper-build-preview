import api from './api';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  tags: string[];
}

interface CreateFromTemplateRequest {
  templateId: string;
  name: string;
  description?: string;
  public?: boolean;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  templateId: string;
  public: boolean;
  userId: string;
}

/**
 * Template service for template operations
 */
const templateService = {
  /**
   * Get all available templates
   */
  async getAvailableTemplates(): Promise<Template[]> {
    const response = await api.get<Template[]>('/templates');
    return response.data;
  },
  
  /**
   * Create a new project from a template
   */
  async createProjectFromTemplate(data: CreateFromTemplateRequest): Promise<Project> {
    const response = await api.post<Project>('/templates/create-project', data);
    return response.data;
  }
};

export default templateService; 