import axios from 'axios';

import { API_URL } from '../../config';

const headers = {
  'Content-Type': 'application/json',
};

export const registerUser = async (userData) => {
  console.log('REGISTER API - AM I WORKING?', registerUser)
  return await axios.post(`${API_URL}/register`, userData, { headers });
};

export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}/login`, credentials, { headers });
};

export const inviteUser = async (email) => {
  return await axios.post(`${API_URL}/invite`, { email }, { headers });
};

export const resetPassword = async (email) => {
  return await axios.post(`${API_URL}/forgot`, { email }, { headers });
};


export const updateUser = async (userData) => {
  return await axios.put(`${API_URL}/user/update`, userData, { headers });
};





