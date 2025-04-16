import api from './api';
import { Education } from './education';
import { PersonalDetail } from './personalDetails';
import { Project } from './projects';
import { WorkExperience } from './workExperience';

export interface Resume {
  id?: number;
  userId?: number;
  name: string;
  templateId?: number;
  customFontFamily?: string;
  customPrimaryColor?: string;
  customSecondaryColor?: string;
  selectedProjects?: number[] | string;
  selectedWorkExperiences?: number[] | string;
  selectedEducation?: number[] | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FullResume {
  resume: Resume;
  personalDetails: PersonalDetail;
  education: Education[];
  workExperiences: WorkExperience[];
  projects: Project[];
  template: ResumeTemplate;
}

export const getAllResumes = async (): Promise<Resume[]> => {
  try {
    const response = await api.get('/resumes');
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

export const getResumeById = async (id: number): Promise<Resume> => {
  try {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resume with id ${id}:`, error);
    throw error;
  }
};

export const getFullResumeData = async (id: number): Promise<FullResume> => {
  try {
    const response = await api.get(`/resumes/${id}/full`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching full resume data for id ${id}:`, error);
    throw error;
  }
};

export const createResume = async (data: Resume): Promise<Resume> => {
  try {
    const response = await api.post('/resumes', data);
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

export const updateResume = async (id: number, data: Resume): Promise<Resume> => {
  try {
    const response = await api.put(`/resumes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating resume with id ${id}:`, error);
    throw error;
  }
};

export const deleteResume = async (id: number): Promise<void> => {
  try {
    await api.delete(`/resumes/${id}`);
  } catch (error) {
    console.error(`Error deleting resume with id ${id}:`, error);
    throw error;
  }
};

export const exportResumeToPDF = async (resumeId: number): Promise<Blob> => {
  try {
    const fullResume = await getFullResumeData(resumeId);
    const response = await api.post('/export/pdf', { resumeData: fullResume }, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting resume to PDF:', error);
    throw error;
  }
};

export const exportResumeToDOCX = async (resumeId: number): Promise<Blob> => {
  try {
    const fullResume = await getFullResumeData(resumeId);
    const response = await api.post('/export/docx', { resumeData: fullResume }, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting resume to DOCX:', error);
    throw error;
  }
};