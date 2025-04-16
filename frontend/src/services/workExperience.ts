import api from './api';

export interface WorkExperience {
  id?: number;
  userId?: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrentJob?: boolean;
  location?: string;
  description?: string;
  responsibilities?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllWorkExperiences = async (): Promise<WorkExperience[]> => {
  const response = await api.get('/work-experiences');
  return response.data;
};

export const getWorkExperienceById = async (id: number): Promise<WorkExperience> => {
  const response = await api.get(`/work-experiences/${id}`);
  return response.data;
};

export const createWorkExperience = async (data: WorkExperience): Promise<WorkExperience> => {
  const response = await api.post('/work-experiences', data);
  return response.data;
};

export const updateWorkExperience = async (id: number, data: WorkExperience): Promise<WorkExperience> => {
  const response = await api.put(`/work-experiences/${id}`, data);
  return response.data;
};

export const deleteWorkExperience = async (id: number): Promise<void> => {
  await api.delete(`/work-experiences/${id}`);
};