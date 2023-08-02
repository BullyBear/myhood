import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getToysWithinRadius, getAllToys } from '../API/toyAPI';

// Fetch toys from the API
export const fetchToysFromAPI = createAsyncThunk('toy/fetchToys', async () => {
  try {
    const toys = await getAllToys();
    return toys;
  } catch (error) {
    console.error('Error fetching toys:', error.message);
    throw error;
  }
});

// Fetch toys within a certain radius from the API
export const fetchToysWithinRadiusFromAPI = createAsyncThunk(
  'toy/fetchToysWithinRadius',
  async ({ latitude, longitude }) => {
    try {
      const toys = await getToysWithinRadius(latitude, longitude);
      return toys;
    } catch (error) {
      console.error('Error fetching toys within radius:', error.message);
      throw error;
    }
  }
);

const toySlice = createSlice({
  name: 'toy',
  initialState: { toys: [], loading: false, error: null },
  reducers: {
    addToyToBox: (state, action) => {
      const toy = action.payload;
      state.toyBox.push(toy);
      state.toys = state.toys.filter((item) => item.id !== toy.id);
    },
    removeToyFromCarousel: (state, action) => {
      const toyToRemove = action.payload;
      state.toys = state.toys.filter((item) => item.id !== toyToRemove.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToysFromAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchToysFromAPI.fulfilled, (state, action) => {
        state.toys = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchToysFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchToysWithinRadiusFromAPI.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchToysWithinRadiusFromAPI.fulfilled, (state, action) => {
        state.toys = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchToysWithinRadiusFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addToyToBox, removeToyFromCarousel } = toySlice.actions;

export default toySlice.reducer;
