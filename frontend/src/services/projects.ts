import api from './api';

export interface Project {
  id?: number;
  userId?: number;
  name: string;
  description: string;
  techStack: string[] | string;
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  projectUrl?: string;
  repoUrl?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProjectById = async (id: number): Promise<Project> => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
};

export const createProject = async (data: Project): Promise<Project> => {
  try {
    const response = await api.post('/projects', data);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: number, data: Project): Promise<Project> => {
  try {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
};