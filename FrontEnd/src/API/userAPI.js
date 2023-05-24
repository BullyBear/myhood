import axios from 'axios';
import { API_URL } from '../../config';

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/api/register`, userData);
};

export const loginUser = async (credentials) => {
  return await axios.post(`${API_URL}/api/login`, credentials);
};

export const updateUser = async (userId, userData) => {
  return await axios.put(`${API_URL}/api/users/${userId}`, userData);
};





