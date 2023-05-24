import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllToys } from '../API/toyAPI';

export const fetchToysFromAPI = createAsyncThunk(
  'toys/fetchToys',
  async () => {
    const data = await getAllToys();
    return data;
  }
);

const toySlice = createSlice({
  name: 'toys',
  initialState: {
    toys: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Define other synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder.addCase(fetchToysFromAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchToysFromAPI.fulfilled, (state, action) => {
      state.loading = false;
      state.toys = action.payload;
    });
    builder.addCase(fetchToysFromAPI.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default toySlice.reducer;
