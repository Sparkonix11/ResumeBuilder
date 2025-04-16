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
  try {
    const response = await api.get('/resume-templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching resume templates:', error);
    throw error;
  }
};

export const getTemplateById = async (id: number): Promise<ResumeTemplate> => {
  try {
    const response = await api.get(`/resume-templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resume template with id ${id}:`, error);
    throw error;
  }
};

export const createTemplate = async (data: ResumeTemplate): Promise<ResumeTemplate> => {
  try {
    const response = await api.post('/resume-templates', data);
    return response.data;
  } catch (error) {
    console.error('Error creating resume template:', error);
    throw error;
  }
};

export const updateTemplate = async (id: number, data: ResumeTemplate): Promise<ResumeTemplate> => {
  try {
    const response = await api.put(`/resume-templates/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating resume template with id ${id}:`, error);
    throw error;
  }
};

export const deleteTemplate = async (id: number): Promise<void> => {
  try {
    await api.delete(`/resume-templates/${id}`);
  } catch (error) {
    console.error(`Error deleting resume template with id ${id}:`, error);
    throw error;
  }
};