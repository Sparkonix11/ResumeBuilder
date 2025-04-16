import api from './api';

export interface PersonalDetail {
  id?: number;
  userId?: number;
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  professionalSummary?: string;
  skills?: string[] | string;
  createdAt?: string;
  updatedAt?: string;
}

export const getPersonalDetails = async (): Promise<PersonalDetail> => {
  try {
    const response = await api.get('/personal-details');
    return response.data;
  } catch (error) {
    console.error('Error fetching personal details:', error);
    throw error;
  }
};

export const updatePersonalDetails = async (data: PersonalDetail): Promise<PersonalDetail> => {
  try {
    const response = await api.put('/personal-details', data);
    return response.data;
  } catch (error) {
    console.error('Error updating personal details:', error);
    throw error;
  }
};