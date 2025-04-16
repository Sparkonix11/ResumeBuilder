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
}

export const getAllEducation = async (): Promise<Education[]> => {
  const response = await api.get('/education');
  return response.data;
};

export const getEducationById = async (id: number): Promise<Education> => {
  const response = await api.get(`/education/${id}`);
  return response.data;
};

export const createEducation = async (data: Education): Promise<Education> => {
  const response = await api.post('/education', data);
  return response.data;
};

export const updateEducation = async (id: number, data: Education): Promise<Education> => {
  const response = await api.put(`/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: number): Promise<void> => {
  await api.delete(`/education/${id}`);
};