import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  registerUser as registerUserFromAPI,
  loginUser as loginUserFromAPI,
  updateUser as updateUserFromAPI,
  fetchData as fetchDataFromAPI,
  resetPassword as resetPasswordFromAPI,
  inviteUser as inviteUserFromAPI,
  //fetchUserProfileByIdAPI as fetchUserProfileById,
  saveProfileToUserBoxInBackend,
} from '../API/userAPI';


const initialState = {
  user: null,
  users: [],
  usersByIds: {}, 
  userBox: [],
  acceptedUsers: [],
  loading: false,
  error: null,
  successMessage: null,  
  image: null,           
  errorMessage: null,
  id: '',
  bio: '',      
  profile_picture: '',
  last_interacted_toy_id: null

};


// const initialState = {
//   user: null,
//   users: [],
//   usersByIds: {},
//   userBox: [],
//   loading: false,
//   error: null,
//   successMessage: null,
//   image: null,
//   errorMessage: null,
//   user_details: {
//       id: '',
//       bio: '',
//       // ... any other nested properties
//   },
//   profile_picture: '',
//   last_interacted_toy_id: null
// };



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



export const fetchUserProfileById = createAsyncThunk(
  'users/fetchUserProfileById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)


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


// export const resetUserState = createAction('user/reset');


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
//       try {
//           // Convert frontend data to match backend structure
//           const transformedProfileData = {
//               profile_picture: profileData.profilePicture,
//               user_details: {
//                   name: profileData.name,
//                   bio: profileData.bio,
//                   id: profileData.id,
//               }
//           };

//           const response = await saveProfileToUserBoxInBackend(userId, transformedProfileData);
//           return response.data;
//       } catch (error) {
//           console.error("Error in addProfileToUserBoxAsync:", error);
//           return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
//       }
//   }
// );


export const addProfileToUserBoxAsync = createAsyncThunk(
  'user/addProfile',
  async ({ userId, profileData }, thunkAPI) => {
      try {
          // Since the data structure now already matches the backend structure, we just send the profileData as is.
          const response = await saveProfileToUserBoxInBackend(userId, profileData);
          return response.data;
      } catch (error) {
          console.error("Error in addProfileToUserBoxAsync:", error);
          return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
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
    acceptUser: (state, action) => {
      if (!state.acceptedUsers) {
          state.acceptedUsers = [];
      }
      if (!state.acceptedUsers.includes(action.payload)) {
          state.acceptedUsers = [...state.acceptedUsers, action.payload];
      }
    },
    // acceptUser: (state, action) => {
    //   // Add the user ID to the acceptedUsers array if it's not already there
    //   if (!state.acceptedUsers.includes(action.payload)) {
    //     state.acceptedUsers.push(action.payload);
    //   }
    // },
    resetUserState: (state) => {
      return { ...initialState };
    },
    removeUserFromBox: (state, action) => {
      state.userBox = state.userBox.filter(userId => userId !== action.payload);
    },
    setLastInteractedToyId: (state, action) => {
      state.last_interacted_toy_id = action.payload;
    },
    // addProfileToUserBox: (state, action) => {
    //   const userId = action.payload.id;
    //   if (!state.userBox) state.userBox = [];
    //   if (!state.userBox.includes(userId)) {
    //     state.userBox = [...state.userBox, userId];
    //   }
    //   if (!state.usersByIds) state.usersByIds = {};
    //   state.usersByIds[userId] = action.payload;
    // },
    setId: (state, action) => {   
      state.id = action.payload;
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



  //   [fetchUsersByIds.fulfilled]: (state, action) => {
  //     console.log("Payload from fetchUsersByIds:", action.payload);
  
  //     // Ensure we have a valid users array before processing
  //     if (action.payload.users && Array.isArray(action.payload.users)) {
  //         action.payload.users.forEach(user => {
  //             state.usersByIds[user.id] = user;
  
  //             if (!state.userBox) {
  //                 state.userBox = [];
  //             }
  
  //             if (!state.userBox.includes(user.id)) {
  //                 state.userBox.push(user.id);
  //             }
  //         });
  //     }
  // },
  

  [fetchUsersByIds.fulfilled]: (state, action) => {
    if (action.payload.users && Array.isArray(action.payload.users)) {
        action.payload.users.forEach(user => {
            state.usersByIds[user.profile_picture] = user;

            if (!state.userBox) {
                state.userBox = [];
            }

            if (!state.userBox.includes(user.profile_picture)) {
                state.userBox.push(user.profile_picture);
            }
        });
    }
},





//   [addProfileToUserBoxAsync.fulfilled]: (state, action) => {
//     state.loading = false;
  
//     const userId = action.payload.id;
//     const newUserBox = action.payload.userBox || [];  // Default to an empty array if null
  
//     if (state.usersByIds && state.usersByIds[userId]) {
//         state.usersByIds[userId].userBox = newUserBox;
//     } else {
//         if (!state.usersByIds) state.usersByIds = {};
//         state.usersByIds[userId] = action.payload;
//         state.usersByIds[userId].userBox = newUserBox;
//     }
  
//     // Update the global userBox state.
//     state.userBox = newUserBox;
// },




  // [addProfileToUserBoxAsync.fulfilled]: (state, action) => {
  //   state.loading = false;
  
  //   const userId = action.payload.id;
  //   const newUserBox = action.payload.userBox || [];  // Default to an empty array if null
  
  //   if (state.usersByIds && state.usersByIds[userId]) {
  //       state.usersByIds[userId].userBox = newUserBox;
  //   } else {
  //       if (!state.usersByIds) state.usersByIds = {};
  //       state.usersByIds[userId] = action.payload;
  //       state.usersByIds[userId].userBox = newUserBox;
  //   }
  
  //   // Update the global userBox state.
  //   state.userBox = newUserBox;
  // },
  

  // [acceptUser.fulfilled]: (state, action) => {
  //   if (!state.acceptedUsers.includes(action.payload)) {
  //     state.acceptedUsers.push(action.payload);
  //   }
  // },
  

  [addProfileToUserBoxAsync.fulfilled]: (state, action) => {
    state.loading = false;
  
    const userId = action.payload.id;
    const newUserBox = action.payload.userBox || [];  // Default to an empty array if null

    console.log('userslice Complete action:', action);
    console.log('userslice userid', userId)
    console.log('userslice newuserbox', newUserBox)
  
    if (state.usersByIds && state.usersByIds[userId]) {
      console.log('Updated User Box: ', state.usersByIds[userId].userBox);
        state.usersByIds[userId].userBox = newUserBox;
    } else {
        if (!state.usersByIds) state.usersByIds = {};
        state.usersByIds[userId] = action.payload;
        state.usersByIds[userId].userBox = newUserBox;
    }
  },

    
    
  // [addProfileToUserBoxAsync.fulfilled]: (state, action) => {
  //   // Assuming the backend returns the updated UserBox
  //   state.userBox = action.payload.userBox; 
  //   // ... handle other state updates if necessary
  // },


    // [addProfileToUserBoxAsync.pending]: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },
    [addProfileToUserBoxAsync.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },

    
    
      [fetchUserProfileById.pending]: (state) => {
        state.status = 'loading';
      },
      [fetchUserProfileById.fulfilled]: (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      },
      [fetchUserProfileById.rejected]: (state, action) => {
        state.status = 'failed';
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
  resetUserState,
  resetState,
  setLastInteractedToyId,
  setImageUrl,
  setId,
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
  acceptUser,
  removeUserFromBox
  
} = userSlice.actions;




export default userSlice.reducer;
