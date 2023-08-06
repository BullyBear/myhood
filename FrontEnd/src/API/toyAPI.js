import axios from 'axios';
import { API_URL } from '../../config';

export const getToysWithinRadius = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${API_URL}/toys/in_radius`, {
      params: {
        user_latitude: latitude,
        user_longitude: longitude,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching toys within radius:', error.message);
    throw error;
  }
};

export const getAllToys = async () => {
  try {
    const response = await axios.get(`${API_URL}/toys`);
    return response.data;
  } catch (error) {
    console.error('Error fetching toys:', error.message);
    throw error;
  }
};

export const getToyById = async (toyId) => {
  try {
    const response = await axios.get(`${API_URL}/toys/${toyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching toy by ID:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    return null;
  }
};

export async function createToy({ image_url, user_id }) {
  const data = new FormData();
  data.append('image', {
    uri: image_url,
    name: 'image.jpg',
    type: 'image/jpeg'
  });
  data.append('user_id', user_id);
  const response = await fetch(`${API_URL}/toys`, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export const updateToy = async (toyId, toyData) => {
  try {
    const response = await axios.put(`${API_URL}/toys/${toyId}`, toyData);
    return response.data;
  } catch (error) {
    console.error('Error updating toy:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    return null;
  }
};

export const deleteToy = async (toyId) => {
  try {
    const response = await axios.delete(`${API_URL}/toys/${toyId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting toy:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    return null;
  }
};