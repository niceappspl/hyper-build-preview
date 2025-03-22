import api from './api';
import { AxiosError } from 'axios';
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  public: boolean;
  userId: string;
}

interface ProjectFile {
  id: string;
  name: string;
  path: string;
  content?: string;
  type: 'file' | 'folder';
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateProjectData {
  name: string;
  description?: string;
  templateId?: string;
  public?: boolean;
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  public?: boolean;
}

interface FileOperationData {
  path: string;
  name: string;
  content?: string;
  type?: 'file' | 'folder';
}

/**
 * Project service for project and file operations
 */
const projectService = {
  /**
   * Get all projects for the authenticated user
   */
  async getAllProjects(): Promise<Project[]> {
    // Backend powinien zidentyfikować użytkownika na podstawie tokenu JWT
    const response = await api.get<Project[]>('/projects/user');
    return response.data;
  },

  /**
   * Get a single project by ID
   */
  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  /**
   * Create a new project with template
   */
  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      // Ensure we have valid data
      if (!data.name) {
        throw new Error('Project name is required');
      }
      
      console.log('Creating project with data:', data);
      const response = await api.post<Project>('/projects', data);
      
      // Validate response
      if (!response.data) {
        throw new Error('No data returned from API');
      }
      
      // Check if returned project has an ID
      if (!response.data.id) {
        console.warn('Invalid project data received:', response.data);
        
        // Generate a temporary ID if none is provided by the server
        // This is a fallback to prevent the UI from breaking
        const tempProject = {
          ...response.data,
          id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          createdAt: response.data.createdAt || new Date().toISOString(),
          updatedAt: response.data.updatedAt || new Date().toISOString(),
        };
        
        console.log('Using temporary project with generated ID:', tempProject);
        
        // Try to find the real project ID after creation
        try {
          console.log('Attempting to fetch recently created projects to find the real ID...');
          const projects = await this.getAllProjects();
          const recentProject = projects.find(p => p.name === data.name);
          
          if (recentProject && recentProject.id) {
            console.log('Found matching project with proper ID:', recentProject);
            return recentProject;
          }
        } catch (fetchError) {
          console.error('Failed to fetch recent projects:', fetchError);
          // Continue with the temporary project 
        }
        
        return tempProject as Project;
      }
      
      console.log('Project created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createProject service:', error);
      if (error instanceof AxiosError) {
        // Handle API-specific errors
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;
        
        if (statusCode === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (statusCode === 403) {
          throw new Error('You do not have permission to create projects.');
        } else {
          throw new Error(`API Error (${statusCode}): ${errorMessage}`);
        }
      }
      // Re-throw the error for the component to handle
      throw error;
    }
  },

  /**
   * Update an existing project
   */
  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  /**
   * Get file structure for a project
   */
  async getProjectFiles(projectId: string): Promise<any> {
    try {
      const response = await api.get(`/projects/${projectId}/files`);
      return response.data.files || [];
    } catch (error) {
      console.error('Error fetching project files:', error);
      throw error;
    }
  },

  /**
   * Get all files with content for a project
   */
  async getAllFilesContent(projectId: string): Promise<any> {
    try {
      const response = await api.get(`/projects/${projectId}/files/all`);
      return response.data.files || {};
    } catch (error) {
      console.error('Error fetching all files content:', error);
      throw error;
    }
  },

  /**
   * Get a single file's content
   */
  async getFileContent(projectId: string, filePath: string): Promise<string> {
    try {
      const response = await api.get(`/projects/${projectId}/file`, {
        params: { filePath }
      });
      return response.data.content || '';
    } catch (error) {
      console.error('Error fetching file content:', error);
      throw error;
    }
  },

  /**
   * Add a new file to a project
   */
  async addFile(projectId: string, filePath: string, content: string = ''): Promise<any> {
    try {
      const response = await api.post(`/projects/${projectId}/files`, {
        filePath,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error adding file:', error);
      throw error;
    }
  },

  /**
   * Update an existing file
   */
  async updateFile(projectId: string, filePath: string, content: string): Promise<any> {
    try {
      const response = await api.put(`/projects/${projectId}/files`, {
        filePath,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  },

  /**
   * Delete a file
   */
  async deleteFile(projectId: string, filePath: string): Promise<any> {
    try {
      const response = await api.delete(`/projects/${projectId}/files`, {
        data: { filePath }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  /**
   * Weryfikuje, czy zalogowany użytkownik jest właścicielem projektu
   * Wykorzystuje endpoint API, który sprawdza to po stronie serwera
   */
  async verifyProjectOwnership(projectId: string): Promise<boolean> {
    try {
      // Wywołaj endpoint API, który sprawdza właściciela projektu
      // Token JWT jest automatycznie dołączany przez interceptor w api.ts
      const response = await api.get<{ isOwner: boolean }>(`/projects/${projectId}/verify-ownership`);
      return response.data.isOwner;
    } catch (error) {
      console.error('Error verifying project ownership:', error);
      return false;
    }
  },

  /**
   * Pobiera projekt z weryfikacją właściciela
   */
  async getProjectWithOwnershipCheck(projectId: string): Promise<Project> {
    // Możemy użyć specjalnego endpointu, który zwraca projekt tylko jeśli użytkownik jest właścicielem
    try {
      const response = await api.get<Project>(`/projects/${projectId}/secure`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        throw new Error('Unauthorized: You do not have permission to access this project');
      }
      throw error;
    }
  }
};

export default projectService; 