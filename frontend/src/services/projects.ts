import api from './api';

export interface Project {
  id?: number;
  userId?: number;
  name: string;
  description: string;
  techStack: string[];
  startDate?: string;
  endDate?: string;
  isOngoing?: boolean;
  repoUrl?: string;
  projectUrl?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: Project): Promise<Project> => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const updateProject = async (id: number, data: Project): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};