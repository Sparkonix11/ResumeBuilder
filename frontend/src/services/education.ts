import api from './api';

export interface Education {
  id?: number;
  userId?: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying?: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
  gpa?: string;
}

export const getAllEducation = async (): Promise<Education[]> => {
  try {
    const response = await api.get('/education');
    return response.data;
  } catch (error) {
    console.error('Error fetching education:', error);
    throw error;
  }
};

export const getEducationById = async (id: number): Promise<Education> => {
  try {
    const response = await api.get(`/education/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching education with id ${id}:`, error);
    throw error;
  }
};

export const createEducation = async (data: Education): Promise<Education> => {
  try {
    const response = await api.post('/education', data);
    return response.data;
  } catch (error) {
    console.error('Error creating education:', error);
    throw error;
  }
};

export const updateEducation = async (id: number, data: Education): Promise<Education> => {
  try {
    const response = await api.put(`/education/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating education with id ${id}:`, error);
    throw error;
  }
};

export const deleteEducation = async (id: number): Promise<void> => {
  try {
    await api.delete(`/education/${id}`);
  } catch (error) {
    console.error(`Error deleting education with id ${id}:`, error);
    throw error;
  }
};