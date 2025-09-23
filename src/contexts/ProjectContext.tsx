import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project, ProjectIdea} from '../services/api';

interface ProjectContextType {
  savedProjects: Project[];
  generatedIdeas: ProjectIdea[];
  addProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  setGeneratedIdeas: (ideas: ProjectIdea[]) => void;
  clearGeneratedIdeas: () => void;
  isProjectSaved: (ideaId: string) => boolean;
  saveIdeaAsProject: (idea: ProjectIdea) => Project;
  getProjectsByStatus: (status: Project['status']) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({children}) => {
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);

  // Load saved projects from AsyncStorage on init
  useEffect(() => {
    loadSavedProjects();
  }, []);

  // Save to AsyncStorage whenever savedProjects changes
  useEffect(() => {
    saveSavedProjects();
  }, [savedProjects]);

  const loadSavedProjects = async () => {
    try {
      const stored = await AsyncStorage.getItem('saved_projects');
      if (stored) {
        setSavedProjects(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved projects:', error);
    }
  };

  const saveSavedProjects = async () => {
    try {
      await AsyncStorage.setItem('saved_projects', JSON.stringify(savedProjects));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  const addProject = (project: Project) => {
    setSavedProjects(prev => {
      const exists = prev.find(p => p.id === project.id);
      if (exists) {
        return prev.map(p => p.id === project.id ? project : p);
      }
      return [project, ...prev];
    });
  };

  const removeProject = (projectId: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setSavedProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {...project, ...updates}
          : project
      )
    );
  };

  const clearGeneratedIdeas = () => {
    setGeneratedIdeas([]);
  };

  const isProjectSaved = (ideaId: string): boolean => {
    return savedProjects.some(project => project.id === ideaId);
  };

  const saveIdeaAsProject = (idea: ProjectIdea): Project => {
    const project: Project = {
      id: idea.id,
      title: idea.title,
      category: idea.category,
      tags: idea.components.map(c => c.toLowerCase()),
      difficulty: idea.difficulty,
      status: 'saved',
      dateSaved: new Date().toISOString(),
      instructions: idea.instructions.join('\n'),
      requirements: idea.components,
      notes: '',
    };

    addProject(project);
    return project;
  };

  const getProjectsByStatus = (status: Project['status']): Project[] => {
    return savedProjects.filter(project => project.status === status);
  };

  const value: ProjectContextType = {
    savedProjects,
    generatedIdeas,
    addProject,
    removeProject,
    updateProject,
    setGeneratedIdeas,
    clearGeneratedIdeas,
    isProjectSaved,
    saveIdeaAsProject,
    getProjectsByStatus,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};