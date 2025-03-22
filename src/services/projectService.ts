import api from './api';

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
    const response = await api.post<Project>('/projects', data);
    return response.data;
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
   * Get all files for a project (structure only)
   */
  async getProjectFiles(projectId: string): Promise<ProjectFile[]> {
    const response = await api.get<ProjectFile[]>(`/projects/${projectId}/files`);
    return response.data;
  },

  /**
   * Get all files with content for a project
   */
  async getAllFilesContent(projectId: string): Promise<ProjectFile[]> {
    const response = await api.get<ProjectFile[]>(`/projects/${projectId}/files/all`);
    return response.data;
  },

  /**
   * Get a single file's content
   */
  async getFileContent(projectId: string, path: string): Promise<string> {
    const response = await api.get<{ content: string }>(`/projects/${projectId}/file`, {
      params: { path }
    });
    return response.data.content;
  },

  /**
   * Add a new file or folder to a project
   */
  async addFile(projectId: string, fileData: FileOperationData): Promise<ProjectFile> {
    const response = await api.post<ProjectFile>(`/projects/${projectId}/files`, fileData);
    return response.data;
  },

  /**
   * Update an existing file
   */
  async updateFile(projectId: string, fileData: FileOperationData): Promise<ProjectFile> {
    const response = await api.put<ProjectFile>(`/projects/${projectId}/files`, fileData);
    return response.data;
  },

  /**
   * Delete a file or folder
   */
  async deleteFile(projectId: string, path: string): Promise<void> {
    await api.delete(`/projects/${projectId}/files`, {
      params: { path }
    });
  }
};

export default projectService; 