import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFolder, FiEdit, FiTrash2, FiPlay, FiClock, FiPlus } from 'react-icons/fi';
import { projectService } from '../../services';
import toast from 'react-hot-toast';

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

interface ProjectListProps {
  onProjectSelected?: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onProjectSelected }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const userProjects = await projectService.getAllProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load your projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenProject = (project: Project) => {
    if (onProjectSelected) {
      onProjectSelected(project);
    } else {
      navigate('/designer', { 
        state: { 
          prompt: project.description || project.name, 
          isPublic: project.public,
          projectId: project.id
        } 
      });
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the project when clicking delete
    
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.deleteProject(projectId);
        toast.success('Project deleted successfully');
        // Remove project from state
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4 text-white">My Projects</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-neutral-700 rounded-lg bg-[#0a0a0a] transition-all">
          <FiFolder className="w-14 h-14 mx-auto text-neutral-500 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Projects Found</h3>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">You don't have any projects yet. Create your first project to get started!</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-white text-sm font-medium transition-colors shadow-lg"
            onClick={() => navigate('/designer')}
          >
            <div className="flex items-center">
              <FiPlus className="mr-2" />
              Create Your First Project
            </div>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map(project => (
            <motion.div
              key={project.id}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                selectedProject === project.id
                  ? 'bg-[#101318] border-blue-500/50'
                  : 'bg-[#0a0a0a] border-neutral-800 hover:border-neutral-700'
              }`}
              onClick={() => handleOpenProject(project)}
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="bg-gradient-to-b from-blue-400 to-blue-600 rounded-md w-10 h-10 mr-3 flex-shrink-0 flex flex-col overflow-hidden">
                    <div className="h-1/5 bg-blue-300"></div>
                    <div className="h-1/5 bg-blue-400"></div>
                    <div className="h-1/5 bg-blue-500"></div>
                    <div className="h-1/5 bg-blue-600"></div>
                    <div className="h-1/5 bg-blue-700"></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-sm text-neutral-400 line-clamp-1">
                      {project.description || 'No description provided'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenProject(project);
                    }}
                  >
                    <FiPlay className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/designer`, { 
                        state: { 
                          prompt: project.description || project.name,
                          isPublic: project.public,
                          projectId: project.id,
                          editMode: true
                        } 
                      });
                    }}
                  >
                    <FiEdit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded-md text-neutral-400 hover:text-red-500 hover:bg-neutral-800"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-xs text-neutral-500">
                  <FiClock className="w-3 h-3 mr-1" />
                  Last updated: {formatDate(project.updatedAt)}
                </div>
                <div className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                  {project.public ? 'Public' : 'Private'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Add a refresh button */}
      {!isLoading && projects.length > 0 && (
        <div className="mt-4 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadProjects}
            className="px-4 py-2 bg-[#111] hover:bg-[#222] rounded-lg text-sm text-white transition-colors border border-[#333]"
          >
            Refresh Projects
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ProjectList; 