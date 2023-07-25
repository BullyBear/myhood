import axios from 'axios';
import { API_URL } from '../../config';

export const registerUser = async (userData) => {
  //return await axios.post(`${API_URL}/api/register`, userData);
  return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (credentials) => {
  //return await axios.post(`${API_URL}/api/login`, credentials);
  return await axios.post(`${API_URL}/login`, credentials);
};

export const updateUser = async (userId, userData) => {
  return await axios.put(`${API_URL}/users/${userId}`, userData);
};


export const resetPassword = async (email) => {
  return await axios.post(`${API_URL}/reset-password`, { email });
};


export const inviteUser = async (email) => {
  return await axios.post(`${API_URL}/invite`, { email });
};



