import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { getToysWithinRadius, getAllToys, createToy as createToyAPI, updateToy as updateToyAPI, deleteToy as deleteToyAPI, getToyById } from '../API/toyAPI';


// Async action to handle uploading images and creating a toy
export const createAndUploadToy = createAsyncThunk('toy/createAndUpload', async (payload) => {
  const { images, user, latitude, longitude, S3Client, BUCKET_NAME } = payload;
  // ... Existing logic for uploading images and creating a toy
  const response = await createToyAPI(toyData);
  return response;
});


// Fetch toys from the API
export const fetchToysFromAPI = createAsyncThunk('toy/fetchToys', async () => {
  try {
    console.log('[fetchToysFromAPI] - Fetching toys from API');
    const toys = await getAllToys();
    console.log('[fetchToysFromAPI] - Fetched toys:', toys);
    return toys;
  } catch (error) {
    console.error('[fetchToysFromAPI] - Error fetching toys:', error.message);
    throw error;
  }
});

// Fetch toys within a certain radius from the API
export const fetchToysWithinRadiusFromAPI = createAsyncThunk(
  'toy/fetchToysWithinRadius',
  async ({ latitude, longitude }) => {
    try {
      console.log('[fetchToysWithinRadiusFromAPI] - Fetching toys within radius from API');
      const toys = await getToysWithinRadius(latitude, longitude);
      console.log('[fetchToysWithinRadiusFromAPI] - Fetched toys within radius:', toys);
      return toys;
    } catch (error) {
      console.error('[fetchToysWithinRadiusFromAPI] - Error fetching toys within radius:', error.message);
      throw error;
    }
  }
);

export const fetchToyByIdFromAPI = createAsyncThunk('toy/fetchToyById', async (toyId) => {
  try {
    const toy = await getToyById(toyId);
    return toy; // Return the fetched toy directly
  } catch (error) {
    console.error('Error fetching toy by ID:', error.message);
    throw error;
  }
});



export const createToyInAPI = createAsyncThunk('toy/create', async (toyData) => {
  const response = await createToyAPI(toyData);
  return response;
});


export const updateToyInAPI = createAsyncThunk('toy/update', async ({ toyId, toyData }) => {
  const response = await updateToyAPI(toyId, toyData);
  return response;
});

// export const updateToyInAPI = createAsyncThunk('toy/update', async ({ toyId, toyData }) => {
//   const response = await updateToyAPI(toyId, { image_urls: toyData.image_urls });
//   return response;
// });



export const deleteToyInAPI = createAsyncThunk('toy/delete', async (toyId) => {
  const response = await deleteToyAPI(toyId);
  return response;
});



const initialState = { toys: [], toyBox: [], loading: false, error: null };
console.log("Initial state:", initialState);

const toySlice = createSlice({
  name: 'toy',
  initialState: initialState,
  reducers: {
    loadToy: (state, action) => {
      console.log("Current state before updating toy:", state.toys);
      const toy = action.payload;
      console.log('[loadToy] - Loading toy data:', toy);
      const index = state.toys.findIndex(t => t.id === toy.id);
      if (index === -1) { // if the toy isn't already in the list
        state.toys.push(toy);
      } else {
        state.toys[index] = toy; // update existing toy data
      }
    },
    // Dont use this anymore 
  //   addProfileToUserBox: (state, action) => {
  //     const toy = action.payload;
  
  //     if (!toy) {
  //         console.error('[addProfileToUserBox] - Toy payload is undefined');
  //         return;
  //     }
  
  //     console.log('[addProfileToUserBox] - Adding toy to box:', toy);
      
  //     if (state.toyBox) {  // ensure toyBox exists and is an array
  //         state.toyBox.push(toy);
  //     } else {
  //         console.error('[addProfileToUserBox] - state.toyBox is not initialized or is not an array');
  //         state.toyBox = [toy]; // Initialize it if not done
  //     }
  
  //     // Ensure state.toys and state.toys.toys both exist and the latter is an array
  //     if (Array.isArray(state.toys)) {
  //       console.log('[Debug] - state.toys value:', state.toys);
  //       state.toys = state.toys.filter((item) => item.id !== toy.id);
  //     } else {
  //         console.error('state.toys.toys is not an array or is undefined');
  //     }
  // },
    removeToyFromCarousel: (state, action) => {
      const toyToRemove = action.payload;
      console.log('[removeToyFromCarousel] - Removing toy from carousel:', toyToRemove);
    
      // Check if state.toys is an array before performing array operations on it
      if (!Array.isArray(state.toys)) {
        console.error('state.toys is not an array or is undefined');
        return;
      }
    
      state.toys = state.toys.filter((item) => item.id !== toyToRemove.id);
    },
    
    toyAdded: (state, action) => {
      state.toys.push(action.payload);
    },
    toyUpdated: (state, action) => {
      console.log('toy updated action.payload:', action.payload);  
      const index = state.toys.findIndex(toy => toy.id === action.payload.id);
      if (index !== -1) {
        state.toys[index] = action.payload;
      }
    },
  //   toyDeleted: (state, action) => {
  //     console.log('toy deleted:', action.payload); 
  //     const id = action.payload;
  //     state.toys = state.toys.filter(toy => toy.id !== id);
  //   }
  // },
  toyDeleted: (state, action) => {
    console.log('toy deleted:', action.payload); 
    const toyId = action.payload; // Update this line
    state.toys = state.toys.filter(toy => toy.id !== toyId);
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchToysFromAPI.pending, (state) => {
        console.log('[fetchToysFromAPI.pending] - Fetching toys pending');
        state.loading = true;
      })
      .addCase(fetchToysFromAPI.fulfilled, (state, action) => {
        console.log('[fetchToysFromAPI.fulfilled] - Fetching toys fulfilled');
        state.toys = action.payload.map(toy => ({
          ...toy,
          images: Array.isArray(toy.images) ? toy.images : []  
        }));
        
        state.loading = false;
        state.error = null;
      })
      // .addCase(fetchToysFromAPI.fulfilled, (state, action) => {
      //   console.log('[fetchToysFromAPI.fulfilled] - Fetching toys fulfilled');
      //   state.toys = action.payload;
      //   state.loading = false;
      // })
    
      .addCase(fetchToysFromAPI.rejected, (state, action) => {
        console.error('[fetchToysFromAPI.rejected] - Fetching toys rejected:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchToysWithinRadiusFromAPI.pending, (state) => {
        console.log('[fetchToysWithinRadiusFromAPI.pending] - Fetching toys within radius pending');
        state.loading = true;
      })
      .addCase(fetchToysWithinRadiusFromAPI.fulfilled, (state, action) => {
        console.log('[fetchToysWithinRadiusFromAPI.fulfilled] - Fetching toys within radius fulfilled');
        state.toys = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchToysWithinRadiusFromAPI.rejected, (state, action) => {
        console.error('[fetchToysWithinRadiusFromAPI.rejected] - Fetching toys within radius rejected:', action.error.message);
        state.loading = false;
        state.error = action.error.message;
      })
      // .addCase(createToyInAPI.fulfilled, (state, action) => {
      //   const newToy = {
      //     ...action.payload,
      //     images: Array.isArray(action.payload.images) ? action.payload.images : []  // Handle 'images' as an array
      //   };
      //   state.toys.push(newToy);
      // })
      .addCase(createToyInAPI.fulfilled, (state, action) => {
        console.log('[createToyInAPI.fulfilled] - Toy created successfully');
        state.toys.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      // .addCase(updateToyInAPI.fulfilled, (state, action) => {
      //   const index = state.toys.findIndex(toy => toy.id === action.payload.id);
      //   if(index !== -1) {
      //     state.toys[index] = {
      //       ...action.payload,
      //       images: Array.isArray(action.payload.images) ? action.payload.images : []  // Handle 'images' as an array
      //     };
      //   }
      // })
      .addCase(updateToyInAPI.fulfilled, (state, action) => {
        const index = state.toys.findIndex((toy) => toy.id === action.payload.id);
        if (index !== -1) {
          state.toys[index] = action.payload;
        }
      })
      
      .addCase(fetchToyByIdFromAPI.fulfilled, (state, action) => {
        console.log("Fetched toy by ID:", action.payload);
        const existingToyIndex = state.toys.findIndex(t => t.id === action.payload.id);
        
        if (existingToyIndex !== -1) {
          state.toys[existingToyIndex] = action.payload;
        } else {
          state.toys.push(action.payload);
        }
        
        state.loading = false;
        state.error = null;
      }) 
      .addCase(deleteToyInAPI.fulfilled, (state, action) => {
        console.log('[deleteToyInAPI.fulfilled] - Toy deleted successfully');
        const toyId = action.payload.id; // Assuming your action.payload has the id property
        state.toys = state.toys.filter(toy => toy.id !== toyId);
        state.loading = false;
        state.error = null;
      })      
      // .addCase(deleteToyInAPI.fulfilled, (state, action) => {
      //   console.log('[deleteToyInAPI.fulfilled] - Toy deleted successfully');
      //   state.toys = state.toys.filter(toy => toy.id !== action.payload.id);
      //   state.loading = false;
      //   state.error = null;
      // })
      // .addCase(deleteToyInAPI.fulfilled, (state, action) => {
      //   console.log('Toy successfully deleted:', action.payload);
      //   const id = action.payload;
      //   state.toys = state.toys.filter(toy => toy.id !== id);
      // })
      .addMatcher((action) => {
        return action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected') || action.type.endsWith('/pending');
      }, (state, action) => {
        console.log('Action:', action.type);
        console.log('New State:', state);
      })
    }
  }
});

export const { loadToy, addProfileToUserBox, removeToyFromCarousel, toyAdded, toyUpdated, toyDeleted } = toySlice.actions;

export default toySlice.reducer;
