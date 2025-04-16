import api from './api';

export interface ResumeTemplate {
  id?: number;
  name: string;
  description?: string;
  previewImage?: string;
  layout: string;
  fontFamily?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllTemplates = async (): Promise<ResumeTemplate[]> => {
  const response = await api.get('/resume-templates');
  return response.data;
};

export const getTemplateById = async (id: number): Promise<ResumeTemplate> => {
  const response = await api.get(`/resume-templates/${id}`);
  return response.data;
};