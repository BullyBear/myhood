// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerUser as registerUserFromAPI,
  loginUser as loginUserFromAPI,
  updateUser as updateUserFromAPI,
  resetPassword as resetPasswordFromAPI,
  inviteUser as inviteUserFromAPI,
} from '../API/userAPI';

const initialState = {
  usersByIds: [], // existing users data
  userInteractions: {}, // new property to store user interactions with toys
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    registerUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    registerUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
    resetPasswordRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    inviteUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    inviteUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    inviteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Action to handle user swipe right on a toy
    addUserInteraction: (state, action) => {
      const { toyId, userId } = action.payload;
      const userInteractions = state.userInteractions[toyId] || [];
      if (!userInteractions.includes(userId)) {
        userInteractions.push(userId);
        state.userInteractions[toyId] = userInteractions;
      }
    },
  },
});

export const { 
  registerUserRequest, 
  registerUserSuccess, 
  registerUserFailure,
  loginUserRequest, 
  loginUserSuccess, 
  loginUserFailure,
  updateUserRequest, 
  updateUserSuccess, 
  updateUserFailure,
  logoutUser,
  resetPasswordRequest, 
  resetPasswordSuccess, 
  resetPasswordFailure,
  inviteUserRequest,
  inviteUserSuccess,
  inviteUserFailure
} = userSlice.actions;

export const registerUser = (userData) => async (dispatch) => {
  dispatch(registerUserRequest());
  try {
    const response = await registerUserFromAPI(userData);
    console.log(response); // Log the full response to see what it looks like
    dispatch(registerUserSuccess(response.data));
  } catch (error) {
    dispatch(registerUserFailure(error.message));
  }
};


export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginUserRequest());
  try {
    const response = await loginUserFromAPI(credentials);
    dispatch(loginUserSuccess(response.data));
  } catch (error) {
    dispatch(loginUserFailure(error.message));
  }
};



export const logout = () => (dispatch) => {
  dispatch(logoutUser());
};

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userUpdateData, { rejectWithValue }) => {
    try {
      const response = await updateUserFromAPI(userUpdateData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await resetPasswordFromAPI(email);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



export const inviteUser = (email) => async (dispatch) => {
  dispatch(inviteUserRequest());
  try {
    const response = await inviteUserFromAPI(email);
    dispatch(inviteUserSuccess(response.data));
  } catch (error) {
    dispatch(inviteUserFailure(error.message));
  }
};

export default userSlice.reducer;
