import axios from 'axios';
import { API_URL } from '../../config';

export const getToysWithinRadius = async (latitude, longitude) => {
  console.log("[getToysWithinRadius] - Called with", { latitude, longitude });
  try {
    const response = await axios.get(`${API_URL}/toys/in_radius`, {
      params: {
        user_latitude: latitude,
        user_longitude: longitude,
      },
    });
    console.log("[getToysWithinRadius] - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching toys within radius:', error.message);
    throw error;
  }
};

export const getAllToys = async () => {
  console.log("[getAllToys] - Called");
  try {
    const response = await axios.get(`${API_URL}/toys`);
    console.log("[getAllToys] - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching toys:', error.message);
    throw error;
  }
};

export const getToyById = async (toyId) => {
  console.log("[getToyById] - Called with toyId:", toyId);
  try {
    const response = await axios.get(`${API_URL}/toys/${toyId}`);
    console.log("[getToyById] - Response:", response.data);
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
  console.log("[createToy] - Called with", { image_url, user_id });
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
  console.log("[createToy] - Response:", await response.json());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export const updateToy = async (toyId, toyData) => {
  console.log("[updateToy] - Called with", { toyId, toyData });
  try {
    const response = await axios.put(`${API_URL}/toys/${toyId}`, toyData);
    console.log("[updateToy] - Response:", response.data);
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
  console.log("[deleteToy] - Called with toyId:", toyId);
  try {
    const response = await axios.delete(`${API_URL}/toys/${toyId}`);
    console.log("[deleteToy] - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting toy:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    return null;
  }
};


