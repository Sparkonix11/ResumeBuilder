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
  try {
    const response = await api.get('/work-experiences');
    return response.data;
  } catch (error) {
    console.error('Error fetching work experiences:', error);
    throw error;
  }
};

export const getWorkExperienceById = async (id: number): Promise<WorkExperience> => {
  try {
    const response = await api.get(`/work-experiences/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching work experience with id ${id}:`, error);
    throw error;
  }
};

export const createWorkExperience = async (data: WorkExperience): Promise<WorkExperience> => {
  try {
    const response = await api.post('/work-experiences', data);
    return response.data;
  } catch (error) {
    console.error('Error creating work experience:', error);
    throw error;
  }
};

export const updateWorkExperience = async (id: number, data: WorkExperience): Promise<WorkExperience> => {
  try {
    const response = await api.put(`/work-experiences/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating work experience with id ${id}:`, error);
    throw error;
  }
};

export const deleteWorkExperience = async (id: number): Promise<void> => {
  try {
    await api.delete(`/work-experiences/${id}`);
  } catch (error) {
    console.error(`Error deleting work experience with id ${id}:`, error);
    throw error;
  }
};