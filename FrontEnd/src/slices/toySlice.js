import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToysWithinRadius, getAllToys } from '../API/toyAPI';

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

const toySlice = createSlice({
  name: 'toy',
  //initialState: { toys: [], loading: false, error: null },
  initialState: { toys: [], toyBox: [], loading: false, error: null },
  reducers: {
    addToyToBox: (state, action) => {
      const toy = action.payload;
      console.log('[addToyToBox] - Adding toy to box:', toy);
      state.toyBox.push(toy);
      state.toys = state.toys.filter((item) => item.id !== toy.id);
    },
    removeToyFromCarousel: (state, action) => {
      const toyToRemove = action.payload;
      console.log('[removeToyFromCarousel] - Removing toy from carousel:', toyToRemove);
      state.toys = state.toys.filter((item) => item.id !== toyToRemove.id);
    },
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
      });
  },
});

export const { addToyToBox, removeToyFromCarousel } = toySlice.actions;

export default toySlice.reducer;
