import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToysWithinRadius, getAllToys, createToy as createToyAPI, updateToy as updateToyAPI, deleteToy as deleteToyAPI, getToyById } from '../API/toyAPI';

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

export const updateToyInAPI = createAsyncThunk('toy/update', async ({toyId, toyData}) => {
  const response = await updateToyAPI(toyId, toyData);
  return response;
});

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
    addProfileToUserBox: (state, action) => {
      const toy = action.payload;
  
      if (!toy) {
          console.error('[addProfileToUserBox] - Toy payload is undefined');
          return;
      }
  
      console.log('[addProfileToUserBox] - Adding toy to box:', toy);
      
      if (state.toyBox) {  // ensure toyBox exists and is an array
          state.toyBox.push(toy);
      } else {
          console.error('[addProfileToUserBox] - state.toyBox is not initialized or is not an array');
          state.toyBox = [toy]; // Initialize it if not done
      }
  
      // Ensure state.toys and state.toys.toys both exist and the latter is an array
      if (state.toys && Array.isArray(state.toys.toys)) {
          console.log('[Debug] - state.toys.toys value:', state.toys.toys);
          state.toys.toys = state.toys.toys.filter((item) => item.id !== toy.id);
      } else {
          console.error('state.toys.toys is not an array or is undefined');
      }
  },
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
      const index = state.toys.findIndex(toy => toy.id === action.payload.id);
      if (index !== -1) {
        state.toys[index] = action.payload;
      }
    },
    toyDeleted: (state, action) => {
      const id = action.payload;
      state.toys = state.toys.filter(toy => toy.id !== id);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToysFromAPI.pending, (state) => {
        console.log('[fetchToysFromAPI.pending] - Fetching toys pending');
        state.loading = true;
      })
      .addCase(fetchToysFromAPI.fulfilled, (state, action) => {
        console.log('[fetchToysFromAPI.fulfilled] - Fetching toys fulfilled');
        state.toys = action.payload;
        state.loading = false;
        state.error = null;
      })
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
      .addCase(createToyInAPI.fulfilled, (state, action) => {
        state.toys.push(action.payload);
      })
      .addCase(updateToyInAPI.fulfilled, (state, action) => {
        const index = state.toys.findIndex(toy => toy.id === action.payload.id);
        if(index !== -1) {
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
        const index = state.toys.findIndex(toy => toy.id === action.payload);
        if(index !== -1) {
          state.toys.splice(index, 1);
        }
      });
  },
});

export const { loadToy, addProfileToUserBox, removeToyFromCarousel, toyAdded, toyUpdated, toyDeleted } = toySlice.actions;

export default toySlice.reducer;
