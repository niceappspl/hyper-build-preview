import api from './api';
import authService from './authService';
import projectService from './projectService';
import aiService from './aiService';
import templateService from './templateService';
import snackService from './snackService';

export {
  api,
  authService,
  projectService,
  aiService,
  templateService,
  snackService
};

// Also export as default for convenience
export default {
  api,
  auth: authService,
  projects: projectService,
  ai: aiService,
  templates: templateService,
  snacks: snackService
}; 