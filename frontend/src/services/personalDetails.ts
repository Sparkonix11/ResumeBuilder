import api from './api';

export interface PersonalDetails {
  id?: number;
  userId?: number;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  title?: string;
  professionalSummary?: string;
  skills?: string[];
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getPersonalDetails = async (): Promise<PersonalDetails> => {
  const response = await api.get('/personal-details');
  return response.data;
};

export const updatePersonalDetails = async (data: PersonalDetails): Promise<PersonalDetails> => {
  const response = await api.put('/personal-details', data);
  return response.data;
};