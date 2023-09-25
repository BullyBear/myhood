import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerUser as registerUserFromAPI,
  loginUser as loginUserFromAPI,
  updateUser as updateUserFromAPI,
  fetchData as fetchDataFromAPI,
  resetPassword as resetPasswordFromAPI,
  inviteUser as inviteUserFromAPI,
  fetchUsersByIdsAPI,
  fetchUserProfileById,
  saveProfileToUserBoxInBackend,
} from '../API/userAPI';


const initialState = {
  user: null,
  users: [],
  usersByIds: {}, 
  userBox: [], 
  loading: false,
  error: null,
  successMessage: null,  
  image: null,           
  errorMessage: null,
  bio: '',      
  profile_picture: '',
  last_interacted_toy_id: null

};


console.log("Initial state USER:", initialState);





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
  async (user_id, { rejectWithValue }) => {
    console.log("Attempting to fetch user data by ID:", user_id);
    try {
      const response = await fetchData(user_id); // Pass user_id to fetchData
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


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


export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userUpdateData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateUserFromAPI(userUpdateData);
      // No need to fetchUserDataAction here because the response.data should have the updated user data
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



// export const fetchUserProfileData = createAsyncThunk(
//   'user/fetchUserProfileData',
//   async (userId, { rejectWithValue }) => {
//     try {
//       // Make an API request to fetch user profile data by their ID
//       const response = await fetchUserProfileDataAPI(userId);
//       return response.data;
//     } catch (err) {
//       console.error('Error in fetchUserProfileData:', err);
//       return rejectWithValue(err.response ? err.response.data : 'Unknown error');
//     }
//   }
// );



export const fetchUsersByIds = createAsyncThunk(
  'user/fetchUsersByIds',
  async (userIds, { rejectWithValue }) => {
    console.log('fetchUsersByIds called with userIds:', userIds); // Log the input userIds

    try {
      const response = await fetchUsersByIdsAPI(userIds);
      
      console.log('API response:', response.data); // Log the received data from the API
      return response.data;
    } catch (err) {
      console.error('Error in fetchUsersByIds:', err); // Log any error
      return rejectWithValue(err.response ? err.response.data : "Unknown error");
    }
  }
);



// export const addProfileToUserBoxAsync = createAsyncThunk(
//   'user/addProfile',
//   async ({ userId, profileData }, thunkAPI) => {
//     try {
//       const response = await addProfileToUserBoxAPI(userId, profileData);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );


// export const addProfileToUserBoxAsync = createAsyncThunk(
//   'user/addProfile',
//   async ({ userId, userIdOfToy }, thunkAPI) => {
//     try {
//       // Fetch the user who swiped right on the toy using userIdOfToy
//       const response = await fetchUserProfileById(userIdOfToy);

//       // Assuming the response contains the user's profile data
//       const userProfileData = response.data;

//       // Dispatch the user profile data to add it to the user's userbox
//       thunkAPI.dispatch(addProfileToUserBoxAPI({ userId, profileData: userProfileData }));
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );


export const addProfileToUserBoxAsync = createAsyncThunk(
  'user/addProfile',
  async ({ userId, userIdOfToy }, thunkAPI) => {
    try {
      // Fetch the user who swiped right on the toy using userIdOfToy
      const response = await fetchUserProfileById(userIdOfToy);

      // Assuming the response contains the user's profile data
      const userProfileData = response.data;

      // Save the profile data to the user's box in the backend
      await saveProfileToUserBoxInBackend(userId, userProfileData);  // Use the adjusted API function

      // Dispatch the Redux action to update the store
      thunkAPI.dispatch(addProfileToUserBox(userProfileData));

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
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


export const logout = () => (dispatch) => {
  dispatch(logoutUser());
};



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeUserFromBox: (state, action) => {
      state.userBox = state.userBox.filter(userId => userId !== action.payload);
    },
    setLastInteractedToyId: (state, action) => {
      state.last_interacted_toy_id = action.payload;
    },
    addProfileToUserBox: (state, action) => {
      const userId = action.payload.id;
      if (!state.userBox) state.userBox = [];
    
      if (!state.userBox.includes(userId)) {
        state.userBox = [...state.userBox, userId];
      }
      if (!state.usersByIds) state.usersByIds = {};
      state.usersByIds[userId] = action.payload;
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
      //state.user = null;
      //state.image = null;
      console.log('YOU LOGGED OUT', state)
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
    // [fetchUsersByIds.fulfilled]: (state, action) => {
    //   console.log("fetchusersbyid payload:", action.payload);
    //   action.payload.forEach(user => {
    //     state.usersByIds[user.id] = user;
    //   });
    // }, 
    [fetchUsersByIds.fulfilled]: (state, action) => {
      console.log("Payload from fetchUsersByIds:", action.payload);
      action.payload.forEach(user => {
        state.usersByIds[user.id] = user;
        if (!state.userBox.includes(user.id)) {
          //state.userBox.push(user.id);
          state.userBox = [...state.userBox, user.id];

        }
      });
    },
    [addProfileToUserBoxAsync.fulfilled]: (state, action) => {
      state.loading = false;
      
      if (!state.userBox) state.userBox = [];
  
      const userId = action.payload.id;
      if (!state.userBox.includes(userId)) {
          //state.userBox.push(user.id);
          state.userBox = [...state.userBox, userId];
      }
      if (!state.usersByIds) state.usersByIds = {}; 
      state.usersByIds[userId] = action.payload;
  },
    [addProfileToUserBoxAsync.pending]: (state) => {
      state.loading = true;
      state.error = null;
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
      state.user.bio = action.payload.bio;
      state.user.profile_picture = action.payload.profile_picture;
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
  setLastInteractedToyId,
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
  inviteUserFailure,
  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
  addProfileToUserBox,
  
} = userSlice.actions;




export default userSlice.reducer;
