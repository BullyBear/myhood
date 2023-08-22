import axios from 'axios';

import { API_URL } from '../../config';

const headers = {
  'Content-Type': 'application/json',
};

// export const registerUser = async (userData) => {
//   console.log('REGISTER API - AM I WORKING?', registerUser)
//   return await axios.post(`${API_URL}/register`, userData, { headers });
// };



export const registerUser = async (userData) => {
  console.log('REGISTER API - AM I WORKING?', registerUser);

  try {
    const response = await axios.post(`${API_URL}/register`, userData, { headers });
    
    console.log("API RESPONSE:", response);
    
    return response;
  } catch (err) {
    console.error("API Call Error:", err);

    // If error response is available, log it for more clarity
    if (err.response) {
      console.error("Error Response:", err.response);
      throw new Error(`API responded with status ${err.response.status} and message ${err.response.data}`);
    } else {
      // If there's no error response, it's likely a network issue or issue with the Axios request itself
      throw new Error("Network error or issue with Axios request");
    }
  }
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

export const fetchDataFromAPI = async () => {
  return await axios.get(`${API_URL}/user/data`, { headers }); // Replace with your API endpoint
};



export const addProfileToUserBox = async (userId, profileData) => {
  return await axios.post(`${API_URL}/user/${userId}/addProfile`, profileData, { headers });
};







