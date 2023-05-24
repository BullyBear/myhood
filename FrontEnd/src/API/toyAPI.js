import axios from 'axios';
import { API_URL } from '../../config';

export const getAllToys = async () => {
  try {
    const response = await axios.get(`${API_URL}/toys`);
    return response.data;
  } catch (error) {
    console.error('Error fetching toys:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    return null;
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

export const createToy = async (toyData) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: toyData.image_url, 
      type: 'image/jpeg', 
      name: 'image.jpg'
    });
    formData.append('user_id', toyData.user_id);
    //formData.append('user_id', 1);
    
    const response = await axios.post(`${API_URL}/toys`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating toy:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    return null;
  }
};


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
