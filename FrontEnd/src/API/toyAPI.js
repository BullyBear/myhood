import axios from 'axios';
import { API_URL } from '../../config';



// export const getToysWithinRadius = async (latitude, longitude) => {
//   console.log("[getToysWithinRadius] - Called with", { latitude, longitude });
//   try {
//     const response = await axios.get(`${API_URL}/toys/in_radius`, {
//       params: {
//         user_latitude: latitude,
//         user_longitude: longitude,
//       },
//     });
//     console.log("[getToysWithinRadius] - Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching toys within radius:', error.message);
//     throw error;
//   }
// };


export const getToysWithinRadius = async (latitude, longitude, mode) => {
  console.log("[getToysWithinRadius] - Called with", { latitude, longitude, mode });
  try {
    const response = await axios.get(`${API_URL}/toys/in_radius`, {
      params: {
        user_latitude: latitude,
        user_longitude: longitude,
        mode: mode // Include the mode here
      },
    });
    console.log("[getToysWithinRadius] - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching toys within radius:', error.message);
    throw error;
  }
};


// export const getAllToys = async () => {
//   console.log("[getAllToys] - Called");
//   try {
//     const response = await axios.get(`${API_URL}/toys`);
//     console.log("[getAllToys] - Response:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching toys:', error.message);
//     throw error;
//   }
// };


// Modify this function to accept the mode parameter
export const getAllToys = async (mode) => {
  console.log("[getAllToys] - Called with mode:", mode);

  // Add logic to incorporate the mode parameter into the API request
  let url = `${API_URL}/toys`;
  if (mode) {
    url += `?mode=${mode}`;
  }

  try {
    const response = await axios.get(url);
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


export const createToy = async (toyData) => {
  console.log("[createToy] - Called with", toyData);

  try {
    const response = await axios.post(`${API_URL}/toys`, toyData);
    console.log("[createToy] - Response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating toy:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    throw error;
  }
};

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
    throw error; // throw the error so that the thunk knows the operation failed
  }
};



// export const addToyToToyboxAPI = async (userId, toyId) => {
//   try {
//     const response = await axios.post(`${API_URL}/user/${userId}/toy/${toyId}/add-toy-to-toybox`);
//     return response.data;
//   } catch (error) {
//     console.error('Error adding toy to Toybox:', error.message);
//     if (error.response) {
//       console.error('Server Response:', error.response);
//     }
//     return null;
//   }
// };


export const addToyToToyboxAPI = async (userId, toyId) => {
  try {
    const response = await axios.post(`${API_URL}/user/${userId}/toy/${toyId}/add-toy-to-toybox`, {
      user_id: userId,
      toy_id: toyId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding toy to Toybox:', error.message);
    if (error.response) {
      console.error('Server Response:', error.response);
    }
    return null;
  }
};
