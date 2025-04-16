import api from './api';
import { WorkExperience } from './workExperience';
import { Education } from './education';
import { Project } from './projects';
import { ResumeTemplate } from './resumeTemplates';
import { PersonalDetails } from './personalDetails';

export interface Resume {
  id?: number;
  userId?: number;
  name: string;
  templateId?: number;
  customFontFamily?: string;
  customPrimaryColor?: string;
  customSecondaryColor?: string;
  selectedProjects: number[];
  selectedWorkExperiences: number[];
  selectedEducation: number[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FullResumeData {
  resumeInfo: {
    id: number;
    name: string;
    customFontFamily?: string;
    customPrimaryColor?: string;
    customSecondaryColor?: string;
  };
  template: ResumeTemplate;
  personalInfo: PersonalDetails;
  projects: Project[];
  workExperiences: WorkExperience[];
  education: Education[];
}

export const getAllResumes = async (): Promise<Resume[]> => {
  const response = await api.get('/resumes');
  return response.data;
};

export const getResumeById = async (id: number): Promise<Resume> => {
  const response = await api.get(`/resumes/${id}`);
  return response.data;
};

export const getFullResumeData = async (id: number): Promise<FullResumeData> => {
  const response = await api.get(`/resumes/${id}/full`);
  return response.data;
};

export const createResume = async (data: Resume): Promise<Resume> => {
  const response = await api.post('/resumes', data);
  return response.data;
};

export const updateResume = async (id: number, data: Resume): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}`, data);
  return response.data;
};

export const deleteResume = async (id: number): Promise<void> => {
  await api.delete(`/resumes/${id}`);
};

export const exportResumeAsPDF = async (resumeData: FullResumeData): Promise<Blob> => {
  const response = await api.post('/export/pdf', { resumeData }, {
    responseType: 'blob'
  });
  return response.data;
};

export const exportResumeAsDOCX = async (resumeData: FullResumeData): Promise<Blob> => {
  const response = await api.post('/export/docx', { resumeData }, {
    responseType: 'blob'
  });
  return response.data;
};