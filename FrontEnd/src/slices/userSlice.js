// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerUser as registerUserFromAPI,
  loginUser as loginUserFromAPI,
  updateUser as updateUserFromAPI,
  resetPassword as resetPasswordFromAPI,
  inviteUser as inviteUserFromAPI,
  addProfileToUserBox as addProfileToUserBoxAPI
} from '../API/userAPI';


const initialState = {
  user: null,
  users: [], 
  userBox: [], 
  loading: false,
  error: null,
  successMessage: null,  
  image: null,           
  errorMessage: null,
  bio: '',      
  profile_picture: '' 
};




// export const addProfileToUserBoxAsync = createAsyncThunk(
//   'user/addProfile',
//   async (userId, thunkAPI) => {
//     try {
//       const response = await addProfileToUserBoxAPI(userId);
//       return response.data; // assuming the API sends back the added profile data
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

export const addProfileToUserBoxAsync = createAsyncThunk(
  'user/addProfile',
  async ({ userId, profileData }, thunkAPI) => {
    try {
      const response = await addProfileToUserBoxAPI(userId, profileData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);




export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUserFromAPI(userData);
      console.log('API Response:', response);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response ? err.response.data : "Unknown error");
    }
  }
);


export const fetchUserDataAction = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDataFromAPI(); // Implement this function to fetch user data
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


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
      return response.data.message;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addProfileToUserBox: (state, action) => {
      const userProfile = action.payload;
      if (!state.userBox.find(profile => profile.id === userProfile.id)) {
        state.userBox.push(userProfile);
      }
    },
    setBio: (state, action) => {   
      state.bio = action.payload;
    },
    setProfilePicture: (state, action) => {   
      state.profile_picture = action.payload;
    },
    setImageUrl: (state, action) => {
      state.image = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setError: (state, action) => {
      state.errorMessage = action.payload;
    },
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
      state.user = action.payload.user;
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
      state.image = null;
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
  },
  extraReducers: {
    [addProfileToUserBoxAsync.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addProfileToUserBoxAsync.fulfilled]: (state, action) => {
      state.loading = false;
      // Using the reducer to add the profile to the user box
      userSlice.caseReducers.addProfileToUserBox(state, action);
    },
    [addProfileToUserBoxAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [updateUser.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [updateUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [resetPassword.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    [resetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [registerUserThunk.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [registerUserThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [registerUserThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setImageUrl,
  setBio,        
  setProfilePicture,
  setSuccessMessage,
  setError,
  registerUserRequest, 
  registerUserSuccess, 
  registerUserFailure,
  loginUserRequest, 
  loginUserSuccess, 
  loginUserFailure,
  logoutUser,
  inviteUserRequest,
  inviteUserSuccess,
  inviteUserFailure
} = userSlice.actions;


export const registerUser = (userData) => async (dispatch) => {
  // Instead of manually dispatching request/success/failure, use the thunk
  try {
    const action = await dispatch(registerUserThunk(userData));
    console.log('Registration action:', action);
    if (action.error) {
      console.error('Error from registerUserThunk:', action.error);
    }
  } catch (error) {
    console.error("Error registering user:", error.message);
  }
};



export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginUserRequest());
  try {
    const response = await loginUserFromAPI(credentials);
    if (response.status !== 200) {
      throw new Error('Login failed.');
    }
    return dispatch(loginUserSuccess(response.data)); // Return the dispatched action.
  } catch (error) {
    return dispatch(loginUserFailure(error.message)); // Return the dispatched action.
  }
};


export const logout = () => (dispatch) => {
  dispatch(logoutUser());
};

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
